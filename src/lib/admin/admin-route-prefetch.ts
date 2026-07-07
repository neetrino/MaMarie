import { apiClient } from '@/lib/api-client';
import {
  buildAdminListQueryKey,
  fetchAdminList,
  fetchAdminResource,
} from '@/lib/admin/admin-fetch';
import {
  ADMIN_DEFAULT_MESSAGES_LIST_PARAMS,
  ADMIN_DEFAULT_ORDERS_LIST_PARAMS,
  ADMIN_DEFAULT_USERS_LIST_PARAMS,
} from '@/lib/admin/admin-list-default-params';
import { buildAdminProductListParams } from '@/lib/admin/admin-product-list-params';
import { fetchAdminQuery, isAdminQueryFresh } from '@/lib/admin/admin-query-cache';
import {
  ADMIN_ANALYTICS_STALE_MS,
  ADMIN_DASHBOARD_STALE_MS,
  ADMIN_LIST_STALE_MS,
  ADMIN_QUERY_KEYS,
  ADMIN_QUERY_PREFIX,
  ADMIN_RESOURCE_STALE_MS,
  ADMIN_STATS_STALE_MS,
} from '@/lib/admin/admin-query-keys';
import {
  loadAdminAttributes,
  loadAdminBrands,
  loadAdminCategories,
  loadAdminDashboardSummary,
  loadAdminSettings,
  loadAdminStats,
} from '@/lib/admin/admin-reference-loaders';

function prefetchListIfStale(
  prefix: string,
  path: string,
  params: Record<string, string>,
  staleTimeMs: number
): void {
  const key = buildAdminListQueryKey(prefix, params);
  if (isAdminQueryFresh(key, staleTimeMs)) {
    return;
  }
  void fetchAdminList(prefix, path, params, staleTimeMs);
}

function prefetchResourceIfStale(
  cacheKey: string,
  fetcher: () => Promise<unknown>,
  staleTimeMs: number
): void {
  if (isAdminQueryFresh(cacheKey, staleTimeMs)) {
    return;
  }
  void fetchAdminResource(cacheKey, fetcher, staleTimeMs);
}

const PREFETCH_COOLDOWN_MS = 5_000;
const lastPrefetchAt = new Map<string, number>();

/**
 * Prefetch API data for an admin route (sidebar hover / touch intent).
 * Skips when cache is already fresh — deduped by admin-query-cache.
 */
export function prefetchAdminRoute(path: string): void {
  const now = Date.now();
  const lastAt = lastPrefetchAt.get(path) ?? 0;
  if (now - lastAt < PREFETCH_COOLDOWN_MS) {
    return;
  }
  lastPrefetchAt.set(path, now);

  switch (path) {
    case '/supersudo':
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.dashboardSummary, ADMIN_DASHBOARD_STALE_MS)) {
        void loadAdminDashboardSummary(false);
      }
      break;
    case '/supersudo/orders':
      prefetchListIfStale(
        ADMIN_QUERY_PREFIX.orders,
        '/api/v1/admin/orders',
        ADMIN_DEFAULT_ORDERS_LIST_PARAMS,
        ADMIN_LIST_STALE_MS
      );
      break;
    case '/supersudo/products':
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.categories, ADMIN_LIST_STALE_MS)) {
        void loadAdminCategories(false);
      }
      prefetchListIfStale(
        ADMIN_QUERY_PREFIX.products,
        '/api/v1/admin/products',
        buildAdminProductListParams({ page: 1 }),
        ADMIN_LIST_STALE_MS
      );
      break;
    case '/supersudo/categories':
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.categories, ADMIN_LIST_STALE_MS)) {
        void loadAdminCategories(false);
      }
      break;
    case '/supersudo/brands':
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.brands, ADMIN_LIST_STALE_MS)) {
        void loadAdminBrands(false);
      }
      break;
    case '/supersudo/attributes':
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.attributes, ADMIN_LIST_STALE_MS)) {
        void loadAdminAttributes(false);
      }
      break;
    case '/supersudo/quick-settings':
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.categories, ADMIN_LIST_STALE_MS)) {
        void loadAdminCategories(false);
      }
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.brands, ADMIN_LIST_STALE_MS)) {
        void loadAdminBrands(false);
      }
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.settings, ADMIN_LIST_STALE_MS)) {
        void loadAdminSettings(false);
      }
      break;
    case '/supersudo/coupons':
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.coupons, ADMIN_LIST_STALE_MS)) {
        void fetchAdminQuery(
          ADMIN_QUERY_KEYS.coupons,
          () => apiClient.get('/api/v1/admin/coupons'),
          { staleTimeMs: ADMIN_LIST_STALE_MS }
        );
      }
      break;
    case '/supersudo/users':
      prefetchListIfStale(
        ADMIN_QUERY_PREFIX.users,
        '/api/v1/admin/users',
        ADMIN_DEFAULT_USERS_LIST_PARAMS,
        ADMIN_LIST_STALE_MS
      );
      break;
    case '/supersudo/analytics':
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.stats, ADMIN_STATS_STALE_MS)) {
        void loadAdminStats(false);
      }
      prefetchListIfStale(
        ADMIN_QUERY_PREFIX.analytics,
        '/api/v1/admin/analytics',
        { period: 'week' },
        ADMIN_ANALYTICS_STALE_MS
      );
      break;
    case '/supersudo/price-filter-settings':
      prefetchResourceIfStale(
        ADMIN_QUERY_KEYS.priceFilter,
        () => apiClient.get('/api/v1/admin/settings/price-filter'),
        ADMIN_RESOURCE_STALE_MS
      );
      break;
    case '/supersudo/delivery':
      prefetchResourceIfStale(
        ADMIN_QUERY_KEYS.delivery,
        () => apiClient.get('/api/v1/admin/delivery'),
        ADMIN_RESOURCE_STALE_MS
      );
      break;
    case '/supersudo/messages':
      prefetchListIfStale(
        ADMIN_QUERY_PREFIX.messages,
        '/api/v1/admin/messages',
        ADMIN_DEFAULT_MESSAGES_LIST_PARAMS,
        ADMIN_LIST_STALE_MS
      );
      break;
    case '/supersudo/settings':
      if (!isAdminQueryFresh(ADMIN_QUERY_KEYS.settings, ADMIN_LIST_STALE_MS)) {
        void loadAdminSettings(false);
      }
      break;
    default:
      break;
  }
}
