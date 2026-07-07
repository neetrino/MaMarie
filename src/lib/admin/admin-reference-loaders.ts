import { apiClient } from '@/lib/api-client';
import { fetchAdminQuery } from '@/lib/admin/admin-query-cache';
import {
  ADMIN_DASHBOARD_STALE_MS,
  ADMIN_QUERY_KEYS,
  ADMIN_REFERENCE_STALE_MS,
  ADMIN_STATS_STALE_MS,
} from '@/lib/admin/admin-query-keys';
import type {
  AdminReferenceAttribute,
  AdminReferenceBrand,
  AdminReferenceCategory,
  AdminReferenceSettings,
} from '@/lib/admin/admin-reference-types';

export async function loadAdminCategories(force = false): Promise<AdminReferenceCategory[]> {
  return fetchAdminQuery(
    ADMIN_QUERY_KEYS.categories,
    async () => {
      const response = await apiClient.get<{ data: AdminReferenceCategory[] }>(
        '/api/v1/admin/categories'
      );
      return response.data ?? [];
    },
    { staleTimeMs: ADMIN_REFERENCE_STALE_MS, force }
  );
}

export async function loadAdminBrands(force = false): Promise<AdminReferenceBrand[]> {
  return fetchAdminQuery(
    ADMIN_QUERY_KEYS.brands,
    async () => {
      const response = await apiClient.get<{ data: AdminReferenceBrand[] }>(
        '/api/v1/admin/brands'
      );
      return response.data ?? [];
    },
    { staleTimeMs: ADMIN_REFERENCE_STALE_MS, force }
  );
}

export async function loadAdminAttributes(force = false): Promise<AdminReferenceAttribute[]> {
  return fetchAdminQuery(
    ADMIN_QUERY_KEYS.attributes,
    async () => {
      const response = await apiClient.get<{ data: AdminReferenceAttribute[] }>(
        '/api/v1/admin/attributes'
      );
      return response.data ?? [];
    },
    { staleTimeMs: ADMIN_REFERENCE_STALE_MS, force }
  );
}

export async function loadAdminSettings(force = false): Promise<AdminReferenceSettings> {
  return fetchAdminQuery(
    ADMIN_QUERY_KEYS.settings,
    async () => apiClient.get<AdminReferenceSettings>('/api/v1/admin/settings'),
    { staleTimeMs: ADMIN_REFERENCE_STALE_MS, force }
  );
}

export async function loadAdminDashboardSummary(force = false): Promise<unknown> {
  return fetchAdminQuery(
    ADMIN_QUERY_KEYS.dashboardSummary,
    () =>
      apiClient.get('/api/v1/admin/dashboard/summary', {
        params: {
          recentOrdersLimit: '5',
          topProductsLimit: '5',
          userActivityLimit: '10',
        },
      }),
    { staleTimeMs: ADMIN_DASHBOARD_STALE_MS, force }
  );
}

export async function loadAdminStats(force = false): Promise<unknown> {
  return fetchAdminQuery(
    ADMIN_QUERY_KEYS.stats,
    () => apiClient.get('/api/v1/admin/stats'),
    { staleTimeMs: ADMIN_STATS_STALE_MS, force }
  );
}

/** Background warm-up for commonly reused reference data (sequential to spare DB pool). */
export function warmAdminReferenceData(): void {
  void (async () => {
    await loadAdminCategories(false);
    await loadAdminBrands(false);
    await loadAdminSettings(false);
    await loadAdminAttributes(false);
  })();
}
