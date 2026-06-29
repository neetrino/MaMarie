'use client';

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MOBILE_BOTTOM_NAV_ASSETS,
  MOBILE_BOTTOM_NAV_CART_ICON_SIZE_PX,
  MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_HEIGHT_PX,
  MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_WIDTH_PX,
  MOBILE_BOTTOM_NAV_DESIGN_WIDTH_PX,
  MOBILE_BOTTOM_NAV_HOME_SLOT_HEIGHT_PX,
  MOBILE_BOTTOM_NAV_HOME_SLOT_WIDTH_PX,
  MOBILE_BOTTOM_NAV_INACTIVE_LAYOUTS,
  MOBILE_BOTTOM_NAV_USER_ICON_HEIGHT_PX,
  MOBILE_BOTTOM_NAV_USER_ICON_WIDTH_PX,
  MOBILE_BOTTOM_NAV_WISHLIST_ICON_SIZE_PX,
  MOBILE_BOTTOM_NAV_Z_INDEX,
  type MobileBottomNavItemId,
  getMobileBottomNavActiveLayout,
  resolveMobileBottomNavActiveItem,
} from '../../constants/mobile-bottom-nav';
import { getCartCount, getWishlistCount } from '../../lib/storageCounts';
import { useTranslation } from '../../lib/i18n-client';
import styles from './MobileBottomNavBar.module.css';

