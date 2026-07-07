/** Stable client-side cache keys for admin API reads. */
export const ADMIN_QUERY_KEYS = {
  categories: 'admin:categories',
  brands: 'admin:brands',
  attributes: 'admin:attributes',
  settings: 'admin:settings',
  stats: 'admin:stats',
  dashboardSummary: 'admin:dashboard:summary',
  coupons: 'admin:coupons',
  delivery: 'admin:delivery',
  priceFilter: 'admin:settings:price-filter',
} as const;

/** Prefixes for parameterized list caches (use with buildAdminListQueryKey). */
export const ADMIN_QUERY_PREFIX = {
  products: 'admin:products',
  orders: 'admin:orders',
  analytics: 'admin:analytics',
  users: 'admin:users',
  messages: 'admin:messages',
} as const;

export const ADMIN_REFERENCE_STALE_MS = 120_000;
export const ADMIN_DASHBOARD_STALE_MS = 45_000;
export const ADMIN_STATS_STALE_MS = 60_000;
export const ADMIN_LIST_STALE_MS = 30_000;
export const ADMIN_ANALYTICS_STALE_MS = 45_000;
export const ADMIN_RESOURCE_STALE_MS = 60_000;
