import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { withServerReadCache } from '@/lib/cache/server-read-cache';
import { dedupeInflight } from '@/lib/cache/inflight-dedup';
import {
  readJsonCache,
  writeJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  stableSearchParamsKey,
} from '@/lib/cache/storefront-cache';
import {
  parseProductsCatalogParams,
  serializeProductsCatalogParams,
  type ProductsCatalogParams,
} from '@/lib/products-catalog-params';
import { productsService } from './products.service';
import type { ProductFilters } from './products-find-query.service';

const FEATURED_LIST_CACHE_TTL_SECONDS = 600;
const SERVER_READ_CACHE_TTL_MS = 60_000;
const UNSTABLE_REVALIDATE_SECONDS = 60;

export type StorefrontProductsListResult = Awaited<ReturnType<typeof productsService.findAll>>;

function parseOptionalPrice(value?: string): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }
  const parsed = Number.parseFloat(value.trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Maps catalog URL params to the product find service filter shape. */
export function catalogParamsToProductFilters(
  params: ProductsCatalogParams,
  lang: string
): ProductFilters {
  return {
    page: params.page,
    limit: params.limit,
    lang,
    search: params.search,
    category: params.category,
    minPrice: parseOptionalPrice(params.minPrice),
    maxPrice: parseOptionalPrice(params.maxPrice),
    colors: params.colors,
    sizes: params.sizes,
    brand: params.brand,
    clothingTypes: params.clothingTypes,
    sort: params.sort ?? 'createdAt',
  };
}

/** Parses `/api/v1/products` query params into product filters. */
export function parseProductListFiltersFromSearchParams(
  searchParams: URLSearchParams
): ProductFilters {
  const catalogParams = parseProductsCatalogParams(searchParams);
  const lang = searchParams.get('lang') || 'en';

  const idsParam = searchParams.get('ids');
  const ids = idsParam
    ? idsParam
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0)
    : undefined;

  return {
    ...catalogParamsToProductFilters(catalogParams, lang),
    ids,
    filter: searchParams.get('filter') || searchParams.get('filters') || undefined,
    sort: searchParams.get('sort') || catalogParams.sort || 'createdAt',
  };
}

function buildSearchParamsFromFilters(filters: ProductFilters): URLSearchParams {
  const query = serializeProductsCatalogParams({
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
    search: filters.search,
    category: filters.category,
    minPrice: filters.minPrice?.toString(),
    maxPrice: filters.maxPrice?.toString(),
    colors: filters.colors,
    sizes: filters.sizes,
    brand: filters.brand,
    clothingTypes: filters.clothingTypes,
    sort: filters.sort,
  });

  if (filters.lang) {
    query.set('lang', filters.lang);
  }
  if (filters.ids?.length) {
    query.set('ids', filters.ids.join(','));
  }
  if (filters.filter) {
    query.set('filter', filters.filter);
  }

  return query;
}

/** Stable Redis key for a product list request. */
export function buildStorefrontProductsListCacheKey(searchParams: URLSearchParams): string {
  return stableSearchParamsKey(searchParams);
}

function resolveProductsListCacheTtl(filters: ProductFilters): number {
  const onlyFeatured =
    Boolean(filters.filter) &&
    ['new', 'bestseller', 'featured'].includes(filters.filter ?? '') &&
    !filters.category &&
    !filters.search &&
    (filters.limit ?? 12) <= 24;

  return onlyFeatured
    ? FEATURED_LIST_CACHE_TTL_SECONDS
    : STOREFRONT_CACHE_TTL.productsList;
}

function buildInflightKey(stableKey: string): string {
  return `storefront:products:${stableKey}`;
}

async function fetchProductsListPayload(filters: ProductFilters): Promise<StorefrontProductsListResult> {
  const stableKey = buildStorefrontProductsListCacheKey(buildSearchParamsFromFilters(filters));
  const cacheKey = STOREFRONT_CACHE_KEYS.productsList(stableKey);
  const cached = await readJsonCache<StorefrontProductsListResult>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  const result = await dedupeInflight(buildInflightKey(stableKey), () =>
    productsService.findAll(filters)
  );

  await writeJsonCache(cacheKey, resolveProductsListCacheTtl(filters), result);
  return result;
}

const fetchProductsListByStableKey = unstable_cache(
  async (stableKey: string, filtersJson: string): Promise<StorefrontProductsListResult> => {
    const filters = JSON.parse(filtersJson) as ProductFilters;
    return withServerReadCache(
      buildInflightKey(stableKey),
      SERVER_READ_CACHE_TTL_MS,
      () => fetchProductsListPayload(filters)
    );
  },
  ['storefront-products-list-v1'],
  { revalidate: UNSTABLE_REVALIDATE_SECONDS }
);

/** Cached storefront catalog list — Redis first, shared by SSR and API. */
export async function getStorefrontProductsList(
  filters: ProductFilters
): Promise<StorefrontProductsListResult> {
  const stableKey = buildStorefrontProductsListCacheKey(buildSearchParamsFromFilters(filters));
  return fetchProductsListByStableKey(stableKey, JSON.stringify(filters));
}

/** Per-request dedupe for catalog SSR (metadata + page share one fetch). */
export const getStorefrontProductsListForCatalog = cache(
  async (
    params: ProductsCatalogParams,
    lang: string
  ): Promise<StorefrontProductsListResult> =>
    getStorefrontProductsList(catalogParamsToProductFilters(params, lang))
);
