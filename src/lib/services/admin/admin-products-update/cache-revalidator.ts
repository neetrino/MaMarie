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
 * Redis is cleared before Next tags/paths, otherwise a regeneration racing this call
 * would read the old Redis payload and store it back into the Next data cache.
 */
export async function revalidateProductCache(
  productId: string,
  productSlug: string | undefined
) {
  try {
    logger.debug('Revalidating paths for product', { productId });
    await cacheService.deletePattern("products:*");
    await invalidateProductPageCaches();
    await invalidateStorefrontProductRelatedCaches();
    invalidateAdminProductsListCache();

    invalidateHomeFeaturedProductsCache();
    revalidateTag(STOREFRONT_PRODUCTS_CACHE_TAG, { expire: 0 });
    revalidateTag(`product-${productId}`, { expire: 0 });
    if (productSlug) {
      revalidatePath(`/products/${productSlug}`);
    }
    revalidatePath('/');
    revalidatePath('/products');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn('Revalidation failed (expected in some environments)', { error: errorMessage });
  }
}




