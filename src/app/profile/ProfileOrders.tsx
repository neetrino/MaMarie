import Link from 'next/link';
import { Button } from '@shop/ui';
import {
  PROFILE_DESKTOP_ORDER_CARD_GRID_CLASS,
  PROFILE_DESKTOP_ORDERS_PAGE_TITLE_CLASS,
  PROFILE_DESKTOP_OUTLINE_BUTTON_CLASS,
  PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS,
} from '../../constants/profile-desktop-page';
import type { CurrencyCode } from '../../lib/currency';
import type { OrderDetailsClickPreview } from './order-details-preview';
import type { OrderListItem } from './types';
import { ProfileDesktopOrderCard } from './components/ProfileDesktopOrderCard';

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
  onOrderClick: (order: OrderDetailsClickPreview, e: React.MouseEvent<HTMLAnchorElement>) => void;
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
      <div>
        <h2 className={`${PROFILE_DESKTOP_ORDERS_PAGE_TITLE_CLASS} mb-6 sm:mb-8`}>{t('profile.orders.title')}</h2>
        <div className={PROFILE_DESKTOP_ORDER_CARD_GRID_CLASS}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-[15px] border border-gray-100 bg-white sm:h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2 className={`${PROFILE_DESKTOP_ORDERS_PAGE_TITLE_CLASS} mb-6 sm:mb-8`}>{t('profile.orders.title')}</h2>
        <div className="flex flex-col items-center gap-5 rounded-[15px] border border-gray-100 bg-white py-12 sm:py-16">
          <p className="max-w-sm text-center text-sm text-gray-600">{t('profile.orders.noOrders')}</p>
          <Link href="/products" className={PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS}>
            {t('profile.dashboard.startShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className={`${PROFILE_DESKTOP_ORDERS_PAGE_TITLE_CLASS} mb-6 sm:mb-8`}>{t('profile.orders.title')}</h2>
      <ul className={PROFILE_DESKTOP_ORDER_CARD_GRID_CLASS}>
        {orders.map((order) => (
          <li key={order.id} className="min-w-0">
            <ProfileDesktopOrderCard
              order={order}
              currency={currency}
              orderNumberLabel={t('profile.orders.orderNumber')}
              itemLabel={order.itemsCount !== 1 ? t('profile.orders.items') : t('profile.orders.item')}
              placedOnLabel={t('profile.dashboard.placedOn')}
              viewDetailsLabel={t('profile.dashboard.viewDetails')}
              onClick={(e) => onOrderClick(order, e)}
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
    </div>
  );
}
