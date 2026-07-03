'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  PROFILE_MOBILE_CARD_RADIUS_PX,
  PROFILE_MOBILE_EMAIL_COLOR,
  PROFILE_MOBILE_PAGE_HORIZONTAL_PADDING_PX,
  PROFILE_MOBILE_TAB_ICON_THEME,
  PROFILE_MOBILE_TAB_SHEET_BACKDROP_TRANSITION_MS,
  PROFILE_MOBILE_TAB_SHEET_CONTENT_PADDING_BOTTOM_PX,
  PROFILE_MOBILE_TAB_SHEET_CONTENT_PADDING_TOP_PX,
  PROFILE_MOBILE_SHEET_CONTENT_PADDING_HORIZONTAL_PX,
  PROFILE_MOBILE_TAB_SHEET_DISMISS_DRAG_THRESHOLD_PX,
  PROFILE_MOBILE_TAB_SHEET_HEIGHT_VH,
  PROFILE_MOBILE_TAB_SHEET_PANEL_TRANSITION_MS,
  PROFILE_MOBILE_TAB_SHEET_Z_INDEX,
} from '../../constants/profile-mobile-page';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/body-scroll-lock';
import { useBottomSheetDragDismiss } from '../../lib/use-bottom-sheet-drag-dismiss';
import { useDrawerTransition } from '../../lib/use-drawer-transition';
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
    (tab) =>
      tab.id !== 'dashboard' &&
      tab.id !== 'password' &&
      tab.id !== 'deleteAccount',
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
  const sheetPanelRef = useRef<HTMLDivElement>(null);
  const { rendered: sheetRendered, visible: sheetVisible } = useDrawerTransition(
    isSheetOpen,
    PROFILE_MOBILE_TAB_SHEET_PANEL_TRANSITION_MS,
  );
  const {
    dragOffsetY,
    isDragging,
    scrollAreaRef,
    panelDragStyle,
    resetDrag,
    headerPointerHandlers,
    scrollAreaPointerHandlers,
    panelPointerHandlers,
  } = useBottomSheetDragDismiss({
    enabled: sheetRendered && sheetVisible,
    panelRef: sheetPanelRef,
    onDismiss: onCloseSheet,
    dismissThresholdPx: PROFILE_MOBILE_TAB_SHEET_DISMISS_DRAG_THRESHOLD_PX,
  });

  useEffect(() => {
    if (!isSheetOpen) {
      resetDrag();
    }
  }, [isSheetOpen, resetDrag]);

  useEffect(() => {
    if (!sheetRendered) {
      return;
    }

    lockBodyScroll();

    const handleTouchMove = (event: TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (sheetPanelRef.current?.contains(target)) {
        return;
      }

      event.preventDefault();
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      unlockBodyScroll();
    };
  }, [sheetRendered]);

  const sheetOverlay = sheetRendered ? (
    <div
      className="fixed inset-0 flex items-end overscroll-none"
      style={{ zIndex: PROFILE_MOBILE_TAB_SHEET_Z_INDEX }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className={`fixed inset-0 rounded-none bg-black/35 backdrop-blur-[1px] transition-opacity ease-in-out motion-reduce:transition-none ${
          sheetVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDuration: `${PROFILE_MOBILE_TAB_SHEET_BACKDROP_TRANSITION_MS}ms` }}
        onClick={onCloseSheet}
      />
      <div
        ref={sheetPanelRef}
        role="dialog"
        aria-modal="true"
        aria-label={activeTabLabel}
        className={`flex w-full flex-col overflow-hidden bg-white shadow-2xl ease-in-out motion-reduce:transition-none motion-reduce:duration-0 ${
          isDragging || dragOffsetY > 0
            ? ''
            : sheetVisible
              ? 'translate-y-0'
              : 'translate-y-full motion-reduce:translate-y-0'
        } ${isDragging || dragOffsetY > 0 ? '' : 'transition-transform'}`}
        style={{
          height: `${PROFILE_MOBILE_TAB_SHEET_HEIGHT_VH}dvh`,
          borderTopLeftRadius: PROFILE_MOBILE_CARD_RADIUS_PX,
          borderTopRightRadius: PROFILE_MOBILE_CARD_RADIUS_PX,
          transitionDuration:
            isDragging || dragOffsetY > 0 ? '0ms' : `${PROFILE_MOBILE_TAB_SHEET_PANEL_TRANSITION_MS}ms`,
          ...panelDragStyle,
        }}
        onClick={(event) => event.stopPropagation()}
        {...panelPointerHandlers}
      >
        <div className="shrink-0 touch-none select-none" {...headerPointerHandlers}>
          <div className="mx-auto mt-2 h-1.5 w-14 cursor-grab rounded-full bg-gray-300 active:cursor-grabbing" />
        </div>
        <div
          ref={scrollAreaRef}
          className={`profile-mobile-tab-sheet-scroll profile-scroll-area min-h-0 flex-1 overscroll-contain ${
            isDragging ? 'touch-none overflow-hidden' : 'overflow-y-auto'
          }`}
          style={{
            paddingTop: PROFILE_MOBILE_TAB_SHEET_CONTENT_PADDING_TOP_PX,
            paddingLeft: PROFILE_MOBILE_SHEET_CONTENT_PADDING_HORIZONTAL_PX,
            paddingRight: PROFILE_MOBILE_SHEET_CONTENT_PADDING_HORIZONTAL_PX,
          }}
          {...scrollAreaPointerHandlers}
        >
          <div
            style={{
              paddingBottom: `calc(${PROFILE_MOBILE_TAB_SHEET_CONTENT_PADDING_BOTTOM_PX}px + env(safe-area-inset-bottom, 0px))`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="profile-mobile-page lg:hidden">
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

          <div className="-mx-5 divide-y divide-gray-100">
            {orderedTabs.map((tab) => (
              <ProfileMobileMenuRow
                key={tab.id}
                label={tab.label}
                icon={tab.icon}
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

      {sheetOverlay ? createPortal(sheetOverlay, document.body) : null}
    </div>
  );
}
