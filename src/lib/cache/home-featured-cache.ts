import { revalidateTag } from "next/cache";
import { logger } from "@/lib/utils/logger";

export const HOME_FEATURED_CACHE_KEY_PREFIX = "storefront:home:featured:";
export const HOME_FEATURED_CACHE_TAG = "home-featured-products";

/** Drop Next data cache for homepage best products. */
export function invalidateHomeFeaturedProductsCache(): void {
  try {
    revalidateTag(HOME_FEATURED_CACHE_TAG, { expire: 0 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn("Home featured cache tag revalidation skipped", { error: message });
  }
}
