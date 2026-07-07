import { logger } from '@/lib/utils/logger';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  fetchAdminQuery,
  invalidateAdminQuery,
  peekAdminQuery,
  subscribeAdminQuery,
} from '@/lib/admin/admin-query-cache';
import { loadAdminDashboardSummary } from '@/lib/admin/admin-reference-loaders';
import {
  ADMIN_DASHBOARD_STALE_MS,
  ADMIN_QUERY_KEYS,
} from '@/lib/admin/admin-query-keys';

interface Stats {
  users: { total: number };
  products: { total: number; lowStock: number };
  orders: { total: number; recent: number; pending: number };
  revenue: { total: number; currency: string };
}

interface RecentOrder {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  customerEmail?: string;
  customerPhone?: string;
  itemsCount: number;
  createdAt: string;
}

interface TopProduct {
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
  image?: string | null;
}

interface UserActivity {
  recentRegistrations: Array<{
    id: string;
    email?: string;
    phone?: string;
    name: string;
    registeredAt: string;
    lastLoginAt?: string;
  }>;
  activeUsers: Array<{
    id: string;
    email?: string;
    phone?: string;
    name: string;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string;
    lastLoginAt?: string;
  }>;
}

interface DashboardSummaryResponse {
  stats: Stats;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  userActivity: UserActivity;
}

interface UseAdminDashboardProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

function readCachedDashboard(): DashboardSummaryResponse | null {
  return peekAdminQuery<DashboardSummaryResponse>(ADMIN_QUERY_KEYS.dashboardSummary);
}

/**
 * Hook for admin dashboard data fetching (single aggregated request).
 */
export function useAdminDashboard({ isLoggedIn, isAdmin, isLoading }: UseAdminDashboardProps) {
  const [initialDashboard] = useState(() => readCachedDashboard());
  const [stats, setStats] = useState<Stats | null>(() => initialDashboard?.stats ?? null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(() =>
    Array.isArray(initialDashboard?.recentOrders) ? initialDashboard.recentOrders : []
  );
  const [topProducts, setTopProducts] = useState<TopProduct[]>(() =>
    Array.isArray(initialDashboard?.topProducts) ? initialDashboard.topProducts : []
  );
  const [userActivity, setUserActivity] = useState<UserActivity | null>(
    () => initialDashboard?.userActivity ?? null
  );
  const [statsLoading, setStatsLoading] = useState(() => initialDashboard === null);
  const [recentOrdersLoading, setRecentOrdersLoading] = useState(() => initialDashboard === null);
  const [topProductsLoading, setTopProductsLoading] = useState(() => initialDashboard === null);
  const [userActivityLoading, setUserActivityLoading] = useState(() => initialDashboard === null);
  const fetchedRef = useRef(false);

  const applySummary = useCallback((summary: DashboardSummaryResponse) => {
    setStats(summary.stats ?? null);
    setRecentOrders(Array.isArray(summary.recentOrders) ? summary.recentOrders : []);
    setTopProducts(Array.isArray(summary.topProducts) ? summary.topProducts : []);
    setUserActivity(summary.userActivity ?? null);
  }, []);

  const fetchDashboard = useCallback(async (force = false) => {
    const hasCache = !force && readCachedDashboard() !== null;
    if (!hasCache) {
      setStatsLoading(true);
      setRecentOrdersLoading(true);
      setTopProductsLoading(true);
      setUserActivityLoading(true);
    }

    try {
      logger.debug('📊 [ADMIN] Fetching dashboard summary...');

      if (force) {
        invalidateAdminQuery(ADMIN_QUERY_KEYS.dashboardSummary);
      }

      const summary = (await loadAdminDashboardSummary(force)) as DashboardSummaryResponse;
      applySummary(summary);
      logger.debug('✅ [ADMIN] Dashboard summary fetched');
    } catch (err: unknown) {
      logger.error('[ADMIN] Error fetching dashboard summary', { error: err });
      if (!hasCache) {
        setStats(null);
        setRecentOrders([]);
        setTopProducts([]);
        setUserActivity(null);
      }
    } finally {
      setStatsLoading(false);
      setRecentOrdersLoading(false);
      setTopProductsLoading(false);
      setUserActivityLoading(false);
    }
  }, [applySummary]);

  useEffect(() => {
    return subscribeAdminQuery<DashboardSummaryResponse>(ADMIN_QUERY_KEYS.dashboardSummary, applySummary);
  }, [applySummary]);

  useEffect(() => {
    if (isLoading || !isLoggedIn || !isAdmin) {
      return;
    }

    if (fetchedRef.current) {
      return;
    }
    fetchedRef.current = true;
    void fetchDashboard(false);
  }, [isLoading, isLoggedIn, isAdmin, fetchDashboard]);

  return {
    stats,
    recentOrders,
    topProducts,
    userActivity,
    statsLoading,
    recentOrdersLoading,
    topProductsLoading,
    userActivityLoading,
    refetchDashboard: () => fetchDashboard(true),
  };
}
