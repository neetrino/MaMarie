'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '../../../lib/i18n-client';
import {
  PROFILE_DESKTOP_INNER_CARD_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
} from '../../../constants/admin-desktop-page';
import { formatCurrency, formatDate } from '../utils/dashboardUtils';
import { AdminClaySectionCard } from './AdminClaySectionCard';

interface RecentOrder {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  customerEmail?: string;
  customerPhone?: string;
  itemsCount: number;
  createdAt: string;
}

interface RecentOrdersCardProps {
  recentOrders: RecentOrder[];
  recentOrdersLoading: boolean;
}

export function RecentOrdersCard({ recentOrders, recentOrdersLoading }: RecentOrdersCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <AdminClaySectionCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={PROFILE_DESKTOP_SECTION_TITLE_CLASS}>{t('admin.dashboard.recentOrders')}</h2>
        <button
          type="button"
          onClick={() => router.push('/supersudo/orders')}
          className="text-sm font-semibold text-brand-pink transition-opacity hover:opacity-80"
        >
          {t('admin.dashboard.viewAll')}
        </button>
      </div>
      <div className="space-y-3">
        {recentOrdersLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="h-16 rounded-[15px] bg-gray-100" />
              </div>
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-600">
            <p>{t('admin.dashboard.noRecentOrders')}</p>
          </div>
        ) : (
          recentOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              className={`w-full p-4 text-left ${PROFILE_DESKTOP_INNER_CARD_CLASS}`}
              onClick={() => router.push(`/supersudo/orders?search=${order.number}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">#{order.number}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                        order.paymentStatus === 'paid'
                          ? 'bg-[#e8f8ef] text-[#5cb176]'
                          : order.paymentStatus === 'pending'
                            ? 'bg-[#fef8e3] text-[#57423b]'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {order.customerEmail || order.customerPhone || t('admin.dashboard.guest')}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {order.itemsCount === 1
                      ? t('admin.dashboard.items').replace('{count}', order.itemsCount.toString())
                      : t('admin.dashboard.itemsPlural').replace('{count}', order.itemsCount.toString())}{' '}
                    • {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(order.total, order.currency)}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </AdminClaySectionCard>
  );
}
