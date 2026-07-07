import { Prisma } from "@white-shop/db";
import { db } from "@white-shop/db";
import { withServerReadCache } from "@/lib/cache/server-read-cache";
import { logger } from "../../../utils/logger";
import { fetchAdminProductListRows } from "./list-query-batcher";

const COUNT_CACHE_TTL_MS = 30_000;

async function countProductsWithCache(where: Prisma.ProductWhereInput): Promise<number> {
  const cacheKey = `admin:products:count:${JSON.stringify(where)}`;

  return withServerReadCache(cacheKey, COUNT_CACHE_TTL_MS, async () => {
    const COUNT_TIMEOUT_MS = 10_000;
    const countResult = await Promise.race([
      db.product.count({ where }),
      new Promise<number>((_, reject) => {
        setTimeout(() => reject(new Error("Count query timeout")), COUNT_TIMEOUT_MS);
      }),
    ]).catch((countError: unknown) => {
      logger.warn("Count query failed or timed out, using estimated total", {
        error: countError instanceof Error ? countError.message : String(countError),
      });
      return -1;
    });

    if (countResult === -1) {
      throw new Error("Count query failed");
    }

    return countResult;
  }).catch(() => -1);
}

/**
 * Base include configuration for product detail queries
 */
const getProductDetailInclude = () => ({
  translations: true,
  brand: {
    include: {
      translations: true,
    },
  },
  categories: {
    include: {
      translations: true,
    },
  },
  variants: {
    include: {
      options: {
        include: {
          attributeValue: {
            include: {
              attribute: true,
              translations: true,
            },
          },
        },
      },
    },
    orderBy: {
      position: "asc" as const,
    },
  },
  labels: true,
});

/**
 * ProductAttributes include configuration
 */
const getProductAttributesInclude = () => ({
  productAttributes: {
    include: {
      attribute: true,
    },
  },
});

/**
 * Check if error is related to product_variants.attributes column
 */
function isVariantAttributesError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return errorMessage.includes('product_variants.attributes') || 
         (errorMessage.includes('attributes') && errorMessage.includes('does not exist'));
}

/**
 * Check if error is related to productAttributes table
 */
function isProductAttributesError(error: unknown): boolean {
  const errorObj = error as { code?: string; message?: string };
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (errorObj && typeof errorObj === 'object' && 'code' in errorObj && errorObj.code === 'P2021') || 
         errorMessage.includes('productAttributes') || 
         errorMessage.includes('does not exist');
}

/**
 * Execute product list query with error handling
 */
export async function executeProductListQuery(
  where: Prisma.ProductWhereInput,
  orderBy: Prisma.ProductOrderByWithRelationInput,
  skip: number,
  take: number
) {
  const queryStartTime = Date.now();

  try {
    logger.debug('Fetching product list...');
    const products = await fetchAdminProductListRows(where, orderBy, skip, take);

    let total: number;
    if (products.length < take) {
      total = skip + products.length;
    } else {
      const countResult = await countProductsWithCache(where);
      total = countResult === -1 ? skip + products.length : countResult;
    }

    const queryTime = Date.now() - queryStartTime;
    logger.debug(`All database queries completed in ${queryTime}ms`, {
      productCount: products.length,
      total,
    });

    return { products, total };
  } catch (error: unknown) {
    const queryTime = Date.now() - queryStartTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorObj = error as { code?: string; meta?: unknown; stack?: string };
    logger.error(`Database query error after ${queryTime}ms`, {
      error: {
        message: errorMessage,
        code: errorObj?.code,
        meta: errorObj?.meta,
        stack: errorObj?.stack?.substring(0, 500),
      },
    });

    throw error;
  }
}

/**
 * Execute product detail query with error handling
 */
export async function executeProductDetailQuery(productId: string) {
  try {
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        ...getProductDetailInclude(),
        ...getProductAttributesInclude(),
      },
    });
    return product;
  } catch (error: unknown) {
    // If productAttributes table doesn't exist, retry without it
    if (isProductAttributesError(error)) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn('productAttributes table not found, fetching without it', { error: errorMessage });
      const product = await db.product.findUnique({
        where: { id: productId },
        include: getProductDetailInclude(),
      });
      return product;
    }
    throw error;
  }
}