function joinClasses(...classes: ReadonlyArray<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

function formatBadgeCount(count: number): string {
  return count > 99 ? '99+' : String(count);
}

function slotLeftStyle(leftPx: number): CSSProperties {
  return {
    left: `calc(100% * ${leftPx} / ${MOBILE_BOTTOM_NAV_DESIGN_WIDTH_PX})`,
  };
}

interface BottomNavItemConfig {
  id: MobileBottomNavItemId;
  href: string;
  labelKey: string;
  renderIcon: (isActive: boolean) => ReactNode;
  badgeCount?: number;
}

function buildFrameStyle(activeItemId: MobileBottomNavItemId): CSSProperties {
  const layout = getMobileBottomNavActiveLayout(activeItemId);

  return {
    '--bottom-nav-notch-left': layout.notchLeftPx,
    '--bottom-nav-notch-top-px': layout.notchTopPx,
    '--bottom-nav-notch-width': layout.notchWidthPx,
    '--bottom-nav-notch-height-px': layout.notchHeightPx,
  } as CSSProperties;
}

function NavSlotIcon({
  isActive,
  inactiveSrc,
  activeSrc,
  width,
  height,
  fullSlot,
}: {
  isActive: boolean;
  inactiveSrc: string;
  activeSrc: string;
  width: number;
  height: number;
  fullSlot?: boolean;
}) {
  const iconClass = fullSlot ? styles.slotIcon : undefined;

  return (
    <span className={styles.iconStack} aria-hidden>
      <Image
        src={inactiveSrc}
        alt=""
        width={width}
        height={height}
        aria-hidden
        className={joinClasses(
          styles.iconLayer,
          iconClass,
          !isActive && styles.iconLayerVisible
        )}
      />
      <Image
        src={activeSrc}
        alt=""
        width={width}
        height={height}
        aria-hidden
        className={joinClasses(
          styles.iconLayer,
          iconClass,
          isActive && styles.iconLayerVisible
        )}
      />
    </span>
  );
}

/** Figma bottom navigation — home `74:875`, cart `109:579`, wishlist `109:600`, profile `109:621`. */
export function MobileBottomNavBar() {
  const pathname = usePathname() ?? '';
  const { t } = useTranslation();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const activeItemId = resolveMobileBottomNavActiveItem(pathname);
  const activeLayout = activeItemId ? getMobileBottomNavActiveLayout(activeItemId) : null;
  const frameStyle = activeItemId ? buildFrameStyle(activeItemId) : undefined;

  const navItems: BottomNavItemConfig[] = [
    {
      id: 'home',
      href: '/',
      labelKey: 'common.navigation.home',
      renderIcon: (isActive) => (
        <NavSlotIcon
          isActive={isActive}
          inactiveSrc={MOBILE_BOTTOM_NAV_ASSETS.homeInactive}
          activeSrc={MOBILE_BOTTOM_NAV_ASSETS.homeActive}
          width={MOBILE_BOTTOM_NAV_HOME_SLOT_WIDTH_PX}
          height={MOBILE_BOTTOM_NAV_HOME_SLOT_HEIGHT_PX}
          fullSlot
        />
      ),
    },
    {
      id: 'cart',
      href: '/cart',
      labelKey: 'common.navigation.cart',
      badgeCount: cartCount,
      renderIcon: (isActive) => (
        <NavSlotIcon
          isActive={isActive}
          inactiveSrc={MOBILE_BOTTOM_NAV_ASSETS.iconCart}
          activeSrc={MOBILE_BOTTOM_NAV_ASSETS.cartActive}
          width={MOBILE_BOTTOM_NAV_CART_ICON_SIZE_PX}
          height={MOBILE_BOTTOM_NAV_CART_ICON_SIZE_PX}
        />
      ),
    },
    {
      id: 'wishlist',
      href: '/wishlist',
      labelKey: 'common.navigation.wishlist',
      badgeCount: wishlistCount,
      renderIcon: (isActive) => (
        <NavSlotIcon
          isActive={isActive}
          inactiveSrc={MOBILE_BOTTOM_NAV_ASSETS.iconWishlist}
          activeSrc={MOBILE_BOTTOM_NAV_ASSETS.wishlistActive}
          width={MOBILE_BOTTOM_NAV_WISHLIST_ICON_SIZE_PX}
          height={MOBILE_BOTTOM_NAV_WISHLIST_ICON_SIZE_PX}
        />
      ),
    },
    {
      id: 'profile',
      href: '/profile',
      labelKey: 'common.navigation.profile',
      renderIcon: (isActive) => (
        <NavSlotIcon
          isActive={isActive}
          inactiveSrc={MOBILE_BOTTOM_NAV_ASSETS.iconUser}
          activeSrc={MOBILE_BOTTOM_NAV_ASSETS.profileActive}
          width={MOBILE_BOTTOM_NAV_USER_ICON_WIDTH_PX}
          height={MOBILE_BOTTOM_NAV_USER_ICON_HEIGHT_PX}
        />
      ),
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateCounts = () => {
      setWishlistCount(getWishlistCount());
      setCartCount(getCartCount());
    };

    updateCounts();
    window.addEventListener('wishlist-updated', updateCounts);
    window.addEventListener('cart-updated', updateCounts);

    return () => {
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('cart-updated', updateCounts);
    };
  }, []);

  const nav = (
    <nav
      className={joinClasses(styles.root, styles.shell)}
      aria-label={t('common.navigation.mainNavigation')}
      style={{ zIndex: MOBILE_BOTTOM_NAV_Z_INDEX }}
    >
      <div className={styles.frame} style={frameStyle}>
        <div aria-hidden className={styles.bar} />
        {activeLayout ? (
          <Image
            src={MOBILE_BOTTOM_NAV_ASSETS.circleNotch}
            alt=""
            width={MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_WIDTH_PX}
            height={MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_HEIGHT_PX}
            aria-hidden
            className={styles.circleNotch}
          />
        ) : null}

        {navItems.map((item) => {
          const isActive = activeItemId === item.id;
          const inactiveLayout = MOBILE_BOTTOM_NAV_INACTIVE_LAYOUTS[item.id];
          const slotLayout = isActive && activeLayout
            ? {
                leftPx: activeLayout.activeSlotLeftPx,
                topPx: activeLayout.activeSlotTopPx,
              }
            : {
                leftPx: inactiveLayout.slotLeftPx,
                topPx: inactiveLayout.slotTopPx,
              };

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={t(item.labelKey)}
              aria-current={isActive ? 'page' : undefined}
              className={styles.slot}
              style={{
                ...slotLeftStyle(slotLayout.leftPx),
                top: `${slotLayout.topPx}px`,
              }}
            >
              {item.renderIcon(isActive)}
              {item.badgeCount && item.badgeCount > 0 ? (
                <span className={styles.badge}>{formatBadgeCount(item.badgeCount)}</span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(nav, document.body);
}
