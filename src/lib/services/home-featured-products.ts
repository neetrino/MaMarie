import { unstable_cache } from 'next/cache';
import { withServerReadCache } from '@/lib/cache/server-read-cache';
import type { HomeProductCardData } from '../../components/home/HomeProductCard';
import { logger } from '../utils/logger';
import { fetchHomeFeaturedProductCards } from './home-featured-products-loader';

const HOME_FEATURED_REVALIDATE_SECONDS = 600;
const HOME_FEATURED_PROCESS_CACHE_TTL_MS = 300_000;

async function loadHomeFeaturedProducts(lang: string): Promise<HomeProductCardData[]> {
  return withServerReadCache(
    `storefront:home:featured:${lang}`,
    HOME_FEATURED_PROCESS_CACHE_TTL_MS,
    async () => {
      try {
        return await fetchHomeFeaturedProductCards(lang);
      } catch (error) {
        logger.error('Failed to load home featured products', { error, lang });
        return [];
      }
    }
  );
}

/**
 * Cached featured-products fetch (unstable_cache + in-process cache for dev).
 */
export const getHomeFeaturedProductsCached = unstable_cache(
  loadHomeFeaturedProducts,
  ['home-featured-products-v6'],
  { revalidate: HOME_FEATURED_REVALIDATE_SECONDS }
);
