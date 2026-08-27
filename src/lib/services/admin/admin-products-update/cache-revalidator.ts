import { revalidatePath, revalidateTag } from "next/cache";
import { invalidateHomeFeaturedProductsCache } from "@/lib/cache/home-featured-cache";
import {
  STOREFRONT_PRODUCTS_CACHE_TAG,
  invalidateProductPageCaches,
  invalidateStorefrontProductRelatedCaches,
} from "@/lib/cache/storefront-cache";
import { logger } from "../../../utils/logger";
import { cacheService } from "../../cache.service";
import { invalidateAdminProductsListCache } from "../admin-products-read/list-cache";

/**
 * Revalidate storefront + admin caches after product create / update / delete.
 */
export async function revalidateProductCache(
  productId: string,
  productSlug: string | undefined
) {
  try {
    logger.debug('Revalidating paths for product', { productId });
    if (productSlug) {
      revalidatePath(`/products/${productSlug}`);
    }
    revalidatePath('/');
    revalidatePath('/products');
    invalidateHomeFeaturedProductsCache();
    invalidateAdminProductsListCache();
    // @ts-expect-error - revalidateTag type issue in Next.js
    revalidateTag(STOREFRONT_PRODUCTS_CACHE_TAG);
    // @ts-expect-error - revalidateTag type issue in Next.js
    revalidateTag(`product-${productId}`);

    await cacheService.deletePattern("products:*");
    await invalidateProductPageCaches();
    await invalidateStorefrontProductRelatedCaches();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn('Revalidation failed (expected in some environments)', { error: errorMessage });
  }
}




