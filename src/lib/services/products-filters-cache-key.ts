import { DEFAULT_LANGUAGE } from '@/lib/language';

const FILTERS_CACHE_PREFIX = 'storefront:catalog-filters';

export function buildStorefrontFiltersCacheKey(filters: {
  category?: string;
  categoryScope?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  lang?: string;
}): string {
  return [
    FILTERS_CACHE_PREFIX,
    'v5',
    filters.lang ?? DEFAULT_LANGUAGE,
    filters.category ?? '',
    filters.categoryScope ?? '',
    filters.search ?? '',
    filters.minPrice ?? '',
    filters.maxPrice ?? '',
  ].join(':');
}
