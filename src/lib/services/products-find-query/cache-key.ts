import type { ProductFilters } from './types';

/** Stable in-process cache key for storefront product find queries. */
export function buildStorefrontFindQueryCacheKey(filters: ProductFilters): string {
  const normalized = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
    lang: filters.lang ?? 'en',
    category: filters.category?.trim() || undefined,
    search: filters.search?.trim() || undefined,
    filter: filters.filter?.trim() || undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    colors: filters.colors?.trim() || undefined,
    sizes: filters.sizes?.trim() || undefined,
    brand: filters.brand?.trim() || undefined,
    clothingTypes: filters.clothingTypes?.trim() || undefined,
    sort: filters.sort?.trim() || undefined,
    ids: filters.ids?.length ? [...filters.ids].sort() : undefined,
  };

  return `storefront:products:query:${JSON.stringify(normalized)}`;
}
