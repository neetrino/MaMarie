import { getStats } from './stats-calculator';
import { getRecentOrders } from './recent-orders';
import { getTopProducts } from './top-products';
import { getUserActivity } from './user-activity';

export interface AdminDashboardSummaryOptions {
  recentOrdersLimit?: number;
  topProductsLimit?: number;
  userActivityLimit?: number;
}

/**
 * Single round-trip payload for the admin dashboard (stats + widgets).
 */
export async function getDashboardSummary(options: AdminDashboardSummaryOptions = {}) {
  const recentOrdersLimit = options.recentOrdersLimit ?? 5;
  const topProductsLimit = options.topProductsLimit ?? 5;
  const userActivityLimit = options.userActivityLimit ?? 10;

  const stats = await getStats();
  const [recentOrders, topProducts, userActivity] = await Promise.all([
    getRecentOrders(recentOrdersLimit),
    getTopProducts(topProductsLimit),
    getUserActivity(userActivityLimit),
  ]);

  return {
    stats,
    recentOrders,
    topProducts,
    userActivity,
  };
}
