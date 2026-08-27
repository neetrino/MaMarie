'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import type { AdminMenuItem } from '../../../components/AdminMenuDrawer';
import {
  ADMIN_DESKTOP_NAV_TRANSITION_MS,
  ADMIN_MENU_ICON_THEME,
  PROFILE_MOBILE_ICON_THEMES,
} from '../../../constants/admin-desktop-page';
import { prefetchAdminRoute } from '@/lib/admin/admin-route-prefetch';
import { isAdminTabPathActive, resolveAdminActiveMenuItem } from '../admin-nav-utils';
import { useTranslation } from '../../../lib/i18n-client';
import styles from './AdminDesktopNav.module.css';

interface AdminDesktopNavProps {
  tabs: AdminMenuItem[];
  pathname: string;
  collapsed: boolean;
  productsNestedExpanded: boolean;
  onToggleProductsNested: () => void;
}

interface IndicatorBox {
  top: number;
  height: number;
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
  if (collapsed || isAdminTabPathActive(tab.path, pathname) || productsNestedExpanded) {
    return true;
  }
  return false;
}

function AdminNavIcon({
  icon,
  themeKey,
}: {
  icon: ReactNode;
  themeKey: keyof typeof PROFILE_MOBILE_ICON_THEMES;
}) {
  const theme = PROFILE_MOBILE_ICON_THEMES[themeKey];

  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl [&>svg]:h-4 [&>svg]:w-4"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
      }}
    >
      {icon}
    </span>
  );
}

function adminNavIntentHandlers(path: string) {
  return {
    onMouseEnter: () => prefetchAdminRoute(path),
    onFocus: () => prefetchAdminRoute(path),
  };
}

/** Desktop admin sidebar nav — same sliding pill as profile. */
export function AdminDesktopNav({
  tabs,
  pathname,
  collapsed,
  productsNestedExpanded,
  onToggleProductsNested,
}: AdminDesktopNavProps) {
  const { t } = useTranslation();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [indicator, setIndicator] = useState<IndicatorBox | null>(null);
  const [slideEnabled, setSlideEnabled] = useState(false);
  const [optimisticActiveId, setOptimisticActiveId] = useState<string | null>(null);

  const pathnameActive = resolveAdminActiveMenuItem(pathname, tabs);
  const activeId = optimisticActiveId ?? pathnameActive?.id ?? null;
  const activeThemeKey = activeId ? (ADMIN_MENU_ICON_THEME[activeId] ?? 'pink') : 'pink';
  const activeTheme = PROFILE_MOBILE_ICON_THEMES[activeThemeKey];

  useEffect(() => {
    setOptimisticActiveId(null);
  }, [pathname]);

  const updateIndicator = useCallback(() => {
    if (!activeId || collapsed) {
      setIndicator(null);
      return;
    }
    const node = itemRefs.current.get(activeId);
    if (!node) {
      return;
    }
    // Use offsetTop (not getBoundingClientRect) — DesktopFluidFrame `zoom` skews rect math.
    setIndicator({
      top: node.offsetTop,
      height: node.offsetHeight,
    });
  }, [activeId, collapsed]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, tabs, productsNestedExpanded]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setSlideEnabled(true);
    });
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => {
      updateIndicator();
    });
    observer.observe(nav);
    for (const node of itemRefs.current.values()) {
      observer.observe(node);
    }
    return () => {
      observer.disconnect();
    };
  }, [updateIndicator, tabs, productsNestedExpanded, collapsed]);

  const setItemRef = (id: string, node: HTMLElement | null) => {
    if (node) {
      itemRefs.current.set(id, node);
    } else {
      itemRefs.current.delete(id);
    }
  };

  const onItemActivate = (id: string) => {
    setOptimisticActiveId(id);
  };

  return (
    <nav
      ref={navRef}
      className="relative flex flex-col gap-1"
      role="navigation"
      aria-label={t('admin.menu.dashboard')}
      style={
        {
          '--admin-desktop-nav-ms': `${ADMIN_DESKTOP_NAV_TRANSITION_MS}ms`,
        } as CSSProperties
      }
    >
      {indicator ? (
        <span
          aria-hidden
          className={`pointer-events-none absolute left-0 right-0 z-0 overflow-hidden rounded-[15px] ${
            slideEnabled ? styles.indicator : styles.indicatorInstant
          }`}
          style={{
            top: indicator.top,
            height: indicator.height,
            backgroundColor: activeTheme.background,
          }}
        >
          <span
            className="absolute bottom-0 left-0 top-0 w-1"
            style={{ backgroundColor: activeTheme.foreground }}
          />
        </span>
      ) : null}

      {tabs.map((tab) => {
        if (!isProductsNestedTabVisible(tab, pathname, collapsed, productsNestedExpanded)) {
          return null;
        }

        const isActive = activeId === tab.id;
        const themeKey = ADMIN_MENU_ICON_THEME[tab.id] ?? 'pink';
        const theme = PROFILE_MOBILE_ICON_THEMES[themeKey];
        const isSubCategory = Boolean(tab.isSubCategory);

        if (tab.id === 'products' && !collapsed) {
          return (
            <div
              key={tab.id}
              ref={(node) => setItemRef(tab.id, node)}
              className="relative z-10 flex w-full min-w-0 items-stretch"
            >
              <Link
                href={tab.path}
                prefetch
                title={tab.label}
                {...adminNavIntentHandlers(tab.path)}
                onClick={() => onItemActivate(tab.id)}
                className={`flex min-w-0 flex-1 items-center gap-3 rounded-[15px] border-l-4 border-transparent px-3 py-2.5 text-left text-sm ${
                  isActive ? '' : 'hover:bg-[#faf8f5]'
                }`}
              >
                <AdminNavIcon icon={tab.icon} themeKey={themeKey} />
                <span
                  className={`${styles.navLabel} min-w-0 flex-1 truncate ${
                    isActive ? 'font-semibold' : 'font-medium text-gray-800'
                  }`}
                  style={isActive ? { color: theme.foreground } : undefined}
                >
                  {tab.label}
                </span>
              </Link>
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

        if (collapsed) {
          return (
            <Link
              key={tab.id}
              href={tab.path}
              prefetch
              title={tab.label}
              {...adminNavIntentHandlers(tab.path)}
              onClick={() => onItemActivate(tab.id)}
              className="relative z-10 flex w-full items-center justify-center rounded-[15px] px-0 py-3"
              style={isActive ? { backgroundColor: theme.background } : undefined}
            >
              <AdminNavIcon icon={tab.icon} themeKey={themeKey} />
            </Link>
          );
        }

        return (
          <Link
            key={tab.id}
            ref={(node) => setItemRef(tab.id, node)}
            href={tab.path}
            prefetch
            title={tab.label}
            {...adminNavIntentHandlers(tab.path)}
            onClick={() => onItemActivate(tab.id)}
            className={`relative z-10 flex w-full items-center gap-3 rounded-[15px] border-l-4 border-transparent py-2.5 text-left text-sm ${
              isSubCategory ? 'pl-8 pr-3' : 'px-3'
            } ${isActive ? '' : 'hover:bg-[#faf8f5]'}`}
          >
            <AdminNavIcon icon={tab.icon} themeKey={themeKey} />
            <span
              className={`${styles.navLabel} min-w-0 flex-1 truncate ${
                isActive ? 'font-semibold' : 'font-medium text-gray-800'
              }`}
              style={isActive ? { color: theme.foreground } : undefined}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
