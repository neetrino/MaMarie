'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { AdminMenuItem } from '../../../components/AdminMenuDrawer';
import { AdminBrandLogoLink } from '../../../components/AdminBrandLogoLink';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import { prefetchAdminRoute } from '@/lib/admin/admin-route-prefetch';
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
import { useAdminSidebarCollapse } from '../context/AdminSidebarCollapseContext';
import { useAdminProductsSubnavExpanded } from '../hooks/useAdminProductsSubnavExpanded';
import { AdminDesktopNav } from './AdminDesktopNav';

interface AdminDesktopSidebarProps {
  tabs: AdminMenuItem[];
  pathname: string;
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

export function AdminDesktopSidebar({ tabs, pathname }: AdminDesktopSidebarProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { collapsed } = useAdminSidebarCollapse();
  const [productsNestedExpanded, toggleProductsNested] = useAdminProductsSubnavExpanded(pathname);

  useEffect(() => {
    prefetchAdminRoute(pathname);
  }, [pathname]);

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

      <div className={`${ADMIN_SIDEBAR_NAV} ${collapsed ? 'px-1' : 'px-2'}`}>
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
            collapsed ? 'justify-center px-0 py-1' : 'gap-3 px-3 py-1.5'
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
