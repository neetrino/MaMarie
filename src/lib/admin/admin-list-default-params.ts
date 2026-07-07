import { buildAdminListQueryKey } from '@/lib/admin/admin-fetch';
import { ADMIN_QUERY_PREFIX } from '@/lib/admin/admin-query-keys';

/** Default admin orders list (page 1, no filters). Shared by prefetch + sessionStorage persist. */
export const ADMIN_DEFAULT_ORDERS_LIST_PARAMS = {
  page: '1',
  limit: '20',
  status: '',
  paymentStatus: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
} as const;

/** Default admin users list (page 1, no filters). */
export const ADMIN_DEFAULT_USERS_LIST_PARAMS = {
  page: '1',
  limit: '20',
  search: '',
  role: '',
} as const;

/** Default admin messages list (page 1). */
export const ADMIN_DEFAULT_MESSAGES_LIST_PARAMS = {
  page: '1',
  limit: '20',
} as const;

/**
 * Cache keys for first-page admin lists that should survive tab refresh.
 * Products list is excluded — large payload blocks the main thread on sessionStorage writes.
 */
export function buildPersistableAdminListKeys(): ReadonlySet<string> {
  return new Set([
    buildAdminListQueryKey(ADMIN_QUERY_PREFIX.orders, ADMIN_DEFAULT_ORDERS_LIST_PARAMS),
    buildAdminListQueryKey(ADMIN_QUERY_PREFIX.users, ADMIN_DEFAULT_USERS_LIST_PARAMS),
    buildAdminListQueryKey(ADMIN_QUERY_PREFIX.messages, ADMIN_DEFAULT_MESSAGES_LIST_PARAMS),
  ]);
}
