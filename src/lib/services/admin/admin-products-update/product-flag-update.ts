import { db } from "@white-shop/db";
import type { Prisma } from "@white-shop/db";
import { revalidatePath } from "next/cache";
import { logger } from "../../../utils/logger";
import { invalidateAdminProductsListCache } from "../admin-products-read/list-cache";
import type { UpdateProductData } from "./types";

const FLAG_ONLY_KEYS = new Set<keyof UpdateProductData>(["featured", "published"]);

/** True when the payload only toggles featured and/or published. */
export function isProductFlagOnlyUpdate(data: UpdateProductData): boolean {
  const keys = Object.keys(data) as (keyof UpdateProductData)[];
  if (keys.length === 0) {
    return false;
  }
  return keys.every((key) => FLAG_ONLY_KEYS.has(key));
}

/**
 * Fast path for featured/published toggles — skips variants, attributes, and image sync.
 */
export async function updateProductFlagsOnly(productId: string, data: UpdateProductData) {
  const existing = await db.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      publishedAt: true,
      translations: { select: { slug: true }, take: 1 },
    },
  });

  if (!existing) {
    throw {
      status: 404,
      type: "https://api.shop.am/problems/not-found",
      title: "Product not found",
      detail: `Product with id '${productId}' does not exist`,
    };
  }

  const updateData: Prisma.ProductUpdateInput = {};

  if (data.featured !== undefined) {
    updateData.featured = data.featured;
  }

  if (data.published !== undefined) {
    updateData.published = data.published;
    if (data.published && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  logger.info("Updating product flags", { productId, featured: data.featured, published: data.published });

  const result = await db.product.update({
    where: { id: productId },
    data: updateData,
    include: {
      translations: true,
    },
  });

  invalidateAdminProductsListCache();

  try {
    revalidatePath("/");
    revalidatePath("/products");
    const slug = existing.translations[0]?.slug;
    if (slug) {
      revalidatePath(`/products/${slug}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn("Flag update revalidation skipped", { productId, error: message });
  }

  return result;
}
