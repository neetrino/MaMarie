'use client';

import { useTranslation } from '../../../lib/i18n-client';
import {
  PROFILE_DESKTOP_INNER_CARD_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
} from '../../../constants/admin-desktop-page';
import { formatCurrency, formatDate } from '../utils/dashboardUtils';
import { AdminClaySectionCard } from './AdminClaySectionCard';

interface UserActivity {
  recentRegistrations: Array<{
    id: string;
    email?: string;
    phone?: string;
    name: string;
    registeredAt: string;
    lastLoginAt?: string;
  }>;
  activeUsers: Array<{
    id: string;
    email?: string;
    phone?: string;
    name: string;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string;
    lastLoginAt?: string;
  }>;
}

interface UserActivityCardProps {
  userActivity: UserActivity | null;
  userActivityLoading: boolean;
}

export function UserActivityCard({ userActivity, userActivityLoading }: UserActivityCardProps) {
  const { t } = useTranslation();

  return (
    <AdminClaySectionCard className="mb-8">
      <h2 className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} mb-6`}>
        {t('admin.dashboard.userActivity')}
      </h2>
      {userActivityLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="h-32 rounded-[15px] bg-gray-100" />
            </div>
          ))}
        </div>
      ) : userActivity ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              {t('admin.dashboard.recentRegistrations')}
            </h3>
            <div className="space-y-3">
              {userActivity.recentRegistrations.length === 0 ? (
                <p className="text-sm text-gray-600">{t('admin.dashboard.noRecentRegistrations')}</p>
              ) : (
                userActivity.recentRegistrations.slice(0, 5).map((user) => (
                  <div key={user.id} className={`p-3 ${PROFILE_DESKTOP_INNER_CARD_CLASS}`}>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email || user.phone || 'N/A'}</p>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(user.registeredAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              {t('admin.dashboard.mostActiveUsers')}
            </h3>
            <div className="space-y-3">
              {userActivity.activeUsers.length === 0 ? (
                <p className="text-sm text-gray-600">{t('admin.dashboard.noActiveUsers')}</p>
              ) : (
                userActivity.activeUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className={`p-3 ${PROFILE_DESKTOP_INNER_CARD_CLASS}`}>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email || user.phone || 'N/A'}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {t('admin.dashboard.ordersCount').replace('{count}', user.orderCount.toString())} •{' '}
                      {formatCurrency(user.totalSpent, 'USD')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">{t('admin.dashboard.noUserActivityData')}</p>
      )}
    </AdminClaySectionCard>
  );
}
