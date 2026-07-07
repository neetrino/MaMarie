import {
  invalidateServerReadCache,
  withServerReadCache,
} from '@/lib/cache/server-read-cache';

export const ADMIN_REFERENCE_CACHE_TTL_MS = 60_000;

const CACHE_KEYS = {
  categories: 'admin:categories',
  brands: 'admin:brands',
  attributes: 'admin:attributes',
} as const;

export function withAdminCategoriesCache<T>(fetcher: () => Promise<T>): Promise<T> {
  return withServerReadCache(CACHE_KEYS.categories, ADMIN_REFERENCE_CACHE_TTL_MS, fetcher);
}

export function withAdminBrandsCache<T>(fetcher: () => Promise<T>): Promise<T> {
  return withServerReadCache(CACHE_KEYS.brands, ADMIN_REFERENCE_CACHE_TTL_MS, fetcher);
}

export function withAdminAttributesCache<T>(fetcher: () => Promise<T>): Promise<T> {
  return withServerReadCache(CACHE_KEYS.attributes, ADMIN_REFERENCE_CACHE_TTL_MS, fetcher);
}

export function invalidateAdminReferenceCaches(): void {
  invalidateServerReadCache(CACHE_KEYS.categories);
  invalidateServerReadCache(CACHE_KEYS.brands);
  invalidateServerReadCache(CACHE_KEYS.attributes);
}

export function invalidateAdminCategoriesCache(): void {
  invalidateServerReadCache(CACHE_KEYS.categories);
}

export function invalidateAdminBrandsCache(): void {
  invalidateServerReadCache(CACHE_KEYS.brands);
}

export function invalidateAdminAttributesCache(): void {
  invalidateServerReadCache(CACHE_KEYS.attributes);
}
