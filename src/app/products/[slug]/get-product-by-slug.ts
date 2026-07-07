import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { withServerReadCache } from '@/lib/cache/server-read-cache';
import {
  readJsonCache,
  writeJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
} from '@/lib/cache/storefront-cache';
import { buildProductQuery } from '@/lib/services/products-slug/product-query-builder';
import { measurePdpStep } from '@/lib/services/products-slug/pdp-timing';
import { transformProduct } from '@/lib/services/products-slug/product-transformer';
import { reviewsService } from '@/lib/services/reviews.service';
import type { Review } from '@/components/ProductReviews/utils';
import { DEFAULT_LANGUAGE, type LanguageCode } from '@/lib/language';
import type { Product } from './types';

/** In-process + Next data cache for PDP SSR (seconds). */
const PDP_SERVER_CACHE_TTL_MS = 30_000;
const PDP_UNSTABLE_REVALIDATE_SECONDS = 30;

async function fetchProductPayload(slug: string, lang: LanguageCode): Promise<Product | null> {
  const cacheKey = STOREFRONT_CACHE_KEYS.productDetails(lang, slug);
  const cached = await measurePdpStep(slug, 'cache-read-product', () => readJsonCache<Product>(cacheKey));
  if (cached) {
    return cached;
  }

  const raw = await measurePdpStep(slug, 'build-product-query', () => buildProductQuery(slug, lang));
  if (!raw) {
    return null;
  }

  try {
    const body = await measurePdpStep(slug, 'transform-product', () =>
      transformProduct(raw, lang) as Promise<Product>,
    );
    await measurePdpStep(slug, 'cache-write-product', () =>
      writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productDetails, body),
    );
    return body;
  } catch {
    return null;
  }
}

export type ProductPageCore = {
  product: Product;
  reviews: Review[];
};

async function fetchProductPageCorePayload(slug: string, lang: LanguageCode): Promise<ProductPageCore | null> {
  const cacheKey = STOREFRONT_CACHE_KEYS.productDetails(lang, slug);
  const cachedProduct = await measurePdpStep(slug, 'cache-read-core', () =>
    readJsonCache<Product>(cacheKey),
  );

  if (cachedProduct) {
    const reviews = await measurePdpStep(slug, 'reviews', () =>
      reviewsService.getProductReviews(cachedProduct.id, { publishedOnly: true }),
    );
    return { product: cachedProduct, reviews: reviews as Review[] };
  }

  const raw = await measurePdpStep(slug, 'build-product-query', () => buildProductQuery(slug, lang));
  if (!raw) {
    return null;
  }

  const [product, reviews] = await measurePdpStep(slug, 'transform-and-reviews', () =>
    Promise.all([
      transformProduct(raw, lang) as Promise<Product>,
      reviewsService.getProductReviews(raw.id, { publishedOnly: true }),
    ]),
  );

  await measurePdpStep(slug, 'cache-write-core', () =>
    writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productDetails, product),
  );
  return { product, reviews: reviews as Review[] };
}

const fetchProductPayloadCached = unstable_cache(
  async (slug: string, lang: LanguageCode): Promise<Product | null> =>
    withServerReadCache(
      `storefront:pdp:product:${lang}:${slug}`,
      PDP_SERVER_CACHE_TTL_MS,
      () => fetchProductPayload(slug, lang),
    ),
  ['storefront-pdp-product-v1'],
  { revalidate: PDP_UNSTABLE_REVALIDATE_SECONDS },
);

const fetchProductPageCoreCached = unstable_cache(
  async (slug: string, lang: LanguageCode): Promise<ProductPageCore | null> =>
    withServerReadCache(
      `storefront:pdp:core:${lang}:${slug}`,
      PDP_SERVER_CACHE_TTL_MS,
      () => fetchProductPageCorePayload(slug, lang),
    ),
  ['storefront-pdp-core-v1'],
  { revalidate: PDP_UNSTABLE_REVALIDATE_SECONDS },
);

/** Cached PDP payload — deduped per request (metadata + page share one fetch). */
export const getProductBySlug = cache(
  async (slug: string, lang: LanguageCode = DEFAULT_LANGUAGE): Promise<Product | null> =>
    measurePdpStep(slug, 'pdp-core-total', () => fetchProductPayloadCached(slug, lang)),
);

/** Product + reviews in one cached round-trip (transform ∥ reviews on cold miss). */
export const getProductPageCore = cache(
  async (slug: string, lang: LanguageCode = DEFAULT_LANGUAGE): Promise<ProductPageCore | null> =>
    measurePdpStep(slug, 'pdp-core-total', () => fetchProductPageCoreCached(slug, lang)),
);
