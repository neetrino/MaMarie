import { BRAND_COLORS } from './brand';

/** Figma `74:875` — mobile bottom navigation shell. */
export const MOBILE_BOTTOM_NAV_DESIGN_WIDTH_PX = 375;
export const MOBILE_BOTTOM_NAV_SHELL_HEIGHT_PX = 114;
export const MOBILE_BOTTOM_NAV_BAR_TOP_PX = 9;
export const MOBILE_BOTTOM_NAV_BAR_HEIGHT_PX = 76;
export const MOBILE_BOTTOM_NAV_BAR_RADIUS_PX = 30;
export const MOBILE_BOTTOM_NAV_SHADOW_BLUR_PX = 7;
export const MOBILE_BOTTOM_NAV_SHADOW_OPACITY = 0.11;

export const MOBILE_BOTTOM_NAV_NOTCH_LEFT_PX = 12;
export const MOBILE_BOTTOM_NAV_NOTCH_WIDTH_PX = 110;
export const MOBILE_BOTTOM_NAV_NOTCH_HEIGHT_PX = 56;
export const MOBILE_BOTTOM_NAV_NOTCH_FILL = '#eff1f5';

export const MOBILE_BOTTOM_NAV_ACTIVE_BUBBLE_LEFT_PX = 39;
export const MOBILE_BOTTOM_NAV_ACTIVE_BUBBLE_SIZE_PX = 56;
export const MOBILE_BOTTOM_NAV_ACTIVE_BUBBLE_COLOR = BRAND_COLORS.pink;

export const MOBILE_BOTTOM_NAV_HOME_SLOT_LEFT_PX = 28;
export const MOBILE_BOTTOM_NAV_HOME_SLOT_TOP_PX = 8;
export const MOBILE_BOTTOM_NAV_HOME_SLOT_WIDTH_PX = 78;
export const MOBILE_BOTTOM_NAV_HOME_SLOT_HEIGHT_PX = 40;

export const MOBILE_BOTTOM_NAV_ITEM_SLOT_WIDTH_PX = 78;
export const MOBILE_BOTTOM_NAV_ITEM_SLOT_HEIGHT_PX = 40;
/** Bar top + inner offset (`9 + 18`). */
export const MOBILE_BOTTOM_NAV_ITEM_SLOT_TOP_PX =
  MOBILE_BOTTOM_NAV_BAR_TOP_PX + 18;
export const MOBILE_BOTTOM_NAV_ITEM_SLOT_LEFTS_PX = [110, 189, 268] as const;

export const MOBILE_BOTTOM_NAV_CART_ICON_SIZE_PX = 18;
export const MOBILE_BOTTOM_NAV_WISHLIST_ICON_SIZE_PX = 20;
export const MOBILE_BOTTOM_NAV_USER_ICON_WIDTH_PX = 16;
export const MOBILE_BOTTOM_NAV_USER_ICON_HEIGHT_PX = 18;

/** Page bottom inset — keeps content above the fixed bar (not used on `lg+`). */
export const MOBILE_BOTTOM_NAV_LAYOUT_CLEARANCE_PX = MOBILE_BOTTOM_NAV_SHELL_HEIGHT_PX;

/** Stacking — above page content; below fixed header (`80`) and menu panel (`75`). */
export const MOBILE_BOTTOM_NAV_Z_INDEX = 70;

/** Bar sits flush to the shell bottom (0px gap). */
export const MOBILE_BOTTOM_NAV_BAR_BOTTOM_INSET_PX = 0;

export const MOBILE_BOTTOM_NAV_ASSETS = {
  subtractNotch: '/assets/mobile-bottom-nav/subtract-notch.svg',
  homeActive: '/assets/mobile-bottom-nav/home-active.svg',
  iconCart: '/assets/mobile-bottom-nav/icon-cart.svg',
  iconWishlist: '/assets/mobile-bottom-nav/icon-bell.svg',
  iconUser: '/assets/mobile-bottom-nav/icon-user.svg',
} as const;
