import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  PROFILE_DESKTOP_CARD_CLASS,
  PROFILE_DESKTOP_PENDING_BADGE_CLASS,
  PROFILE_DESKTOP_STAT_CONFIG,
  PROFILE_DESKTOP_STAT_THEMES,
  type ProfileDesktopStatTheme,
} from '../../constants/profile-desktop-page';
import { formatPriceInCurrency, convertPrice, type CurrencyCode } from '../../lib/currency';
import type { DashboardData, ProfileTab } from './types';

interface ProfileDashboardProps {
  dashboardData: DashboardData | null;
  dashboardLoading: boolean;
  currency: CurrencyCode;
  onTabChange: (tab: ProfileTab) => void;
  onOrderClick: (orderNumber: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
  t: (key: string) => string;
}

function orderTotalDisplay(
  order: DashboardData['recentOrders'][number],
  currency: CurrencyCode,
): string {
  if (order.subtotal !== undefined && order.discountAmount !== undefined && order.taxAmount !== undefined) {
    const subtotalAMD = convertPrice(order.subtotal, 'USD', 'AMD');
    const discountAMD = convertPrice(order.discountAmount, 'USD', 'AMD');
    const taxAMD = convertPrice(order.taxAmount, 'USD', 'AMD');
    const totalWithoutShippingAMD = subtotalAMD - discountAMD + taxAMD;
    const totalDisplay =
      currency === 'AMD' ? totalWithoutShippingAMD : convertPrice(totalWithoutShippingAMD, 'AMD', currency);
    return formatPriceInCurrency(totalDisplay, currency);
  }
  const totalAMD = convertPrice(order.total, 'USD', 'AMD');
  const shippingAMD = order.shippingAmount || 0;
  const totalWithoutShippingAMD = totalAMD - shippingAMD;
  const totalDisplay =
    currency === 'AMD' ? totalWithoutShippingAMD : convertPrice(totalWithoutShippingAMD, 'AMD', currency);
  return formatPriceInCurrency(totalDisplay, currency);
}

function ProfileDesktopStatCard({
  label,
  value,
  icon,
  theme,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  theme: ProfileDesktopStatTheme;
}) {
  const palette = PROFILE_DESKTOP_STAT_THEMES[theme];
  const isSvgDecoration = palette.decoration.endsWith('.svg');

  return (
    <div className={`relative overflow-hidden p-6 ${PROFILE_DESKTOP_CARD_CLASS}`}>
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-full [&>svg]:h-5 [&>svg]:w-5"
        style={{
          backgroundColor: palette.iconBackground,
          color: palette.iconForeground,
        }}
      >
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight" style={{ color: palette.valueColor }}>
        {value}
      </p>
      <div className="pointer-events-none absolute bottom-3 right-3 opacity-90">
        {isSvgDecoration ? (
          <Image src={palette.decoration} alt="" width={28} height={28} aria-hidden className="h-7 w-7" />
        ) : (
          <Image
            src={palette.decoration}
            alt=""
            width={40}
            height={40}
            aria-hidden
            className="h-10 w-10 object-contain"
          />
        )}
      </div>
    </div>
  );
}

export function ProfileDashboard({
  dashboardData,
  dashboardLoading,
  currency,
  onTabChange,
  onOrderClick,
  t,
}: ProfileDashboardProps) {
  if (dashboardLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#fdeef2] border-t-brand-pink" />
        <p className="text-sm text-gray-600">{t('profile.dashboard.loading')}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={`p-10 text-center ${PROFILE_DESKTOP_CARD_CLASS}`}>
        <p className="text-sm text-gray-600">{t('profile.dashboard.failedToLoad')}</p>
      </div>
    );
  }

  const statIcons: Record<(typeof PROFILE_DESKTOP_STAT_CONFIG)[number]['key'], ReactNode> = {
    totalOrders: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    totalSpent: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    pendingOrders: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    savedAddresses: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  const statValues: Record<(typeof PROFILE_DESKTOP_STAT_CONFIG)[number]['key'], string> = {
    totalOrders: String(dashboardData.stats.totalOrders),
    totalSpent: formatPriceInCurrency(dashboardData.stats.totalSpent, currency),
    pendingOrders: String(dashboardData.stats.pendingOrders),
    savedAddresses: String(dashboardData.stats.addressesCount),
  };

  const statLabels: Record<(typeof PROFILE_DESKTOP_STAT_CONFIG)[number]['key'], string> = {
    totalOrders: t('profile.dashboard.totalOrders'),
    totalSpent: t('profile.dashboard.totalSpent'),
    pendingOrders: t('profile.dashboard.pendingOrders'),
    savedAddresses: t('profile.dashboard.savedAddresses'),
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {PROFILE_DESKTOP_STAT_CONFIG.map(({ key, theme }) => (
          <ProfileDesktopStatCard
            key={key}
            label={statLabels[key]}
            value={statValues[key]}
            icon={statIcons[key]}
            theme={theme}
          />
        ))}
      </div>

      <div className={`p-6 lg:p-8 ${PROFILE_DESKTOP_CARD_CLASS}`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-brand-pink">{t('profile.dashboard.recentOrders')}</h2>
          <button
            type="button"
            onClick={() => onTabChange('orders')}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-pink transition-opacity hover:opacity-80"
          >
            {t('profile.dashboard.viewAll')}
            <Image src="/assets/home/icon-chevron-right-pink.svg" alt="" width={16} height={16} aria-hidden />
          </button>
        </div>

        {dashboardData.recentOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-12">
            <p className="max-w-sm text-center text-sm text-gray-600">{t('profile.dashboard.noOrders')}</p>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t('profile.dashboard.startShopping')}
            </a>
          </div>
        ) : (
          <ul className="space-y-4">
            {dashboardData.recentOrders.map((order) => (
              <li key={order.id}>
                <a
                  href={`/orders/${order.number}`}
                  onClick={(e) => onOrderClick(order.number, e)}
                  className="block rounded-[15px] border border-gray-100 bg-[#fcfcfc] p-5 transition hover:border-brand-pink/20 hover:bg-white"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-base font-bold text-gray-900">
                      {t('profile.orders.orderNumber')}
                      {order.number}
                    </h3>
                    <p className="shrink-0 text-lg font-bold text-brand-pink">
                      {orderTotalDisplay(order, currency)}
                    </p>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className={PROFILE_DESKTOP_PENDING_BADGE_CLASS}>{order.status}</span>
                    <span className={PROFILE_DESKTOP_PENDING_BADGE_CLASS}>{order.paymentStatus}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
                    <p>
                      {order.itemsCount}{' '}
                      {order.itemsCount !== 1 ? t('profile.orders.items') : t('profile.orders.item')} •{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <span className="font-semibold text-brand-pink">{t('profile.dashboard.viewDetails')}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
