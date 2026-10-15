import { unstable_cache } from 'next/cache';
import {
  HOME_FEATURED_CACHE_KEY_PREFIX,
  HOME_FEATURED_CACHE_TAG,
} from '@/lib/cache/home-featured-cache';
import { dedupeInflight } from '@/lib/cache/inflight-dedup';
import type { HomeProductCardData } from '../../components/home/HomeProductCard';
import { logger } from '../utils/logger';
import { fetchHomeFeaturedProductCards } from './home-featured-products-loader';

const HOME_FEATURED_REVALIDATE_SECONDS = 600;

async function loadHomeFeaturedProducts(lang: string): Promise<HomeProductCardData[]> {
  return dedupeInflight(
    `${HOME_FEATURED_CACHE_KEY_PREFIX}${lang}`,
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
 * Cached featured-products fetch (unstable_cache + in-flight dedupe).
 */
export const getHomeFeaturedProductsCached = unstable_cache(
  loadHomeFeaturedProducts,
  ['home-featured-products-v7'],
  { revalidate: HOME_FEATURED_REVALIDATE_SECONDS, tags: [HOME_FEATURED_CACHE_TAG] }
);
