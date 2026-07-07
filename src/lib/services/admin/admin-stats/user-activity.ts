import { db } from "@white-shop/db";

/**
 * Format user for activity response
 */
function formatUser(user: {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email || undefined,
    phone: user.phone || undefined,
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || user.phone || "Unknown",
    registeredAt: user.createdAt.toISOString(),
    lastLoginAt: undefined,
  };
}

function formatUserName(user: {
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
}): string {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || user.phone || "Unknown";
}

/**
 * Get user activity (recent registrations and active users).
 * Uses order aggregates instead of loading all orders per user (N+1 fix).
 */
export async function getUserActivity(limit: number = 10) {
  const [recentUsers, orderAggregates] = await Promise.all([
    db.user.findMany({
      where: { deletedAt: null },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    }),
    db.order.groupBy({
      by: ["userId"],
      where: { userId: { not: null } },
      _sum: { total: true },
      _count: { _all: true },
      _max: { createdAt: true },
    }),
  ]);

  const rankedAggregates = orderAggregates
    .filter((row) => row.userId)
    .sort((a, b) => {
      const aCount = typeof a._count === "object" && a._count ? a._count._all ?? 0 : 0;
      const bCount = typeof b._count === "object" && b._count ? b._count._all ?? 0 : 0;
      return bCount - aCount;
    })
    .slice(0, limit);

  const userIds = rankedAggregates
    .map((row) => row.userId)
    .filter((id): id is string => typeof id === "string");

  const activeUserProfiles =
    userIds.length > 0
      ? await db.user.findMany({
          where: { id: { in: userIds }, deletedAt: null },
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        })
      : [];

  const profileById = new Map(activeUserProfiles.map((user) => [user.id, user]));

  const activeUsers = rankedAggregates
    .filter((row) => row.userId && profileById.has(row.userId))
    .map((row) => {
      const user = profileById.get(row.userId!)!;
      const orderCount =
        typeof row._count === "object" && row._count ? row._count._all ?? 0 : 0;
      const totalSpent = row._sum?.total ?? 0;
      const lastOrderDate = row._max?.createdAt ?? user.createdAt;

      return {
        id: user.id,
        email: user.email || undefined,
        phone: user.phone || undefined,
        name: formatUserName(user),
        orderCount,
        totalSpent,
        lastOrderDate: lastOrderDate.toISOString(),
        lastLoginAt: undefined,
      };
    });

  return {
    recentRegistrations: recentUsers.map(formatUser),
    activeUsers,
  };
}
