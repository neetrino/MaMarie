'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  PROFILE_MOBILE_CARD_CLASS,
  PROFILE_MOBILE_CARD_RADIUS_PX,
  PROFILE_MOBILE_EMAIL_COLOR,
  PROFILE_MOBILE_HEADER_CARD_GAP_PX,
  PROFILE_MOBILE_HEADER_CARD_PADDING_X_PX,
  PROFILE_MOBILE_HEADER_CARD_PADDING_Y_PX,
  PROFILE_MOBILE_PAGE_HORIZONTAL_PADDING_PX,
  PROFILE_MOBILE_PAGE_TOP_PADDING_PX,
  PROFILE_MOBILE_TABLET_PAGE_TOP_GAP_PX,
  PROFILE_MOBILE_TABLET_PAGE_TOP_PADDING_PX,
  PROFILE_MOBILE_SECTION_GAP_PX,
  PROFILE_MOBILE_TAB_ICON_THEME,
  PROFILE_MOBILE_MENU_CARD_VERTICAL_PADDING_PX,
  PROFILE_MOBILE_TAB_SHEET_BACKDROP_TRANSITION_MS,
  PROFILE_MOBILE_TAB_SHEET_CONTENT_PADDING_BOTTOM_PX,
  PROFILE_MOBILE_TAB_SHEET_CONTENT_PADDING_TOP_PX,
  PROFILE_MOBILE_SHEET_CONTENT_PADDING_HORIZONTAL_PX,
  PROFILE_MOBILE_TAB_SHEET_DISMISS_DRAG_THRESHOLD_PX,
  PROFILE_MOBILE_TAB_SHEET_DRAG_HANDLE_HEIGHT_PX,
  PROFILE_MOBILE_TAB_SHEET_DRAG_HANDLE_WIDTH_PX,
  PROFILE_MOBILE_TAB_SHEET_DRAG_ZONE_HEIGHT_PX,
  PROFILE_MOBILE_TAB_SHEET_HEIGHT_VH,
  PROFILE_MOBILE_TAB_SHEET_PANEL_EASING,
  PROFILE_MOBILE_TAB_SHEET_PANEL_TRANSITION_MS,
  PROFILE_MOBILE_TAB_SHEET_Z_INDEX,
} from '../../constants/profile-mobile-page';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/body-scroll-lock';
import { DRAWER_TOUCH_SCROLL_ROOT_ATTR, preventTouchMoveUnlessInsideDrawer } from '../../lib/drawer-touch-scroll-guard';
import { useBottomSheetDragDismiss } from '../../lib/use-bottom-sheet-drag-dismiss';
import { useDrawerTransition } from '../../lib/use-drawer-transition';
import type { ProfileTab, ProfileTabConfig, UserProfile } from './types';
import { ProfileMobileAvatar } from './components/ProfileMobileAvatar';
import { ProfileMobileMenuRow } from './components/ProfileMobileMenuRow';
import { ProfileMobileLogoutButton } from './components/ProfileMobileLogoutButton';

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
  const menuTabs = orderedTabs.filter((tab) => tab.id !== 'deleteAccount');
  const deleteAccountTab = orderedTabs.find((tab) => tab.id === 'deleteAccount');
  const sheetPanelRef = useRef<HTMLDivElement>(null);
  const { rendered: sheetRendered, visible: sheetVisible } = useDrawerTransition(
    isSheetOpen,
    PROFILE_MOBILE_TAB_SHEET_PANEL_TRANSITION_MS,
  );
  const {
    dragOffsetY,
    isDragging,
    scrollAreaRef,
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
    if (!isSheetOpen && !sheetRendered) {
      resetDrag();
    }
  }, [isSheetOpen, sheetRendered, resetDrag]);

  useEffect(() => {
    if (!sheetRendered) {
      return;
    }

    lockBodyScroll();

    const handleTouchMove = (event: TouchEvent) => {
      preventTouchMoveUnlessInsideDrawer(event, [sheetPanelRef.current, scrollAreaRef.current]);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      unlockBodyScroll();
    };
  }, [sheetRendered]);

  const sheetPanelTransitionActive = !isDragging;
  const sheetPanelTransform =
    isDragging || (dragOffsetY > 0 && sheetVisible)
      ? `translateY(${dragOffsetY}px)`
      : sheetVisible
        ? 'translateY(0)'
        : 'translateY(100%)';

  const sheetOverlay = sheetRendered ? (
    <div
      className="fixed inset-0 flex items-end overscroll-none"
      style={{ zIndex: PROFILE_MOBILE_TAB_SHEET_Z_INDEX }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className={`fixed inset-0 rounded-none bg-black/35 backdrop-blur-[1px] transition-opacity motion-reduce:transition-none ${
          sheetVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transitionDuration: `${PROFILE_MOBILE_TAB_SHEET_BACKDROP_TRANSITION_MS}ms`,
          transitionTimingFunction: PROFILE_MOBILE_TAB_SHEET_PANEL_EASING,
        }}
        onClick={onCloseSheet}
      />
      <div
        ref={sheetPanelRef}
        role="dialog"
        aria-modal="true"
        aria-label={activeTabLabel}
        {...{ [DRAWER_TOUCH_SCROLL_ROOT_ATTR]: '' }}
        className="flex w-full flex-col overflow-hidden bg-white shadow-2xl motion-reduce:transition-none motion-reduce:duration-0"
        style={{
          height: `${PROFILE_MOBILE_TAB_SHEET_HEIGHT_VH}dvh`,
          borderTopLeftRadius: PROFILE_MOBILE_CARD_RADIUS_PX,
          borderTopRightRadius: PROFILE_MOBILE_CARD_RADIUS_PX,
          transform: sheetPanelTransform,
          transition: sheetPanelTransitionActive
            ? `transform ${PROFILE_MOBILE_TAB_SHEET_PANEL_TRANSITION_MS}ms ${PROFILE_MOBILE_TAB_SHEET_PANEL_EASING}`
            : 'none',
        }}
        onClick={(event) => event.stopPropagation()}
        {...panelPointerHandlers}
      >
        <div
          className="flex shrink-0 touch-none select-none items-center justify-center"
          style={{ minHeight: PROFILE_MOBILE_TAB_SHEET_DRAG_ZONE_HEIGHT_PX }}
          {...headerPointerHandlers}
        >
          <div
            className="cursor-grab rounded-full bg-gray-300 active:cursor-grabbing"
            style={{
              height: PROFILE_MOBILE_TAB_SHEET_DRAG_HANDLE_HEIGHT_PX,
              width: PROFILE_MOBILE_TAB_SHEET_DRAG_HANDLE_WIDTH_PX,
            }}
          />
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
        className="profile-mobile-page__content mx-auto w-full max-w-md"
        style={
          {
            '--profile-mobile-page-top-padding': `${PROFILE_MOBILE_PAGE_TOP_PADDING_PX}px`,
            '--profile-mobile-tablet-page-top-gap': `${PROFILE_MOBILE_TABLET_PAGE_TOP_GAP_PX}px`,
            '--profile-mobile-tablet-page-top-padding': `${PROFILE_MOBILE_TABLET_PAGE_TOP_PADDING_PX}px`,
            paddingLeft: PROFILE_MOBILE_PAGE_HORIZONTAL_PADDING_PX,
            paddingRight: PROFILE_MOBILE_PAGE_HORIZONTAL_PADDING_PX,
          } as CSSProperties
        }
      >
        <div
          className="flex flex-col"
          style={{ gap: PROFILE_MOBILE_SECTION_GAP_PX }}
        >
          <section
            className={PROFILE_MOBILE_CARD_CLASS}
            style={{
              paddingLeft: PROFILE_MOBILE_HEADER_CARD_PADDING_X_PX,
              paddingRight: PROFILE_MOBILE_HEADER_CARD_PADDING_X_PX,
              paddingTop: PROFILE_MOBILE_HEADER_CARD_PADDING_Y_PX,
              paddingBottom: PROFILE_MOBILE_HEADER_CARD_PADDING_Y_PX,
            }}
            aria-label={t('profile.myProfile')}
          >
            <div
              className="flex items-center"
              style={{ gap: PROFILE_MOBILE_HEADER_CARD_GAP_PX }}
            >
              <ProfileMobileAvatar
                firstName={profile?.firstName}
                lastName={profile?.lastName}
                avatarUrl={
                  profile?.avatarUrl || profile?.avatar || profile?.imageUrl || profile?.image || null
                }
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-bold leading-tight text-gray-900">{displayName}</p>
                {profile?.email ? (
                  <p
                    className="truncate text-sm leading-snug"
                    style={{ color: PROFILE_MOBILE_EMAIL_COLOR }}
                  >
                    {profile.email}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <nav
            className={`${PROFILE_MOBILE_CARD_CLASS} overflow-hidden`}
            style={{
              paddingTop: PROFILE_MOBILE_MENU_CARD_VERTICAL_PADDING_PX,
              paddingBottom: PROFILE_MOBILE_MENU_CARD_VERTICAL_PADDING_PX,
            }}
            aria-label={t('common.navigation.profile')}
          >
            <div className="divide-y divide-gray-100">
              {menuTabs.map((tab) => (
                <ProfileMobileMenuRow
                  key={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                  iconTheme={PROFILE_MOBILE_TAB_ICON_THEME[tab.id]}
                  onClick={() => onTabSelect(tab.id)}
                />
              ))}
            </div>
            {deleteAccountTab ? (
              <ProfileMobileMenuRow
                label={deleteAccountTab.label}
                icon={deleteAccountTab.icon}
                iconTheme={PROFILE_MOBILE_TAB_ICON_THEME.deleteAccount}
                variant="danger"
                onClick={() => onTabSelect(deleteAccountTab.id)}
              />
            ) : null}
          </nav>

          <ProfileMobileLogoutButton
            label={t('common.navigation.logout')}
            onClick={onLogout}
          />
        </div>
      </div>

      {sheetOverlay ? createPortal(sheetOverlay, document.body) : null}
    </div>
  );
}
