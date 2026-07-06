'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '../../../lib/i18n-client';
import {
  PROFILE_DESKTOP_INNER_CARD_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
} from '../../../constants/admin-desktop-page';
import { AdminClaySectionCard } from './AdminClaySectionCard';

const QUICK_ACTIONS = [
  {
    id: 'add-product',
    labelKey: 'admin.dashboard.addProduct',
    descriptionKey: 'admin.dashboard.createNewProduct',
    path: '/supersudo/products/add',
    theme: { background: '#e8f8ef', foreground: '#5cb176' },
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    id: 'manage-orders',
    labelKey: 'admin.dashboard.manageOrders',
    descriptionKey: 'admin.dashboard.viewAllOrders',
    path: '/supersudo/orders',
    theme: { background: '#e8f4fd', foreground: '#5281e1' },
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    id: 'manage-users',
    labelKey: 'admin.dashboard.manageUsers',
    descriptionKey: 'admin.dashboard.viewAllUsers',
    path: '/supersudo/users',
    theme: { background: '#fdeef2', foreground: '#ef95aa' },
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    id: 'settings',
    labelKey: 'admin.dashboard.settings',
    descriptionKey: 'admin.dashboard.configureSystem',
    path: '/supersudo/settings',
    theme: { background: '#fef8e3', foreground: '#e8b84a' },
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
] as const;

export function QuickActionsCard() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <AdminClaySectionCard className="mb-8">
      <h2 className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} mb-4`}>
        {t('admin.dashboard.quickActions')}
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => router.push(action.path)}
            className={`p-4 text-left ${PROFILE_DESKTOP_INNER_CARD_CLASS}`}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: action.theme.background,
                  color: action.theme.foreground,
                }}
              >
                {action.icon}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{t(action.labelKey)}</p>
                <p className="text-xs text-gray-500">{t(action.descriptionKey)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </AdminClaySectionCard>
  );
}
