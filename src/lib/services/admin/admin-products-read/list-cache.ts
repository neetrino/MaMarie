import { dedupeInflight } from '@/lib/cache/inflight-dedup';
import {
  invalidateServerReadCache,
  invalidateServerReadCachePrefix,
} from '@/lib/cache/server-read-cache';
import type { ProductFilters } from './types';

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

/** Admin product list read — always fresh from DB, concurrent identical requests share one query. */
export async function withAdminProductsListCache<T>(
  filters: ProductFilters,
  fetcher: () => Promise<T>
): Promise<T> {
  return dedupeInflight(buildAdminProductsListCacheKey(filters), fetcher);
}

/** Call after any admin product mutation — drops dashboard aggregates derived from products. */
export function invalidateAdminProductsListCache(): void {
  invalidateServerReadCachePrefix('admin:dashboard:');
  invalidateServerReadCache('admin:stats');
}
