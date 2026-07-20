'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth/AuthContext';
import { Card, Button, Input } from '@shop/ui';
import { apiClient } from '../../../lib/api-client';
import {
  buildAdminListQueryKey,
  fetchAdminList,
  invalidateAdminQueryPrefix,
} from '@/lib/admin/admin-fetch';
import {
  hydrateAdminListFromCache,
  useAdminQuerySubscription,
} from '@/lib/admin/admin-list-cache-ui';
import { ADMIN_LIST_STALE_MS, ADMIN_QUERY_PREFIX } from '@/lib/admin/admin-query-keys';
import { useTranslation } from '../../../lib/i18n-client';
import {
  ADMIN_TABLE,
  ADMIN_TABLE_CARD,
  ADMIN_TABLE_CHECKBOX,
  ADMIN_TABLE_FOOTER_ROUNDED_B,
  ADMIN_TABLE_OUTER_SCROLL,
  ADMIN_TABLE_ROW,
  ADMIN_TABLE_STATE_INSET,
  ADMIN_TABLE_TBODY,
  ADMIN_TABLE_TD,
  ADMIN_TABLE_TD_CHECK,
  ADMIN_TABLE_TH,
  ADMIN_TABLE_TH_CENTER,
  ADMIN_TABLE_TH_CHECK,
  ADMIN_TABLE_THEAD,
} from '../constants/admin-table-classes';
import { logger } from "@/lib/utils/logger";
import { useAdminDialogs } from '../context/AdminDialogsContext';
import { AdminSegmentedControl } from '../components/AdminSegmentedControl';
import { showToast } from '../../../components/Toast';

interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  roles: string[];
  blocked: boolean;
  ordersCount?: number;
  createdAt: string;
}

interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function UsersPage() {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<UsersResponse['meta'] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || !isAdmin) {
        router.push('/supersudo');
        return;
      }
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  const usersListParams = useMemo(
    () => ({
      page: page.toString(),
      limit: '20',
      search: search || '',
      role: roleFilter === 'all' ? '' : roleFilter,
    }),
    [page, search, roleFilter]
  );

  const usersListCacheKey = useMemo(
    () => buildAdminListQueryKey(ADMIN_QUERY_PREFIX.users, usersListParams),
    [usersListParams]
  );

  const applyUsersResponse = useCallback((response: UsersResponse) => {
    setUsers(response.data || []);
    setMeta(response.meta || null);
  }, []);

  useAdminQuerySubscription(
    usersListCacheKey,
    isLoggedIn && isAdmin,
    applyUsersResponse
  );

  const fetchUsers = useCallback(async (force = false) => {
    try {
      hydrateAdminListFromCache<UsersResponse>(
        usersListCacheKey,
        force,
        setLoading,
        applyUsersResponse
      );
      logger.debug('👥 [ADMIN] Fetching users...', { page, search, roleFilter });

      const response = await fetchAdminList<UsersResponse>(
        ADMIN_QUERY_PREFIX.users,
        '/api/v1/admin/users',
        usersListParams,
        ADMIN_LIST_STALE_MS,
        force
      );

      logger.debug('✅ [ADMIN] Users fetched:', response);
      applyUsersResponse(response);
    } catch (err) {
      console.error('❌ [ADMIN] Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [usersListCacheKey, usersListParams, applyUsersResponse, page, search, roleFilter]);

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      void fetchUsers();
    }
  }, [isLoggedIn, isAdmin, fetchUsers]);

  const refetchUsers = useCallback(async () => {
    invalidateAdminQueryPrefix(ADMIN_QUERY_PREFIX.users);
    await fetchUsers(true);
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    if (page === 1) {
      void refetchUsers();
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    // Ընտրում ենք միայն այն օգտատերերին, որոնք տեսանելի են ընթացիկ ֆիլտրով
    const visibleUsers =
      roleFilter === 'all'
        ? users
        : users.filter((u) =>
            roleFilter === 'admin'
              ? u.roles?.includes('admin')
              : u.roles?.includes('customer')
          );

    if (visibleUsers.length === 0) return;

    setSelectedIds((prev) => {
      const allIds = visibleUsers.map((u) => u.id);
      const hasAll = allIds.every((id) => prev.has(id));
      return hasAll ? new Set() : new Set(allIds);
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.users.deleteConfirm').replace('{count}', selectedIds.size.toString()),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) return;
    setBulkDeleting(true);
    try {
      const ids = Array.from(selectedIds);
      const results = await Promise.allSettled(
        ids.map(id => apiClient.delete(`/api/v1/admin/users/${id}`))
      );
      const failed = results.filter(r => r.status === 'rejected');
      setSelectedIds(new Set());
      await refetchUsers();
      showToast(t('admin.users.bulkDeleteFinished').replace('{success}', (ids.length - failed.length).toString()).replace('{total}', ids.length.toString()), 'success');
    } catch (err) {
      console.error('❌ [ADMIN] Bulk delete users error:', err);
      showToast(t('admin.users.failedToDelete'), 'error');
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleToggleBlocked = async (userId: string, currentStatus: boolean, userName: string) => {
    try {
      const newStatus = !currentStatus;
      await apiClient.put(`/api/v1/admin/users/${userId}`, {
        blocked: newStatus,
      });
      
      logger.debug(`✅ [ADMIN] User ${newStatus ? 'blocked' : 'unblocked'} successfully`);
      
      // Refresh users list
      void refetchUsers();
      
      if (newStatus) {
        showToast(t('admin.users.userBlocked').replace('{name}', userName), 'success');
      } else {
        showToast(t('admin.users.userActive').replace('{name}', userName), 'success');
      }
    } catch (err: any) {
      console.error('❌ [ADMIN] Error updating user status:', err);
      showToast(t('admin.users.errorUpdatingStatus').replace('{message}', err.message || t('admin.common.unknownErrorFallback')), 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="text-gray-600">{t('admin.common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  const filteredUsers =
    roleFilter === 'all'
      ? users
      : users.filter((user) =>
          roleFilter === 'admin'
            ? user.roles?.includes('admin')
            : user.roles?.includes('customer')
        );
  const totalUsersCount = meta?.total ?? filteredUsers.length;

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        {t('admin.users.title')}
      </h1>

      <Card className="mb-6 p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('admin.users.searchPlaceholder')}
              className="flex-1"
            />
            <Button type="submit" variant="primary">
              {t('admin.users.search')}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {t('admin.users.adminCustomer')}
            </span>
            <AdminSegmentedControl
              ariaLabel={t('admin.users.adminCustomer')}
              value={roleFilter}
              onChange={(nextRole) => {
                setRoleFilter(nextRole);
                setPage(1);
                logger.debug(`👥 [ADMIN] Role filter changed to: ${nextRole}`);
              }}
              options={[
                { value: 'all', label: t('admin.users.all') },
                { value: 'admin', label: t('admin.users.admins') },
                { value: 'customer', label: t('admin.users.customers') },
              ]}
            />
          </div>
          <div className="border-t border-gray-200 pt-3 text-sm text-gray-700">
            {t('admin.users.totalUsersCount').replace('{count}', totalUsersCount.toString())}
          </div>
        </form>
      </Card>

        {!loading && filteredUsers.length > 0 && (
          <Card className="mb-6 w-full min-w-0 p-4">
            <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 flex-1 text-sm text-gray-700">
                {t('admin.users.selectedUsers').replace('{count}', selectedIds.size.toString())}
              </div>
              <Button
                variant="outline"
                type="button"
                className="shrink-0"
                onClick={handleBulkDelete}
                disabled={selectedIds.size === 0 || bulkDeleting}
              >
                {bulkDeleting ? t('admin.users.deleting') : t('admin.users.deleteSelected')}
              </Button>
            </div>
          </Card>
        )}

        {/* Users Table */}
        <Card
          className={
            loading || filteredUsers.length === 0 ? ADMIN_TABLE_STATE_INSET : ADMIN_TABLE_CARD
          }
        >
          {loading ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
              <p className="text-sm text-gray-600">{t('admin.users.loadingUsers')}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-600">{t('admin.users.noUsers')}</p>
            </div>
          ) : (
            <>
              <div
                className={`${ADMIN_TABLE_OUTER_SCROLL} ${
                  meta && meta.totalPages > 1 ? '' : 'rounded-b-lg'
                }`}
              >
                <table className={ADMIN_TABLE}>
                  <thead className={ADMIN_TABLE_THEAD}>
                    <tr>
                      <th className={ADMIN_TABLE_TH_CHECK}>
                        <input
                          type="checkbox"
                          className={ADMIN_TABLE_CHECKBOX}
                          aria-label={t('admin.users.selectAll')}
                          checked={users.length > 0 && users.every(u => selectedIds.has(u.id))}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th className={ADMIN_TABLE_TH}>{t('admin.users.user')}</th>
                      <th className={ADMIN_TABLE_TH}>{t('admin.users.contact')}</th>
                      <th className={ADMIN_TABLE_TH_CENTER}>{t('admin.users.orders')}</th>
                      <th className={ADMIN_TABLE_TH_CENTER}>{t('admin.users.roles')}</th>
                      <th className={ADMIN_TABLE_TH_CENTER}>{t('admin.users.status')}</th>
                      <th className={ADMIN_TABLE_TH_CENTER}>{t('admin.users.created')}</th>
                    </tr>
                  </thead>
                  <tbody className={ADMIN_TABLE_TBODY}>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className={ADMIN_TABLE_ROW}>
                        <td className={ADMIN_TABLE_TD_CHECK}>
                          <div className="flex min-w-0 justify-center">
                            <input
                              type="checkbox"
                              className={ADMIN_TABLE_CHECKBOX}
                              aria-label={t('admin.users.selectUser').replace('{email}', user.email)}
                              checked={selectedIds.has(user.id)}
                              onChange={() => toggleSelect(user.id)}
                            />
                          </div>
                        </td>
                        <td className={`${ADMIN_TABLE_TD} whitespace-nowrap text-left text-gray-900`}>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{user.id}</div>
                        </td>
                        <td className={`${ADMIN_TABLE_TD} whitespace-nowrap text-left`}>
                          <div className="text-gray-900">{user.email}</div>
                          {user.phone && (
                            <div className="text-xs text-gray-600">{user.phone}</div>
                          )}
                        </td>
                        <td className={`${ADMIN_TABLE_TD} whitespace-nowrap text-center font-semibold tabular-nums text-gray-900`}>
                          {user.ordersCount ?? 0}
                        </td>
                        <td className={`${ADMIN_TABLE_TD} whitespace-nowrap text-center`}>
                          <div className="flex justify-center gap-2">
                            {user.roles?.map((role) => (
                              <span
                                key={role}
                                className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className={`${ADMIN_TABLE_TD} whitespace-nowrap text-center`}>
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleBlocked(
                                user.id,
                                user.blocked,
                                `${user.firstName} ${user.lastName}`,
                              )
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              user.blocked
                                ? 'bg-gray-300 focus:ring-gray-400'
                                : 'bg-green-500 focus:ring-green-500'
                            }`}
                            title={user.blocked ? t('admin.users.clickToActivate') : t('admin.users.clickToBlock')}
                            role="switch"
                            aria-checked={!user.blocked}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                user.blocked ? 'translate-x-1' : 'translate-x-6'
                              }`}
                            />
                          </button>
                        </td>
                        <td className={`${ADMIN_TABLE_TD} whitespace-nowrap text-center tabular-nums text-gray-600`}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className={`${ADMIN_TABLE_FOOTER_ROUNDED_B} flex items-center justify-between`}>
                  <div className="text-sm text-gray-700">
                    {t('admin.users.showingPage').replace('{page}', meta.page.toString()).replace('{totalPages}', meta.totalPages.toString()).replace('{total}', meta.total.toString())}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      {t('admin.users.previous')}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                      disabled={page === meta.totalPages}
                    >
                      {t('admin.users.next')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
    </>
  );
}

