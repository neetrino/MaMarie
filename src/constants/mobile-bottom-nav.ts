import { BRAND_COLORS } from './brand';

/** Figma `74:875` / `109:559+` — mobile bottom navigation shell. */
export const MOBILE_BOTTOM_NAV_DESIGN_WIDTH_PX = 375;
export const MOBILE_BOTTOM_NAV_SHELL_HEIGHT_PX = 114;
export const MOBILE_BOTTOM_NAV_BAR_TOP_PX = 9;
export const MOBILE_BOTTOM_NAV_BAR_HEIGHT_PX = 76;
export const MOBILE_BOTTOM_NAV_BAR_RADIUS_PX = 30;
export const MOBILE_BOTTOM_NAV_SHADOW_BLUR_PX = 7;
export const MOBILE_BOTTOM_NAV_SHADOW_OPACITY = 0.11;

/** Home active — Figma `74:875` / `109:559`. Circle asset aligns bubble center at `39 + 28`. */
export const MOBILE_BOTTOM_NAV_HOME_CIRCLE_LEFT_PX = 12;
export const MOBILE_BOTTOM_NAV_HOME_BUBBLE_LEFT_PX = 39;
export const MOBILE_BOTTOM_NAV_HOME_BUBBLE_SIZE_PX = 56;
export const MOBILE_BOTTOM_NAV_HOME_BUBBLE_COLOR = BRAND_COLORS.pink;

export const MOBILE_BOTTOM_NAV_HOME_SLOT_LEFT_PX = 28;
export const MOBILE_BOTTOM_NAV_HOME_ACTIVE_SLOT_LEFT_PX = 28;
export const MOBILE_BOTTOM_NAV_HOME_SLOT_TOP_PX = 8;
export const MOBILE_BOTTOM_NAV_HOME_INACTIVE_SLOT_TOP_PX = 27;
export const MOBILE_BOTTOM_NAV_HOME_SLOT_WIDTH_PX = 78;
export const MOBILE_BOTTOM_NAV_HOME_SLOT_HEIGHT_PX = 40;

/**
 * Five-tab layout — centers span home→profile with 60px steps
 * (was 80px for four tabs: home / cart / wishlist / profile).
 */
export const MOBILE_BOTTOM_NAV_SHOP_CIRCLE_LEFT_PX = 72;
export const MOBILE_BOTTOM_NAV_SHOP_ACTIVE_SLOT_LEFT_PX = 88;

export const MOBILE_BOTTOM_NAV_CART_CIRCLE_LEFT_PX = 132;
export const MOBILE_BOTTOM_NAV_CART_ACTIVE_SLOT_LEFT_PX = 148;

export const MOBILE_BOTTOM_NAV_WISHLIST_CIRCLE_LEFT_PX = 192;
export const MOBILE_BOTTOM_NAV_WISHLIST_ACTIVE_SLOT_LEFT_PX = 208;

export const MOBILE_BOTTOM_NAV_PROFILE_CIRCLE_LEFT_PX = 252;
export const MOBILE_BOTTOM_NAV_PROFILE_ACTIVE_SLOT_LEFT_PX = 268;

/** Shared circle notch for all active tabs (home `74:875`, cart `109:579`, etc.). */
export const MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_WIDTH_PX = 110;
export const MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_HEIGHT_PX = 65;
export const MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_TOP_PX = 0;

export const MOBILE_BOTTOM_NAV_ITEM_SLOT_WIDTH_PX = 78;
export const MOBILE_BOTTOM_NAV_ITEM_SLOT_HEIGHT_PX = 40;
export const MOBILE_BOTTOM_NAV_ITEM_INACTIVE_SLOT_TOP_PX =
  MOBILE_BOTTOM_NAV_BAR_TOP_PX + 18;
/** Inactive slots for shop, cart, wishlist, profile (home uses dedicated constants). */
export const MOBILE_BOTTOM_NAV_ITEM_INACTIVE_SLOT_LEFTS_PX = [
  88, 148, 208, 268,
] as const;

