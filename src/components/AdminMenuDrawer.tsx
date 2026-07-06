'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdminProductsSubnavExpanded } from '../app/supersudo/hooks/useAdminProductsSubnavExpanded';
import { isAdminTabPathActive } from '../app/supersudo/admin-nav-utils';
import { ADMIN_MENU_ICON_THEME } from '../constants/admin-desktop-page';
import {
  PROFILE_MOBILE_ASSETS,
  PROFILE_MOBILE_CARD_CLASS,
  PROFILE_MOBILE_CHEVRON_SIZE_PX,
  PROFILE_MOBILE_ICON_THEMES,
} from '../constants/profile-mobile-page';
import { useTranslation } from '../lib/i18n-client';
import { useBodyScrollLock } from '../lib/useBodyScrollLock';
import { AdminBrandLogoLink } from './AdminBrandLogoLink';

export interface AdminMenuItem {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
  isSubCategory?: boolean;
  /** Nested under Products; visibility controlled by expand/collapse toggle */
  parentGroupId?: 'products';
}

interface AdminMenuDrawerProps {
  tabs: AdminMenuItem[];
  currentPath: string;
}

function isDrawerNestedProductTabVisible(
  tab: AdminMenuItem,
  pathname: string,
  productsNestedExpanded: boolean,
): boolean {
  if (tab.parentGroupId !== 'products') {
    return true;
  }
  if (isAdminTabPathActive(tab.path, pathname)) {
    return true;
  }
  return productsNestedExpanded;
}

function AdminDrawerMenuRow({
  label,
  icon,
  iconTheme = 'pink',
  isActive,
  isSubCategory = false,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  iconTheme?: keyof typeof PROFILE_MOBILE_ICON_THEMES;
  isActive: boolean;
  isSubCategory?: boolean;
  onClick: () => void;
}) {
  const theme = PROFILE_MOBILE_ICON_THEMES[iconTheme];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between py-3.5 text-left transition-colors hover:bg-gray-50/80 ${
        isSubCategory ? 'pl-8 pr-4' : 'px-4'
      } ${isActive ? 'bg-[#faf8f5]' : ''}`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5"
          style={{
            backgroundColor: theme.background,
            color: theme.foreground,
          }}
        >
          {icon}
        </span>
        <span className={`truncate text-base ${isActive ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
          {label}
        </span>
      </span>
      <Image
        src={PROFILE_MOBILE_ASSETS.chevronRight}
        alt=""
        width={PROFILE_MOBILE_CHEVRON_SIZE_PX}
        height={PROFILE_MOBILE_CHEVRON_SIZE_PX}
        aria-hidden
        className="shrink-0 opacity-80"
      />
    </button>
  );
}

/**
 * Renders a mobile-friendly admin hamburger menu that mirrors the desktop sidebar.
 */
export function AdminMenuDrawer({ tabs, currentPath }: AdminMenuDrawerProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = currentPath || '/supersudo';
  const [productsNestedExpanded, toggleProductsNested] = useAdminProductsSubnavExpanded(pathname);

  useBodyScrollLock(open);

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="admin-menu-drawer-panel"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white px-4 py-2 text-sm font-semibold text-brand-pink shadow-sm"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6H20M4 12H16M4 18H12" />
        </svg>
        Menu
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex bg-black/35 backdrop-blur-[1px]" onClick={() => setOpen(false)}>
          <div
            id="admin-menu-drawer-panel"
            className="flex h-full min-h-screen w-[min(100%,20rem)] flex-col bg-[#faf8f5] shadow-2xl"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <AdminBrandLogoLink className="shrink-0" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200/70 bg-white text-gray-600"
                aria-label={t('admin.common.close')}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={`mx-4 mb-4 overflow-hidden ${PROFILE_MOBILE_CARD_CLASS}`}>
              <div className="divide-y divide-gray-100">
                {tabs.map((tab) => {
                  if (!isDrawerNestedProductTabVisible(tab, pathname, productsNestedExpanded)) {
                    return null;
                  }

                  const isActive = isAdminTabPathActive(tab.path, pathname);
                  const iconTheme = ADMIN_MENU_ICON_THEME[tab.id] ?? 'pink';

                  if (tab.id === 'products') {
                    return (
                      <div key={tab.id}>
                        <div className="flex w-full min-w-0 items-stretch">
                          <AdminDrawerMenuRow
                            label={tab.label}
                            icon={tab.icon}
                            iconTheme={iconTheme}
                            isActive={isActive}
                            onClick={() => handleNavigate(tab.path)}
                          />
                          <button
                            type="button"
                            aria-expanded={productsNestedExpanded}
                            aria-label={t('admin.sidebar.toggleProductsNested')}
                            onClick={(event) => {
                              event.preventDefault();
                              toggleProductsNested();
                            }}
                            className="flex shrink-0 items-center border-l border-gray-100 px-3 text-gray-600"
                          >
                            <svg
                              className={`h-5 w-5 transition-transform ${productsNestedExpanded ? '' : '-rotate-90'}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <AdminDrawerMenuRow
                      key={tab.id}
                      label={tab.label}
                      icon={tab.icon}
                      iconTheme={iconTheme}
                      isActive={isActive}
                      isSubCategory={tab.isSubCategory}
                      onClick={() => handleNavigate(tab.path)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
