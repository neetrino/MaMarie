const FILTERS_CACHE_PREFIX = 'storefront:catalog-filters';

export function buildStorefrontFiltersCacheKey(filters: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  lang?: string;
}): string {
  return [
    FILTERS_CACHE_PREFIX,
    filters.lang ?? 'en',
    filters.category ?? '',
    filters.search ?? '',
    filters.minPrice ?? '',
    filters.maxPrice ?? '',
  ].join(':');
}
