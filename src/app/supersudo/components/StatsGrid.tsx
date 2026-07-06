'use client';

import type { ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../../lib/i18n-client';
import { ADMIN_DASHBOARD_STAT_CONFIG } from '../../../constants/admin-desktop-page';
import { formatCurrency } from '../utils/dashboardUtils';
import { AdminStatCard } from './AdminStatCard';

interface Stats {
  users: { total: number };
  products: { total: number; lowStock: number };
  orders: { total: number; recent: number; pending: number };
  revenue: { total: number; currency: string };
}

interface StatsGridProps {
  stats: Stats | null;
  statsLoading: boolean;
}

const STAT_ROUTES: Record<(typeof ADMIN_DASHBOARD_STAT_CONFIG)[number]['key'], string> = {
  users: '/supersudo/users',
  products: '/supersudo/products',
  orders: '/supersudo/orders',
  revenue: '/supersudo/orders?filter=paid',
};

const STAT_ICONS: Record<(typeof ADMIN_DASHBOARD_STAT_CONFIG)[number]['key'], ReactElement> = {
  users: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  products: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  orders: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  revenue: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

const STAT_LABEL_KEYS: Record<(typeof ADMIN_DASHBOARD_STAT_CONFIG)[number]['key'], string> = {
  users: 'admin.dashboard.totalUsers',
  products: 'admin.dashboard.totalProducts',
  orders: 'admin.dashboard.totalOrders',
  revenue: 'admin.dashboard.revenue',
};

function formatStatValue(
  key: (typeof ADMIN_DASHBOARD_STAT_CONFIG)[number]['key'],
  stats: Stats | null,
): string {
  if (!stats) {
    return '0';
  }

  if (key === 'revenue') {
    return formatCurrency(stats.revenue.total, stats.revenue.currency);
  }

  if (key === 'users') {
    return String(stats.users.total);
  }

  if (key === 'products') {
    return String(stats.products.total);
  }

  return String(stats.orders.total);
}

export function StatsGrid({ stats, statsLoading }: StatsGridProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {ADMIN_DASHBOARD_STAT_CONFIG.map(({ key, theme }) => (
        <AdminStatCard
          key={key}
          label={t(STAT_LABEL_KEYS[key])}
          value={statsLoading ? '…' : formatStatValue(key, stats)}
          icon={STAT_ICONS[key]}
          theme={theme}
          onClick={() => router.push(STAT_ROUTES[key])}
        />
      ))}
    </div>
  );
}
