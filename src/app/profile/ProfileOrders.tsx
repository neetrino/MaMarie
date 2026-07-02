import Link from 'next/link';
import { Button } from '@shop/ui';
import {
  PROFILE_DESKTOP_OUTLINE_BUTTON_CLASS,
  PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
} from '../../constants/profile-desktop-page';
import type { CurrencyCode } from '../../lib/currency';
import type { OrderListItem } from './types';
import { ProfileDesktopOrderCard } from './components/ProfileDesktopOrderCard';
import { ProfileSectionCard } from './components/ProfileSectionCard';

interface ProfileOrdersProps {
  orders: OrderListItem[];
  ordersLoading: boolean;
  ordersPage: number;
  setOrdersPage: (page: number | ((prev: number) => number)) => void;
  ordersMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  currency: CurrencyCode;
  onOrderClick: (orderNumber: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
  t: (key: string) => string;
}

export function ProfileOrders({
  orders,
  ordersLoading,
  ordersPage,
  setOrdersPage,
  ordersMeta,
  currency,
  onOrderClick,
  t,
}: ProfileOrdersProps) {
  if (ordersLoading) {
    return (
      <ProfileSectionCard>
        <h2 className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} mb-6 sm:mb-8`}>{t('profile.orders.title')}</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-[15px] bg-gray-100 sm:h-32" />
          ))}
        </div>
      </ProfileSectionCard>
    );
  }

  if (orders.length === 0) {
    return (
      <ProfileSectionCard>
        <h2 className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} mb-6 sm:mb-8`}>{t('profile.orders.title')}</h2>
        <div className="flex flex-col items-center gap-5 py-12 sm:py-16">
          <p className="max-w-sm text-center text-sm text-gray-600">{t('profile.orders.noOrders')}</p>
          <Link href="/products" className={PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS}>
            {t('profile.dashboard.startShopping')}
          </Link>
        </div>
      </ProfileSectionCard>
    );
  }

  return (
    <ProfileSectionCard>
      <h2 className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} mb-6 sm:mb-8`}>{t('profile.orders.title')}</h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id}>
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

      {ordersMeta && ordersMeta.totalPages > 1 ? (
        <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <p className="text-center text-xs text-gray-600 sm:text-left sm:text-sm">
            {t('profile.orders.page')} {ordersMeta.page} {t('profile.orders.of')} {ordersMeta.totalPages} •{' '}
            {ordersMeta.total} {t('profile.orders.totalOrders')}
          </p>
          <div className="flex justify-center gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className={`min-w-[100px] ${PROFILE_DESKTOP_OUTLINE_BUTTON_CLASS}`}
              onClick={() => setOrdersPage((prev) => Math.max(1, prev - 1))}
              disabled={ordersPage === 1 || ordersLoading}
            >
              {t('profile.orders.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`min-w-[100px] ${PROFILE_DESKTOP_OUTLINE_BUTTON_CLASS}`}
              onClick={() => setOrdersPage((prev) => Math.min(ordersMeta.totalPages, prev + 1))}
              disabled={ordersPage === ordersMeta.totalPages || ordersLoading}
            >
              {t('profile.orders.next')}
            </Button>
          </div>
        </div>
      ) : null}
    </ProfileSectionCard>
  );
}