/** Display size — SVG scales crisply at any density. */
export const MOBILE_BOTTOM_NAV_SHOP_ICON_SIZE_PX = 20;
export const MOBILE_BOTTOM_NAV_CART_ICON_SIZE_PX = 18;
export const MOBILE_BOTTOM_NAV_WISHLIST_ICON_SIZE_PX = 20;
export const MOBILE_BOTTOM_NAV_USER_ICON_WIDTH_PX = 16;
export const MOBILE_BOTTOM_NAV_USER_ICON_HEIGHT_PX = 18;

/** Page bottom inset — keeps content above the fixed bar (not used on `lg+`). */
export const MOBILE_BOTTOM_NAV_LAYOUT_CLEARANCE_PX = MOBILE_BOTTOM_NAV_SHELL_HEIGHT_PX;

/** Stacking — above page content; below fixed header (`80`) and menu panel (`75`). */
export const MOBILE_BOTTOM_NAV_Z_INDEX = 70;

/** Tab switch animation — bubble, notch, and icon positions. */
export const MOBILE_BOTTOM_NAV_TRANSITION_MS = 280;
export const MOBILE_BOTTOM_NAV_TRANSITION_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

/** Bar sits flush to the shell bottom (0px gap). */
export const MOBILE_BOTTOM_NAV_BAR_BOTTOM_INSET_PX = 0;

export const MOBILE_BOTTOM_NAV_ASSETS = {
  circleNotch: '/assets/mobile-bottom-nav/circle-notch.svg',
  homeActive: '/assets/mobile-bottom-nav/home-active.svg',
  homeInactive: '/assets/mobile-bottom-nav/home-inactive.svg',
  shopActive: '/assets/mobile-bottom-nav/shop-active.svg',
  cartActive: '/assets/mobile-bottom-nav/cart-active.svg',
  wishlistActive: '/assets/mobile-bottom-nav/wishlist-active.svg',
  profileActive: '/assets/mobile-bottom-nav/profile-active.svg',
  iconShop: '/assets/mobile-bottom-nav/icon-shop.svg',
  iconCart: '/assets/mobile-bottom-nav/icon-cart.svg',
  iconWishlist: '/assets/mobile-bottom-nav/icon-bell.svg',
  iconUser: '/assets/mobile-bottom-nav/icon-user.svg',
} as const;

export type MobileBottomNavItemId =
  | 'home'
  | 'shop'
  | 'cart'
  | 'wishlist'
  | 'profile';

/** Bar flush to viewport — vertical offset from Figma artboard. */
export const MOBILE_BOTTOM_NAV_FLUSH_BAR_TOP_PX =
  MOBILE_BOTTOM_NAV_SHELL_HEIGHT_PX - MOBILE_BOTTOM_NAV_BAR_HEIGHT_PX;

function toFlushTopPx(figmaTopPx: number): number {
  return (
    figmaTopPx +
    MOBILE_BOTTOM_NAV_FLUSH_BAR_TOP_PX -
    MOBILE_BOTTOM_NAV_BAR_TOP_PX
  );
}

export interface MobileBottomNavActiveLayout {
  notchLeftPx: number;
  notchTopPx: number;
  notchWidthPx: number;
  notchHeightPx: number;
  activeSlotLeftPx: number;
  activeSlotTopPx: number;
}

export interface MobileBottomNavInactiveLayout {
  slotLeftPx: number;
  slotTopPx: number;
}

const MOBILE_BOTTOM_NAV_ACTIVE_LAYOUTS: Record<
  MobileBottomNavItemId,
  MobileBottomNavActiveLayout
