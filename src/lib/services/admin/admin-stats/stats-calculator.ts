import { Prisma } from "@white-shop/db";
import { db } from "@white-shop/db";

const REVENUE_WHERE = {
  OR: [{ status: "completed" }, { paymentStatus: "paid" }],
};

type StatsAggregateRow = {
  total_users: number;
  total_products: number;
  low_stock_products: number;
  total_orders: number;
  recent_orders: number;
  pending_orders: number;
  revenue_total: number;
};

/**
 * Get dashboard stats (single SQL round-trip + currency sample).
 */
export async function getStats() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [statsRows, currencySample] = await Promise.all([
    db.$queryRaw<StatsAggregateRow[]>(Prisma.sql`
      SELECT
        (SELECT COUNT(*)::int FROM users WHERE "deletedAt" IS NULL) AS total_users,
        (SELECT COUNT(*)::int FROM products WHERE "deletedAt" IS NULL) AS total_products,
        (SELECT COUNT(*)::int FROM product_variants WHERE stock < 10 AND published = true) AS low_stock_products,
        (SELECT COUNT(*)::int FROM orders) AS total_orders,
        (SELECT COUNT(*)::int FROM orders WHERE "createdAt" >= ${sevenDaysAgo}) AS recent_orders,
        (SELECT COUNT(*)::int FROM orders WHERE status = 'pending') AS pending_orders,
        (SELECT COALESCE(SUM(total), 0)::float FROM orders WHERE status = 'completed' OR "paymentStatus" = 'paid') AS revenue_total
    `),
    db.order.findFirst({
      where: REVENUE_WHERE,
      select: { currency: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const row = statsRows[0];

  return {
    users: {
      total: row?.total_users ?? 0,
    },
    products: {
      total: row?.total_products ?? 0,
      lowStock: row?.low_stock_products ?? 0,
    },
    orders: {
      total: row?.total_orders ?? 0,
      recent: row?.recent_orders ?? 0,
      pending: row?.pending_orders ?? 0,
    },
    revenue: {
      total: row?.revenue_total ?? 0,
      currency: currencySample?.currency || "AMD",
    },
  };
}
