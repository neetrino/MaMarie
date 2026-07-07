import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { withServerReadCache } from '@/lib/cache/server-read-cache';
import { dedupeInflight } from '@/lib/cache/inflight-dedup';
import {
  readJsonCache,
  writeJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  stableSearchParamsKey,
} from '@/lib/cache/storefront-cache';
import { productsFiltersService } from './products-filters.service';

const SERVER_READ_CACHE_TTL_MS = 60_000;
const UNSTABLE_REVALIDATE_SECONDS = 60;

export interface StorefrontProductsFiltersInput {
  lang: string;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type StorefrontProductsFiltersResult = Awaited<
  ReturnType<typeof productsFiltersService.getFilters>
>;

function buildFiltersSearchParams(input: StorefrontProductsFiltersInput): URLSearchParams {
  const params = new URLSearchParams();
  params.set('lang', input.lang);
  if (input.category) {
    params.set('category', input.category);
  }
  if (input.search) {
    params.set('search', input.search);
  }
  if (input.minPrice !== undefined) {
    params.set('minPrice', String(input.minPrice));
  }
  if (input.maxPrice !== undefined) {
    params.set('maxPrice', String(input.maxPrice));
  }
  return params;
}

function buildInflightKey(stableKey: string): string {
  return `storefront:filters:${stableKey}`;
}

async function fetchFiltersPayload(
  input: StorefrontProductsFiltersInput
): Promise<StorefrontProductsFiltersResult> {
  const stableKey = stableSearchParamsKey(buildFiltersSearchParams(input));
  const cacheKey = STOREFRONT_CACHE_KEYS.productsFilters(stableKey);
  const cached = await readJsonCache<StorefrontProductsFiltersResult>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  const result = await dedupeInflight(buildInflightKey(stableKey), () =>
    productsFiltersService.getFilters(input)
  );

  await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productsFilters, result);
  return result;
}

const fetchFiltersByStableKey = unstable_cache(
  async (stableKey: string, inputJson: string): Promise<StorefrontProductsFiltersResult> => {
    const input = JSON.parse(inputJson) as StorefrontProductsFiltersInput;
    return withServerReadCache(
      buildInflightKey(stableKey),
      SERVER_READ_CACHE_TTL_MS,
      () => fetchFiltersPayload(input)
    );
  },
  ['storefront-products-filters-v1'],
  { revalidate: UNSTABLE_REVALIDATE_SECONDS }
);

/** Cached storefront catalog filters — Redis first, shared by SSR and API. */
export async function getStorefrontProductsFilters(
  input: StorefrontProductsFiltersInput
): Promise<StorefrontProductsFiltersResult> {
  const stableKey = stableSearchParamsKey(buildFiltersSearchParams(input));
  return fetchFiltersByStableKey(stableKey, JSON.stringify(input));
}

/** Per-request dedupe for catalog SSR (page + metadata share one fetch). */
export const getStorefrontProductsFiltersForCatalog = cache(
  async (input: StorefrontProductsFiltersInput): Promise<StorefrontProductsFiltersResult> =>
    getStorefrontProductsFilters(input)
);
