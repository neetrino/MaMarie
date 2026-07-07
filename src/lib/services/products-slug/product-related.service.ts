import type { Prisma } from "@white-shop/db";
import { db } from "@white-shop/db";
import {
  readJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  writeJsonCache,
} from "@/lib/cache/storefront-cache";
import { withServerReadCache } from "@/lib/cache/server-read-cache";
import { logger } from "../../utils/logger";
import { getBaseWhere } from "./product-query-builder";
import {
  transformRelatedProductRows,
  type RelatedCardPayload,
  type RelatedProductRow,
} from "./product-related-transform";

const RELATED_PROCESS_CACHE_TTL_MS = 30_000;
const RELATED_CANDIDATE_LIMIT = 14;

/** Card payload only — variant `attributes` JSON, no option/attribute joins. */
const relatedProductSelect = {
  id: true,
  discountPercent: true,
  primaryCategoryId: true,
  brandId: true,
  media: true,
  translations: {
    select: { slug: true, title: true, locale: true },
    take: 6,
  },
  brand: {
    select: {
      id: true,
      translations: {
        select: { name: true, locale: true },
        take: 6,
      },
    },
  },
  variants: {
    where: { published: true },
    orderBy: { price: "asc" as const },
    select: {
      id: true,
      price: true,
      compareAtPrice: true,
      stock: true,
      sku: true,
      attributes: true,
    },
  },
  categories: {
    select: {
      id: true,
      translations: {
        select: { slug: true, title: true, locale: true },
        take: 4,
      },
    },
  },
} satisfies Prisma.ProductSelect;

function buildCategoryScopeWhere(categoryId: string): Prisma.ProductWhereInput {
  return {
    OR: [
      { primaryCategoryId: categoryId },
      { categoryIds: { has: categoryId } },
    ],
  };
}

async function fetchRelatedRows(
  excludeProductId: string,
  lang: string,
  categoryId: string | null | undefined,
): Promise<RelatedCardPayload[]> {
  const baseWhere: Prisma.ProductWhereInput = {
    published: true,
    deletedAt: null,
    id: { not: excludeProductId },
    variants: { some: { published: true } },
  };

  const where: Prisma.ProductWhereInput = categoryId
    ? { ...baseWhere, AND: buildCategoryScopeWhere(categoryId) }
    : baseWhere;

  const rows = await db.product.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: RELATED_CANDIDATE_LIMIT,
    select: relatedProductSelect,
  });

  return transformRelatedProductRows(rows as RelatedProductRow[], lang);
}

type RelatedProductsResult = { data: RelatedCardPayload[]; meta: { total: number } };

const EMPTY_RELATED: RelatedProductsResult = { data: [], meta: { total: 0 } };

function finalizeRelatedRows(
  rows: RelatedCardPayload[],
  excludeProductId: string,
): RelatedProductsResult {
  const filtered = rows
    .filter((product) => product.id !== excludeProductId && product.slug.length > 0)
    .slice(0, 10);
  return { data: filtered, meta: { total: filtered.length } };
}

/**
 * Related products when product id is already known (PDP orchestrator — no extra slug lookup).
 */
export async function findRelatedByProductId(
  productId: string,
  lang: string,
  categoryId: string | null | undefined,
): Promise<RelatedProductsResult> {
  try {
    const data = await fetchRelatedRows(productId, lang, categoryId);
    return finalizeRelatedRows(data, productId);
  } catch (error: unknown) {
    logger.warn("findRelatedByProductId failed", {
      productId,
      lang,
      error: error instanceof Error ? error.message : String(error),
    });
    return EMPTY_RELATED;
  }
}

async function loadRelatedForStorefront(
  slug: string,
  lang: string,
  productId: string,
  categoryId: string | null | undefined,
): Promise<RelatedProductsResult> {
  return withServerReadCache(
    `storefront:pdp:related:${lang}:${slug}`,
    RELATED_PROCESS_CACHE_TTL_MS,
    () => findRelatedByProductId(productId, lang, categoryId),
  );
}

/**
 * Redis + in-process cache; use when product id is already resolved (SSR Suspense, warm PDP).
 */
export async function findRelatedForStorefront(
  slug: string,
  lang: string,
  productId: string,
  categoryId: string | null | undefined,
): Promise<RelatedProductsResult> {
  const cacheKey = STOREFRONT_CACHE_KEYS.productRelated(lang, slug);
  const cached = await readJsonCache<RelatedProductsResult>(cacheKey);
  if (cached) {
    return cached;
  }

  const result = await loadRelatedForStorefront(slug, lang, productId, categoryId);
  await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productRelated, result);
  return result;
}

/**
 * Related products for API routes — slug lookup, then category-scoped list query.
 */
async function findRelatedByProductSlugUncached(slug: string, lang: string) {
  try {
    const product = await db.product.findFirst({
      where: getBaseWhere(slug, lang),
      select: {
        id: true,
        primaryCategoryId: true,
      },
    });

    if (!product) {
      return EMPTY_RELATED;
    }

    return findRelatedForStorefront(slug, lang, product.id, product.primaryCategoryId);
  } catch (error: unknown) {
    logger.warn("findRelatedByProductSlug failed", {
      slug,
      lang,
      error: error instanceof Error ? error.message : String(error),
    });
    return EMPTY_RELATED;
  }
}

export async function findRelatedByProductSlug(slug: string, lang: string) {
  return findRelatedByProductSlugUncached(slug, lang);
}
