import {
  invalidateServerReadCache,
  invalidateServerReadCachePrefix,
  withServerReadCache,
} from '@/lib/cache/server-read-cache';
import type { ProductFilters } from './types';

const ADMIN_PRODUCTS_LIST_CACHE_TTL_MS = 20_000;

/** Stable server cache key for admin product list reads. */
export function buildAdminProductsListCacheKey(filters: ProductFilters): string {
  const normalized = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
    search: filters.search?.trim() || undefined,
    category: filters.category?.trim() || undefined,
    categories: filters.categories?.length ? [...filters.categories].sort() : undefined,
    sku: filters.sku?.trim() || undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort?.trim() || undefined,
  };

  return `admin:products:list:${JSON.stringify(normalized)}`;
}

/** Cached admin product list read (short TTL, invalidated on writes). */
export async function withAdminProductsListCache<T>(
  filters: ProductFilters,
  fetcher: () => Promise<T>
): Promise<T> {
  return withServerReadCache(
    buildAdminProductsListCacheKey(filters),
    ADMIN_PRODUCTS_LIST_CACHE_TTL_MS,
    fetcher
  );
}

/** Call after any admin product mutation. */
export function invalidateAdminProductsListCache(): void {
  invalidateServerReadCachePrefix('admin:products:list:');
  invalidateServerReadCachePrefix('admin:dashboard:');
  invalidateServerReadCache('admin:stats');
}
