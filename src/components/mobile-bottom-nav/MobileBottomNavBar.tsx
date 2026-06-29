'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Home } from 'lucide-react';
import {
  MOBILE_BOTTOM_NAV_ASSETS,
  MOBILE_BOTTOM_NAV_CART_ICON_SIZE_PX,
  MOBILE_BOTTOM_NAV_USER_ICON_HEIGHT_PX,
  MOBILE_BOTTOM_NAV_USER_ICON_WIDTH_PX,
  MOBILE_BOTTOM_NAV_WISHLIST_ICON_SIZE_PX,
  MOBILE_BOTTOM_NAV_Z_INDEX,
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

/** Figma `74:875` — fixed mobile bottom navigation bar. */
export function MobileBottomNavBar() {
  const pathname = usePathname() ?? '';
  const { t } = useTranslation();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const isHomeActive = pathname === '/';
  const isCartActive = pathname === '/cart' || pathname.startsWith('/cart/');
  const isWishlistActive = pathname === '/wishlist' || pathname.startsWith('/wishlist/');
  const isProfileActive = pathname.startsWith('/profile');

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
      <div className={styles.frame}>
        <div aria-hidden className={styles.bar} />
        <Image
          src={MOBILE_BOTTOM_NAV_ASSETS.subtractNotch}
          alt=""
          width={110}
          height={56}
          aria-hidden
          className={styles.notch}
        />
        {isHomeActive ? <div aria-hidden className={styles.activeBubble} /> : null}

        <Link
          href="/"
          aria-label={t('common.navigation.home')}
          aria-current={isHomeActive ? 'page' : undefined}
          className={joinClasses(styles.slot, styles.homeSlot)}
        >
          {isHomeActive ? (
            <Image
              src={MOBILE_BOTTOM_NAV_ASSETS.homeActive}
              alt=""
              width={78}
              height={40}
              aria-hidden
              className="h-10 w-auto max-w-full"
            />
          ) : (
            <Home className={`h-6 w-6 ${styles.homeInactiveIcon}`} aria-hidden />
          )}
        </Link>

        <Link
          href="/cart"
          aria-label={t('common.navigation.cart')}
          aria-current={isCartActive ? 'page' : undefined}
          className={joinClasses(styles.slot, styles.itemSlot, styles.itemSlotCart)}
        >
          <Image
            src={MOBILE_BOTTOM_NAV_ASSETS.iconCart}
            alt=""
            width={MOBILE_BOTTOM_NAV_CART_ICON_SIZE_PX}
            height={MOBILE_BOTTOM_NAV_CART_ICON_SIZE_PX}
            aria-hidden
          />
          {cartCount > 0 ? (
            <span className={styles.badge}>{formatBadgeCount(cartCount)}</span>
          ) : null}
        </Link>

        <Link
          href="/wishlist"
          aria-label={t('common.navigation.wishlist')}
          aria-current={isWishlistActive ? 'page' : undefined}
          className={joinClasses(styles.slot, styles.itemSlot, styles.itemSlotWishlist)}
        >
          <Image
            src={MOBILE_BOTTOM_NAV_ASSETS.iconWishlist}
            alt=""
            width={MOBILE_BOTTOM_NAV_WISHLIST_ICON_SIZE_PX}
            height={MOBILE_BOTTOM_NAV_WISHLIST_ICON_SIZE_PX}
            aria-hidden
          />
          {wishlistCount > 0 ? (
            <span className={styles.badge}>{formatBadgeCount(wishlistCount)}</span>
          ) : null}
        </Link>

        <Link
          href="/profile"
          aria-label={t('common.navigation.profile')}
          aria-current={isProfileActive ? 'page' : undefined}
          className={joinClasses(styles.slot, styles.itemSlot, styles.itemSlotProfile)}
        >
          <Image
            src={MOBILE_BOTTOM_NAV_ASSETS.iconUser}
            alt=""
            width={MOBILE_BOTTOM_NAV_USER_ICON_WIDTH_PX}
            height={MOBILE_BOTTOM_NAV_USER_ICON_HEIGHT_PX}
            aria-hidden
          />
        </Link>
      </div>
    </nav>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(nav, document.body);
}
