import { Prisma, db } from '@white-shop/db';
import { withServerReadCache } from '@/lib/cache/server-read-cache';

const ANALYTICS_CACHE_TTL_MS = 45_000;
const TOP_PRODUCTS_LIMIT = 10;
const TOP_CATEGORIES_LIMIT = 10;

interface OrderItemRow {
  variantId: string | null;
  productTitle: string;
  sku: string;
  quantity: number;
  total: number;
  imageUrl: string | null;
  orderId: string;
  variant: {
    productId: string;
    product: {
      id: string;
      categories: Array<{
        id: string;
        translations: Array<{ title: string }>;
      }>;
    };
  } | null;
}

/**
 * Calculate date range based on period
 */
function calculateDateRange(
  period: string,
  startDate?: string,
  endDate?: string
): { start: Date; end: Date } {
  let start: Date;
  let end: Date = new Date();
  end.setHours(23, 59, 59, 999);

  switch (period) {
    case 'day':
      start = new Date();
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start = new Date();
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      break;
    case 'year':
      start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'custom':
      if (startDate && endDate) {
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
      } else {
        start = new Date();
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
      }
      break;
    default:
      start = new Date();
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
  }

  return { start, end };
}

function aggregateTopProducts(items: OrderItemRow[]) {
  const productMap = new Map<
    string,
    {
      variantId: string;
      productId: string;
      title: string;
      sku: string;
      totalQuantity: number;
      totalRevenue: number;
      orderCount: number;
      image?: string | null;
    }
  >();

  for (const item of items) {
    if (!item.variantId) {
      continue;
    }

    const existing = productMap.get(item.variantId) ?? {
      variantId: item.variantId,
      productId: item.variant?.product?.id ?? item.variant?.productId ?? '',
      title: item.productTitle,
      sku: item.sku,
      totalQuantity: 0,
      totalRevenue: 0,
      orderCount: 0,
      image: item.imageUrl,
    };

    existing.totalQuantity += item.quantity;
    existing.totalRevenue += item.total;
    existing.orderCount += 1;
    productMap.set(item.variantId, existing);
  }

  return Array.from(productMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, TOP_PRODUCTS_LIMIT);
}

function aggregateTopCategories(items: OrderItemRow[]) {
  const categoryMap = new Map<
    string,
    {
      categoryId: string;
      categoryName: string;
      totalQuantity: number;
      totalRevenue: number;
      orderCount: number;
    }
  >();

  for (const item of items) {
    const categories = item.variant?.product?.categories ?? [];
    for (const category of categories) {
      const categoryName = category.translations[0]?.title ?? category.id;
      const existing = categoryMap.get(category.id) ?? {
        categoryId: category.id,
        categoryName,
        totalQuantity: 0,
        totalRevenue: 0,
        orderCount: 0,
      };
      existing.totalQuantity += item.quantity;
      existing.totalRevenue += item.total;
      existing.orderCount += 1;
      categoryMap.set(category.id, existing);
    }
  }

  return Array.from(categoryMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, TOP_CATEGORIES_LIMIT);
}

async function fetchAnalyticsData(
  period: string,
  startDate?: string,
  endDate?: string
) {
  const { start, end } = calculateDateRange(period, startDate, endDate);
  const dateWhere = { createdAt: { gte: start, lte: end } };

  const [
    totalOrders,
    paidOrders,
    pendingOrders,
    completedOrders,
    revenueAggregate,
    ordersByDayRows,
    orderItems,
  ] = await Promise.all([
    db.order.count({ where: dateWhere }),
    db.order.count({ where: { ...dateWhere, paymentStatus: 'paid' } }),
    db.order.count({ where: { ...dateWhere, status: 'pending' } }),
    db.order.count({ where: { ...dateWhere, status: 'completed' } }),
    db.order.aggregate({
      where: { ...dateWhere, paymentStatus: 'paid' },
      _sum: { total: true },
    }),
    db.$queryRaw<Array<{ day: Date; count: number; revenue: number }>>(Prisma.sql`
      SELECT DATE("createdAt") AS day,
             COUNT(*)::int AS count,
             COALESCE(SUM(CASE WHEN "paymentStatus" = 'paid' THEN total ELSE 0 END), 0)::float AS revenue
      FROM orders
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      GROUP BY DATE("createdAt")
      ORDER BY day ASC
    `),
    db.orderItem.findMany({
      where: { order: dateWhere },
      select: {
        variantId: true,
        productTitle: true,
        sku: true,
        quantity: true,
        total: true,
        imageUrl: true,
        orderId: true,
        variant: {
          select: {
            productId: true,
            product: {
              select: {
                id: true,
                categories: {
                  select: {
                    id: true,
                    translations: {
                      where: { locale: 'en' },
                      take: 1,
                      select: { title: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    period,
    dateRange: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    orders: {
      totalOrders,
      totalRevenue: revenueAggregate._sum?.total ?? 0,
      paidOrders,
      pendingOrders,
      completedOrders,
    },
    topProducts: aggregateTopProducts(orderItems),
    topCategories: aggregateTopCategories(orderItems),
    ordersByDay: ordersByDayRows.map((row) => ({
      _id: row.day instanceof Date ? row.day.toISOString().split('T')[0] : String(row.day),
      count: Number(row.count),
      revenue: Number(row.revenue),
    })),
  };
}

/**
 * Get analytics data (cached, lightweight DB queries).
 */
export async function getAnalytics(
  period: string = 'week',
  startDate?: string,
  endDate?: string
) {
  const cacheKey = `admin:analytics:${period}:${startDate ?? ''}:${endDate ?? ''}`;
  return withServerReadCache(cacheKey, ANALYTICS_CACHE_TTL_MS, () =>
    fetchAnalyticsData(period, startDate, endDate)
  );
}
