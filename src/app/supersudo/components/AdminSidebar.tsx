'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AdminMenuDrawer } from '../../../components/AdminMenuDrawer';
import { AdminBrandLogoLink } from '../../../components/AdminBrandLogoLink';
import { useTranslation } from '../../../lib/i18n-client';
import { getAdminMenuTABS } from '../admin-menu.config';
import { ADMIN_SIDEBAR_MOBILE_DRAWER_WRAP } from '../admin-sidebar-classes';

/** Mobile-only admin top bar — desktop nav lives in AdminDesktopSidebar. */
export function AdminSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname() ?? '/supersudo';
  const adminTabs = useMemo(() => getAdminMenuTABS(t), [t]);

  return (
    <div className={ADMIN_SIDEBAR_MOBILE_DRAWER_WRAP}>
      <div className="flex items-center justify-between gap-3">
        <AdminBrandLogoLink className="shrink-0" />
        <AdminMenuDrawer tabs={adminTabs} currentPath={pathname} />
      </div>
    </div>
  );
}
