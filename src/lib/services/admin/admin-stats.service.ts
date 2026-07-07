import { getStats as computeStats } from "./admin-stats/stats-calculator";
import { getUserActivity as computeUserActivity } from "./admin-stats/user-activity";
import { getRecentOrders as computeRecentOrders } from "./admin-stats/recent-orders";
import { getTopProducts as computeTopProducts } from "./admin-stats/top-products";
import { getActivity as computeActivity } from "./admin-stats/activity";
import { getAnalytics as computeAnalytics } from "./admin-stats/analytics";
import { getDashboardSummary as computeDashboardSummary } from "./admin-stats/dashboard-summary";
import { withServerReadCache } from "@/lib/cache/server-read-cache";

const STATS_CACHE_TTL_MS = 30_000;
const DASHBOARD_CACHE_TTL_MS = 45_000;

/**
 * Service for admin statistics operations
 */
class AdminStatsService {
  /**
   * Get dashboard stats
   */
  async getStats() {
    return withServerReadCache("admin:stats", STATS_CACHE_TTL_MS, () => computeStats());
  }

  /**
   * Get user activity (recent registrations and active users)
   */
  async getUserActivity(limit: number = 10) {
    return computeUserActivity(limit);
  }

  /**
   * Get recent orders for dashboard
   */
  async getRecentOrders(limit: number = 5) {
    return computeRecentOrders(limit);
  }

  /**
   * Get top products for dashboard
   */
  async getTopProducts(limit: number = 5) {
    return computeTopProducts(limit);
  }

  /**
   * Get recent activity for dashboard
   */
  async getActivity(limit: number = 10) {
    return computeActivity(limit);
  }

  /**
   * Get analytics data
   */
  async getAnalytics(period: string = 'week', startDate?: string, endDate?: string) {
    return computeAnalytics(period, startDate, endDate);
  }

  /**
   * Aggregated dashboard payload (single client round-trip).
   */
  async getDashboardSummary(options?: {
    recentOrdersLimit?: number;
    topProductsLimit?: number;
    userActivityLimit?: number;
  }) {
    const recentOrdersLimit = options?.recentOrdersLimit ?? 5;
    const topProductsLimit = options?.topProductsLimit ?? 5;
    const userActivityLimit = options?.userActivityLimit ?? 10;
    const cacheKey = `admin:dashboard:${recentOrdersLimit}:${topProductsLimit}:${userActivityLimit}`;

    return withServerReadCache(cacheKey, DASHBOARD_CACHE_TTL_MS, () =>
      computeDashboardSummary(options)
    );
  }
}

export const adminStatsService = new AdminStatsService();
