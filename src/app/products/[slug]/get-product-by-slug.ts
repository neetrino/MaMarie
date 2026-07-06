import { cache } from 'react';
import {
  readJsonCache,
  writeJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
} from '@/lib/cache/storefront-cache';
import { productsSlugService } from '@/lib/services/products-slug.service';
import { DEFAULT_LANGUAGE, type LanguageCode } from '@/lib/language';
import type { Product } from './types';

async function loadProduct(slug: string, lang: LanguageCode): Promise<Product | null> {
  const cacheKey = STOREFRONT_CACHE_KEYS.productDetails(lang, slug);
  const cached = await readJsonCache<Product>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const body = (await productsSlugService.findBySlug(slug, lang)) as Product;
    await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productDetails, body);
    return body;
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err?.status === 404 && lang !== 'en') {
      try {
        const fallback = (await productsSlugService.findBySlug(slug, 'en')) as Product;
        await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productDetails, fallback);
        return fallback;
      } catch {
        return null;
      }
    }
    return null;
  }
}

/** Cached PDP payload — deduped per request (metadata + page share one fetch). */
export const getProductBySlug = cache(
  async (slug: string, lang: LanguageCode = DEFAULT_LANGUAGE): Promise<Product | null> => {
    return loadProduct(slug, lang);
  },
);
