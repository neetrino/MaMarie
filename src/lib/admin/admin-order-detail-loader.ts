import { apiClient } from '@/lib/api-client';
import { fetchAdminResource, invalidateAdminQuery } from '@/lib/admin/admin-fetch';

export const ADMIN_ORDER_DETAIL_STALE_MS = 60_000;

/** Cache key for a single admin order detail payload. */
export function adminOrderDetailCacheKey(orderId: string): string {
  return `admin:orders:detail:${orderId}`;
}

export async function loadAdminOrderDetail<T>(orderId: string, force = false): Promise<T> {
  return fetchAdminResource<T>(
    adminOrderDetailCacheKey(orderId),
    () => apiClient.get<T>(`/api/v1/admin/orders/${orderId}`),
    ADMIN_ORDER_DETAIL_STALE_MS,
    force
  );
}

/** Warm order detail cache on row hover (non-blocking). */
export function prefetchAdminOrderDetail(orderId: string): void {
  void loadAdminOrderDetail(orderId, false).catch(() => {
    /* prefetch failures are non-blocking */
  });
}

export function invalidateAdminOrderDetail(orderId: string): void {
  invalidateAdminQuery(adminOrderDetailCacheKey(orderId));
}
