'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AdminMenuItem } from '../../../components/AdminMenuDrawer';
import { AdminBrandLogoLink } from '../../../components/AdminBrandLogoLink';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import { prefetchAdminRoute } from '@/lib/admin/admin-route-prefetch';
import {
  ADMIN_MENU_ICON_THEME,
  PROFILE_MOBILE_ICON_THEMES,
} from '../../../constants/admin-desktop-page';
import {
  ADMIN_SIDEBAR_ASIDE,
  ADMIN_SIDEBAR_FOOTER,
  ADMIN_SIDEBAR_HEADER,
  ADMIN_SIDEBAR_HEADER_COLLAPSED,
  ADMIN_SIDEBAR_HEADER_LOGO_WRAP,
  ADMIN_SIDEBAR_HEIGHT,
  ADMIN_SIDEBAR_NAV,
  ADMIN_SIDEBAR_WIDTH_COLLAPSED_PX,
  ADMIN_SIDEBAR_WIDTH_EXPANDED_PX,
} from '../admin-sidebar-classes';
import { isAdminTabPathActive } from '../admin-nav-utils';
import { useAdminSidebarCollapse } from '../context/AdminSidebarCollapseContext';
import { useAdminProductsSubnavExpanded } from '../hooks/useAdminProductsSubnavExpanded';

interface AdminDesktopSidebarProps {
  tabs: AdminMenuItem[];
  pathname: string;
}

function isProductsNestedTabVisible(
  tab: AdminMenuItem,
  pathname: string,
  collapsed: boolean,
  productsNestedExpanded: boolean,
): boolean {
  if (tab.parentGroupId !== 'products') {
    return true;
  }
  if (collapsed) {
    return true;
  }
  if (isAdminTabPathActive(tab.path, pathname)) {
    return true;
  }
  return productsNestedExpanded;
}

function AdminSidebarToggleButton() {
  const { t } = useTranslation();
  const { collapsed, toggleCollapsed } = useAdminSidebarCollapse();

  return (
    <button
      type="button"
      onClick={toggleCollapsed}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border border-gray-200/80 text-gray-600 transition-colors hover:border-gray-300 hover:bg-[#faf8f5] hover:text-gray-900"
      aria-expanded={!collapsed}
      aria-label={collapsed ? t('admin.sidebar.expand') : t('admin.sidebar.collapse')}
      title={collapsed ? t('admin.sidebar.expand') : t('admin.sidebar.collapse')}
    >
      {collapsed ? (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      )}
    </button>
  );
}

function AdminNavIcon({ icon, themeKey }: { icon: ReactNode; themeKey: keyof typeof PROFILE_MOBILE_ICON_THEMES }) {
  const theme = PROFILE_MOBILE_ICON_THEMES[themeKey];

  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
      }}
    >
      {icon}
    </span>
  );
}

function adminNavIntentHandlers(path: string, navigate: (path: string) => void) {
  return {
    onMouseEnter: () => prefetchAdminRoute(path),
    onFocus: () => prefetchAdminRoute(path),
    onClick: () => navigate(path),
  };
}

