import { apiClient } from '@/lib/api-client';
import {
  fetchAdminQuery,
  invalidateAdminQuery,
  invalidateAdminQueryPrefix,
} from '@/lib/admin/admin-query-cache';

type QueryParamValue = string | number | boolean | undefined | null;

/**
 * Builds a stable cache key from query params (sorted, empty values omitted).
 */
export function buildAdminListQueryKey(
  prefix: string,
  params: Record<string, QueryParamValue>
): string {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join('&');

  return query ? `${prefix}?${query}` : prefix;
}

/**
 * Cached admin list GET with in-flight deduplication (Strict Mode safe).
 */
export async function fetchAdminList<T>(
  cachePrefix: string,
  path: string,
  params: Record<string, QueryParamValue>,
  staleTimeMs: number,
  force = false
): Promise<T> {
  const key = buildAdminListQueryKey(cachePrefix, params);
  if (force) {
    invalidateAdminQuery(key);
  }

  const apiParams: Record<string, string> = {};
  for (const [paramKey, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      apiParams[paramKey] = String(value);
    }
  }

  return fetchAdminQuery(
    key,
    () => apiClient.get<T>(path, { params: apiParams }),
    { staleTimeMs, force }
  );
}

/**
 * Cached singleton admin GET (delivery, price-filter, etc.).
 */
export async function fetchAdminResource<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  staleTimeMs: number,
  force = false
): Promise<T> {
  if (force) {
    invalidateAdminQuery(cacheKey);
  }
  return fetchAdminQuery(cacheKey, fetcher, { staleTimeMs, force });
}

export { invalidateAdminQuery, invalidateAdminQueryPrefix };
