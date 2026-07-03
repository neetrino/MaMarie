import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  PROFILE_DESKTOP_DASHBOARD_CARD_CLASS,
  PROFILE_DESKTOP_DASHBOARD_SECTION_CARD_CLASS,
  PROFILE_DESKTOP_ORDER_CARD_GRID_CLASS,
  PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS,
  PROFILE_DESKTOP_STAT_CONFIG,
  PROFILE_DESKTOP_STAT_THEMES,
  type ProfileDesktopStatTheme,
} from '../../constants/profile-desktop-page';
import { PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS, PROFILE_MOBILE_PAGE_TITLE_SIZE_CLASS } from '../../constants/profile-mobile-page';
import { formatPriceInCurrency, type CurrencyCode } from '../../lib/currency';
import type { DashboardData, ProfileTab } from './types';
import { ProfileDesktopOrderCard } from './components/ProfileDesktopOrderCard';
import { ProfileSectionCard } from './components/ProfileSectionCard';

interface ProfileDashboardProps {
  dashboardData: DashboardData | null;
  dashboardLoading: boolean;
  currency: CurrencyCode;
  onTabChange: (tab: ProfileTab) => void;
  onOrderClick: (orderNumber: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
  t: (key: string) => string;
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
    <div className={`relative overflow-hidden p-6 ${PROFILE_DESKTOP_DASHBOARD_CARD_CLASS} ${PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS}`}>
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${palette.iconInnerClass}`}
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
      <div>
        <h2
          className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} ${PROFILE_MOBILE_PAGE_TITLE_SIZE_CLASS} ${PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS} lg:hidden`}
        >
          {t('profile.tabs.dashboard')}
        </h2>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#fdeef2] border-t-brand-pink" />
        <p className="text-sm text-gray-600">{t('profile.dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div>
        <h2
          className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} ${PROFILE_MOBILE_PAGE_TITLE_SIZE_CLASS} ${PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS} lg:hidden`}
        >
          {t('profile.tabs.dashboard')}
        </h2>
        <ProfileSectionCard className={PROFILE_DESKTOP_DASHBOARD_SECTION_CARD_CLASS}>
        <p className="text-center text-sm text-gray-600">{t('profile.dashboard.failedToLoad')}</p>
        </ProfileSectionCard>
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
      <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2l2.163 4.387 4.837.703-3.5 3.412.826 4.818L12 13.25l-4.326 2.07.826-4.818-3.5-3.412 4.837-.703L12 2z" />
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
    <div className="space-y-6 pb-2 lg:space-y-8 lg:pb-0">
      <h2
        className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} ${PROFILE_MOBILE_PAGE_TITLE_SIZE_CLASS} ${PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS} lg:hidden`}
      >
        {t('profile.tabs.dashboard')}
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:gap-4 xl:grid-cols-4">
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

      <ProfileSectionCard mobileFrameless className={PROFILE_DESKTOP_DASHBOARD_SECTION_CARD_CLASS}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className={PROFILE_DESKTOP_SECTION_TITLE_CLASS}>{t('profile.dashboard.recentOrders')}</h2>
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
            <a href="/products" className={PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS}>
              {t('profile.dashboard.startShopping')}
            </a>
          </div>
        ) : (
          <ul className={`${PROFILE_DESKTOP_ORDER_CARD_GRID_CLASS} max-lg:gap-3`}>
            {dashboardData.recentOrders.map((order) => (
              <li key={order.id} className="min-w-0">
                <ProfileDesktopOrderCard
                  order={order}
                  currency={currency}
                  orderNumberLabel={t('profile.orders.orderNumber')}
                  itemLabel={order.itemsCount !== 1 ? t('profile.orders.items') : t('profile.orders.item')}
                  placedOnLabel={t('profile.dashboard.placedOn')}
                  viewDetailsLabel={t('profile.dashboard.viewDetails')}
                  onClick={(e) => onOrderClick(order.number, e)}
                />
              </li>
            ))}
          </ul>
        )}
      </ProfileSectionCard>
    </div>
  );
}