function AdminDesktopNav({
  tabs,
  pathname,
  collapsed,
  productsNestedExpanded,
  onToggleProductsNested,
}: {
  tabs: AdminMenuItem[];
  pathname: string;
  collapsed: boolean;
  productsNestedExpanded: boolean;
  onToggleProductsNested: () => void;
}) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <nav
      className={`flex flex-col gap-1 ${collapsed ? 'px-1' : 'px-2'}`}
      role="navigation"
      aria-label={t('admin.menu.dashboard')}
    >
      {tabs.map((tab) => {
        if (!isProductsNestedTabVisible(tab, pathname, collapsed, productsNestedExpanded)) {
          return null;
        }

        const isActive = isAdminTabPathActive(tab.path, pathname);
        const themeKey = ADMIN_MENU_ICON_THEME[tab.id] ?? 'pink';
        const theme = PROFILE_MOBILE_ICON_THEMES[themeKey];
        const isSubCategory = Boolean(tab.isSubCategory);

        if (tab.id === 'products' && !collapsed) {
          return (
            <div
              key={tab.id}
              className={`flex w-full min-w-0 overflow-hidden rounded-[15px] ${
                isActive ? '' : 'border-transparent'
              }`}
            >
              <button
                type="button"
                title={tab.label}
                {...adminNavIntentHandlers(tab.path, router.push)}
                className={`flex min-w-0 flex-1 items-center gap-3 rounded-[15px] border-l-4 px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive ? 'pl-[calc(0.75rem-4px)]' : 'border-transparent hover:bg-[#faf8f5]'
                }`}
                style={
                  isActive
                    ? {
                        borderLeftColor: theme.foreground,
                        backgroundColor: theme.background,
                        color: theme.foreground,
                      }
                    : undefined
                }
              >
                <AdminNavIcon icon={tab.icon} themeKey={themeKey} />
                <span className="min-w-0 flex-1 truncate font-semibold">{tab.label}</span>
              </button>
              <button
                type="button"
                aria-expanded={productsNestedExpanded}
                aria-label={t('admin.sidebar.toggleProductsNested')}
                onClick={(event) => {
                  event.preventDefault();
                  onToggleProductsNested();
                }}
                className="flex shrink-0 items-center rounded-[15px] px-2 py-2.5 text-gray-600 transition-colors hover:bg-[#faf8f5]"
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
          );
        }

        const rowClasses = `flex w-full items-center rounded-[15px] border-l-4 text-sm font-medium transition-colors ${
          collapsed ? 'justify-center border-transparent px-0 py-3' : 'gap-3 py-2.5'
        } ${!collapsed && isSubCategory ? 'pl-8 pr-3' : !collapsed ? 'px-3' : ''} ${
          isActive && !collapsed ? 'pl-[calc(0.75rem-4px)]' : 'border-transparent hover:bg-[#faf8f5]'
        } ${isSubCategory && isActive && !collapsed ? 'pl-[calc(2rem-4px)]' : ''}`;

        return (
          <button
            key={tab.id}
            type="button"
            title={tab.label}
            {...adminNavIntentHandlers(tab.path, router.push)}
            className={rowClasses}
            style={
              isActive && !collapsed
                ? {
                    borderLeftColor: theme.foreground,
                    backgroundColor: theme.background,
                  }
                : isActive && collapsed
                  ? { backgroundColor: theme.background }
                  : undefined
            }
          >
            <AdminNavIcon icon={tab.icon} themeKey={themeKey} />
            {!collapsed ? (
              <span
                className={`min-w-0 flex-1 truncate text-left ${
                  isActive ? 'font-semibold' : 'font-medium text-gray-800'
                }`}
                style={isActive ? { color: theme.foreground } : undefined}
              >
                {tab.label}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

export function AdminDesktopSidebar({ tabs, pathname }: AdminDesktopSidebarProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { collapsed } = useAdminSidebarCollapse();
  const [productsNestedExpanded, toggleProductsNested] = useAdminProductsSubnavExpanded(pathname);
  const adminTitle = t('admin.dashboard.title');
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.lastName || adminTitle;
  const showAdminTitle =
    displayName.trim().localeCompare(adminTitle.trim(), undefined, { sensitivity: 'accent' }) !== 0;

  const sidebarWidth = collapsed ? ADMIN_SIDEBAR_WIDTH_COLLAPSED_PX : ADMIN_SIDEBAR_WIDTH_EXPANDED_PX;

  return (
    <aside
      className={ADMIN_SIDEBAR_ASIDE}
      style={{ width: sidebarWidth, height: ADMIN_SIDEBAR_HEIGHT, maxHeight: ADMIN_SIDEBAR_HEIGHT }}
      aria-label={t('admin.dashboard.title')}
    >
      {collapsed ? (
        <div className={ADMIN_SIDEBAR_HEADER_COLLAPSED}>
          <AdminSidebarToggleButton />
        </div>
      ) : (
        <div className={ADMIN_SIDEBAR_HEADER}>
          <div className={ADMIN_SIDEBAR_HEADER_LOGO_WRAP}>
            <AdminBrandLogoLink className="shrink-0 leading-none" />
          </div>
          <AdminSidebarToggleButton />
        </div>
      )}

      {!collapsed ? (
        <div className="shrink-0 border-b border-gray-100 px-4 py-4 text-center">
          <p className="text-base font-bold text-gray-900">{displayName}</p>
          {showAdminTitle ? (
            <p className="mt-0.5 text-sm font-medium text-brand-pink">{adminTitle}</p>
          ) : null}
          {user?.email ? <p className="mt-2 truncate text-xs text-gray-500">{user.email}</p> : null}
        </div>
      ) : null}

      <div className={ADMIN_SIDEBAR_NAV}>
        <AdminDesktopNav
          tabs={tabs}
          pathname={pathname}
          collapsed={collapsed}
          productsNestedExpanded={productsNestedExpanded}
          onToggleProductsNested={toggleProductsNested}
        />
      </div>

      <div className={`${ADMIN_SIDEBAR_FOOTER} ${collapsed ? 'px-1' : 'px-2'}`}>
        <Link
          href="/"
          title={t('common.navigation.home')}
          className={`flex items-center rounded-[15px] border-l-4 border-transparent transition-colors hover:bg-[#faf8f5] ${
            collapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2.5'
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fdeef2] text-brand-pink">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </span>
          {!collapsed ? (
            <span className="text-sm font-semibold text-brand-pink">{t('common.navigation.home')}</span>
          ) : null}
        </Link>
      </div>
    </aside>
  );
}
