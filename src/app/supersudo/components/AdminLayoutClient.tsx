'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../../../lib/i18n-client';
import { getAdminMenuTABS } from '../admin-menu.config';
import {
  ADMIN_MAIN_COLUMN,
  ADMIN_MAIN_INNER,
  ADMIN_PAGE_SHELL,
} from '../admin-sidebar-classes';
import { AdminDialogsProvider } from '../context/AdminDialogsContext';
import { AdminSidebarCollapseProvider } from '../context/AdminSidebarCollapseContext';
import { AdminDesktopSidebar } from './AdminDesktopSidebar';
import { AdminSidebar } from './AdminSidebar';

type AdminLayoutClientProps = {
  children: ReactNode;
};

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const { t } = useTranslation();
  const pathname = usePathname() ?? '/supersudo';
  const adminTabs = useMemo(() => getAdminMenuTABS(t), [t]);

  return (
    <AdminSidebarCollapseProvider>
      <AdminDialogsProvider>
        <div className={ADMIN_PAGE_SHELL}>
          <AdminSidebar />
          <AdminDesktopSidebar tabs={adminTabs} pathname={pathname} />
          <div className={ADMIN_MAIN_COLUMN}>
            <div className={ADMIN_MAIN_INNER}>{children}</div>
          </div>
        </div>
      </AdminDialogsProvider>
    </AdminSidebarCollapseProvider>
  );
}
