import { describe, expect, it } from 'vitest';
import { buildAdminListQueryKey } from '@/lib/admin/admin-fetch';
import {
  ADMIN_DEFAULT_ORDERS_LIST_PARAMS,
  buildPersistableAdminListKeys,
} from '@/lib/admin/admin-list-default-params';
import { buildAdminProductListParams } from '@/lib/admin/admin-product-list-params';
import { ADMIN_QUERY_PREFIX } from '@/lib/admin/admin-query-keys';
import { shouldPersistAdminQueryKey } from '@/lib/admin/admin-query-persist';

describe('shouldPersistAdminQueryKey', () => {
  it('persists reference singleton keys', () => {
    expect(shouldPersistAdminQueryKey('admin:categories')).toBe(true);
    expect(shouldPersistAdminQueryKey('admin:dashboard:summary')).toBe(true);
  });

  it('persists default first-page list keys regardless of param sort order', () => {
    const productsKey = buildAdminListQueryKey(
      ADMIN_QUERY_PREFIX.products,
      buildAdminProductListParams({ page: 1 })
    );

    expect(productsKey).toBe('admin:products?limit=20&page=1&sort=createdAt-desc');
    expect(shouldPersistAdminQueryKey(productsKey)).toBe(true);
    expect(buildPersistableAdminListKeys().has(productsKey)).toBe(true);
  });

  it('persists default orders list key', () => {
    const ordersKey = buildAdminListQueryKey(
      ADMIN_QUERY_PREFIX.orders,
      ADMIN_DEFAULT_ORDERS_LIST_PARAMS
    );

    expect(shouldPersistAdminQueryKey(ordersKey)).toBe(true);
  });

  it('does not persist filtered or paginated list variants', () => {
    const filteredProducts = buildAdminListQueryKey(ADMIN_QUERY_PREFIX.products, {
      ...buildAdminProductListParams({ page: 1 }),
      search: 'rose',
    });
    const pageTwo = buildAdminListQueryKey(
      ADMIN_QUERY_PREFIX.products,
      buildAdminProductListParams({ page: 2 })
    );

    expect(shouldPersistAdminQueryKey(filteredProducts)).toBe(false);
    expect(shouldPersistAdminQueryKey(pageTwo)).toBe(false);
  });

  it('does not persist unknown keys', () => {
    expect(shouldPersistAdminQueryKey('admin:analytics?period=week')).toBe(false);
    expect(shouldPersistAdminQueryKey('admin:products?page=1&')).toBe(false);
  });
});
