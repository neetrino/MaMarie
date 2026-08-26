import { revalidateTag } from "next/cache";
import { logger } from "@/lib/utils/logger";
import { invalidateServerReadCachePrefix } from "./server-read-cache";

export const HOME_FEATURED_CACHE_KEY_PREFIX = "storefront:home:featured:";
export const HOME_FEATURED_CACHE_TAG = "home-featured-products";

/** Drop in-process + Next data cache for homepage best products. */
export function invalidateHomeFeaturedProductsCache(): void {
  invalidateServerReadCachePrefix(HOME_FEATURED_CACHE_KEY_PREFIX);
  try {
    // @ts-expect-error - revalidateTag type issue in Next.js
    revalidateTag(HOME_FEATURED_CACHE_TAG);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn("Home featured cache tag revalidation skipped", { error: message });
  }
}