> = {
  home: {
    notchLeftPx: MOBILE_BOTTOM_NAV_HOME_CIRCLE_LEFT_PX,
    notchTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_TOP_PX),
    notchWidthPx: MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_WIDTH_PX,
    notchHeightPx: MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_HEIGHT_PX,
    activeSlotLeftPx: MOBILE_BOTTOM_NAV_HOME_ACTIVE_SLOT_LEFT_PX,
    activeSlotTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_HOME_SLOT_TOP_PX),
  },
  shop: {
    notchLeftPx: MOBILE_BOTTOM_NAV_SHOP_CIRCLE_LEFT_PX,
    notchTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_TOP_PX),
    notchWidthPx: MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_WIDTH_PX,
    notchHeightPx: MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_HEIGHT_PX,
    activeSlotLeftPx: MOBILE_BOTTOM_NAV_SHOP_ACTIVE_SLOT_LEFT_PX,
    activeSlotTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_HOME_SLOT_TOP_PX),
  },
  cart: {
    notchLeftPx: MOBILE_BOTTOM_NAV_CART_CIRCLE_LEFT_PX,
    notchTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_TOP_PX),
    notchWidthPx: MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_WIDTH_PX,
    notchHeightPx: MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_HEIGHT_PX,
    activeSlotLeftPx: MOBILE_BOTTOM_NAV_CART_ACTIVE_SLOT_LEFT_PX,
    activeSlotTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_HOME_SLOT_TOP_PX),
  },
  wishlist: {
    notchLeftPx: MOBILE_BOTTOM_NAV_WISHLIST_CIRCLE_LEFT_PX,
    notchTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_TOP_PX),
    notchWidthPx: MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_WIDTH_PX,
    notchHeightPx: MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_HEIGHT_PX,
    activeSlotLeftPx: MOBILE_BOTTOM_NAV_WISHLIST_ACTIVE_SLOT_LEFT_PX,
    activeSlotTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_HOME_SLOT_TOP_PX),
  },
  profile: {
    notchLeftPx: MOBILE_BOTTOM_NAV_PROFILE_CIRCLE_LEFT_PX,
    notchTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_TOP_PX),
    notchWidthPx: MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_WIDTH_PX,
    notchHeightPx: MOBILE_BOTTOM_NAV_CIRCLE_NOTCH_HEIGHT_PX,
    activeSlotLeftPx: MOBILE_BOTTOM_NAV_PROFILE_ACTIVE_SLOT_LEFT_PX,
    activeSlotTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_HOME_SLOT_TOP_PX),
  },
};

export const MOBILE_BOTTOM_NAV_INACTIVE_LAYOUTS: Record<
  MobileBottomNavItemId,
  MobileBottomNavInactiveLayout
> = {
  home: {
    slotLeftPx: MOBILE_BOTTOM_NAV_HOME_SLOT_LEFT_PX,
    slotTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_HOME_INACTIVE_SLOT_TOP_PX),
  },
  shop: {
    slotLeftPx: MOBILE_BOTTOM_NAV_ITEM_INACTIVE_SLOT_LEFTS_PX[0],
    slotTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_ITEM_INACTIVE_SLOT_TOP_PX),
  },
  cart: {
    slotLeftPx: MOBILE_BOTTOM_NAV_ITEM_INACTIVE_SLOT_LEFTS_PX[1],
    slotTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_ITEM_INACTIVE_SLOT_TOP_PX),
  },
  wishlist: {
    slotLeftPx: MOBILE_BOTTOM_NAV_ITEM_INACTIVE_SLOT_LEFTS_PX[2],
    slotTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_ITEM_INACTIVE_SLOT_TOP_PX),
  },
  profile: {
    slotLeftPx: MOBILE_BOTTOM_NAV_ITEM_INACTIVE_SLOT_LEFTS_PX[3],
    slotTopPx: toFlushTopPx(MOBILE_BOTTOM_NAV_ITEM_INACTIVE_SLOT_TOP_PX),
  },
};

/** Active tab decoration + raised slot coordinates from Figma. */
export function getMobileBottomNavActiveLayout(
  itemId: MobileBottomNavItemId
): MobileBottomNavActiveLayout {
  return MOBILE_BOTTOM_NAV_ACTIVE_LAYOUTS[itemId];
}

/** Resolves which bottom-nav tab matches the current route. */
export function resolveMobileBottomNavActiveItem(
  pathname: string
): MobileBottomNavItemId | null {
  if (pathname === '/') {
    return 'home';
  }
  if (pathname === '/products' || pathname.startsWith('/products/')) {
    return 'shop';
  }
  if (pathname === '/cart' || pathname.startsWith('/cart/')) {
    return 'cart';
  }
  if (pathname === '/wishlist' || pathname.startsWith('/wishlist/')) {
    return 'wishlist';
  }
  if (pathname.startsWith('/profile')) {
    return 'profile';
  }
  return null;
}
