'use client';

import { Home } from 'lucide-react';
import { type ReactNode } from 'react';
import {
  PROFILE_MOBILE_CARD_RADIUS_PX,
  PROFILE_MOBILE_EMAIL_COLOR,
  PROFILE_MOBILE_PAGE_HORIZONTAL_PADDING_PX,
  PROFILE_MOBILE_TAB_ICON_THEME,
} from '../../constants/profile-mobile-page';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';
import type { ProfileTab, ProfileTabConfig, UserProfile } from './types';
import { ProfileMobileAvatar } from './components/ProfileMobileAvatar';
import { ProfileMobileMenuRow } from './components/ProfileMobileMenuRow';

interface ProfileMobilePageProps {
  profile: UserProfile | null;
  tabs: ProfileTabConfig[];
  activeTab: ProfileTab;
  onTabSelect: (_tab: ProfileTab) => void;
  onLogout: () => void;
  t: (_key: string) => string;
  isSheetOpen: boolean;
  onCloseSheet: () => void;
  children: ReactNode;
}

function getDisplayName(profile: UserProfile | null, t: (_key: string) => string): string {
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName} ${profile.lastName}`;
  }
  return profile?.firstName || profile?.lastName || t('profile.myProfile');
}

function buildMenuOrder(tabs: ProfileTabConfig[]): ProfileTabConfig[] {
  const dashboard = tabs.find((tab) => tab.id === 'dashboard');
  const password = tabs.find((tab) => tab.id === 'password');
  const deleteAccount = tabs.find((tab) => tab.id === 'deleteAccount');
  const middleTabs = tabs.filter(
    (tab) => tab.id !== 'dashboard' && tab.id !== 'password' && tab.id !== 'deleteAccount',
  );

  return [
    ...(dashboard ? [dashboard] : []),
    ...middleTabs,
    ...(password ? [password] : []),
    ...(deleteAccount ? [deleteAccount] : []),
  ];
}

export function ProfileMobilePage({
  profile,
  tabs,
  activeTab,
  onTabSelect,
  onLogout,
  t,
  isSheetOpen,
  onCloseSheet,
  children,
}: ProfileMobilePageProps) {
  const displayName = getDisplayName(profile, t);
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? t('profile.myProfile');
  const orderedTabs = buildMenuOrder(tabs);

  useBodyScrollLock(isSheetOpen);

  return (
    <div className="profile-mobile-page md:hidden">
      <div
        className="mx-auto w-full max-w-md pt-2"
        style={{
          paddingLeft: PROFILE_MOBILE_PAGE_HORIZONTAL_PADDING_PX,
          paddingRight: PROFILE_MOBILE_PAGE_HORIZONTAL_PADDING_PX,
        }}
      >
        <div
          className="relative overflow-hidden bg-white px-5 pt-6 shadow-sm ring-1 ring-gray-200/70"
          style={{ borderRadius: PROFILE_MOBILE_CARD_RADIUS_PX }}
        >
          <div className="mb-6 flex items-center gap-4">
            <ProfileMobileAvatar
              firstName={profile?.firstName}
              lastName={profile?.lastName}
              avatarUrl={
                profile?.avatarUrl || profile?.avatar || profile?.imageUrl || profile?.image || null
              }
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-bold text-gray-900">
                {displayName}
              </p>
              {profile?.email ? (
                <p
                  className="truncate text-sm"
                  style={{ color: PROFILE_MOBILE_EMAIL_COLOR }}
                >
                  {profile.email}
                </p>
              ) : null}
            </div>
          </div>

          <div className="-mx-5 divide-y divide-gray-100 border-t border-gray-100">
            {orderedTabs.map((tab) => (
              <ProfileMobileMenuRow
                key={tab.id}
                label={tab.id === 'dashboard' ? 'Home' : tab.label}
                icon={
                  tab.id === 'dashboard' ? (
                    <Home className="h-5 w-5" strokeWidth={1.75} />
                  ) : (
                    tab.icon
                  )
                }
                iconTheme={PROFILE_MOBILE_TAB_ICON_THEME[tab.id]}
                onClick={() => onTabSelect(tab.id)}
              />
            ))}
            <ProfileMobileMenuRow
              label={t('common.navigation.logout')}
              onClick={onLogout}
              variant="logout"
            />
          </div>
        </div>
      </div>

      {isSheetOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-end bg-black/35 backdrop-blur-[1px]"
          onClick={onCloseSheet}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeTabLabel}
            className="w-full overflow-hidden bg-white shadow-2xl"
            style={{
              height: '72vh',
              borderTopLeftRadius: PROFILE_MOBILE_CARD_RADIUS_PX,
              borderTopRightRadius: PROFILE_MOBILE_CARD_RADIUS_PX,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mt-2 h-1.5 w-14 rounded-full bg-gray-300" />
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">{activeTabLabel}</h2>
              <button
                type="button"
                onClick={onCloseSheet}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"
                aria-label={t('profile.orderDetails.close')}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-[calc(72vh-4.75rem)] overflow-y-auto overscroll-contain px-4 py-4">{children}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
