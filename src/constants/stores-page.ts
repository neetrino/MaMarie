/** Partner stores page layout tokens — match wishlist page chrome. */
import { BRAND_COLORS } from './brand';
import { MOBILE_WISHLIST_PAGE_HORIZONTAL_PADDING_PX } from './mobile-wishlist';
import {
  WISHLIST_PAGE_CONTENT_WIDTH_PX,
  WISHLIST_PAGE_MOBILE_TITLE_FONT_SIZE_PX,
  WISHLIST_PAGE_MOBILE_TITLE_LINE_HEIGHT_PX,
  WISHLIST_PAGE_TITLE_FONT_SIZE_PX,
  WISHLIST_PAGE_TITLE_LINE_HEIGHT_PX,
} from './wishlist-empty-state';

/** `lg:px-8` — same side inset as wishlist desktop. */
export const STORES_PAGE_HORIZONTAL_PADDING_PX = 32;
export const STORES_PAGE_HORIZONTAL_PADDING_LEFT_PX = STORES_PAGE_HORIZONTAL_PADDING_PX;
export const STORES_PAGE_HORIZONTAL_PADDING_RIGHT_PX = STORES_PAGE_HORIZONTAL_PADDING_PX;

/** Tailwind `max-w-7xl` — same shell as wishlist desktop. */
export const STORES_PAGE_MAX_WIDTH_PX =
  WISHLIST_PAGE_CONTENT_WIDTH_PX + STORES_PAGE_HORIZONTAL_PADDING_PX * 2;
export const STORES_PAGE_VERTICAL_PADDING_PX = 48;
export const STORES_PAGE_BG = '#ffffff';
export const STORES_PAGE_MOBILE_BG = '#ffffff';
export const STORES_PAGE_MOBILE_PADDING_PX = MOBILE_WISHLIST_PAGE_HORIZONTAL_PADDING_PX;
export const STORES_PAGE_COLUMN_GAP_PX = 24;
export const STORES_PAGE_CARD_RADIUS_PX = 24;
export const STORES_PAGE_CARD_SHADOW = '0 8px 32px rgba(87, 66, 59, 0.08)';

/** Same title scale as wishlist page (`Իմ ցանկությունների ցուցակ`). */
export const STORES_PAGE_TITLE_FONT_SIZE_PX = WISHLIST_PAGE_TITLE_FONT_SIZE_PX;
export const STORES_PAGE_TITLE_LINE_HEIGHT_PX = WISHLIST_PAGE_TITLE_LINE_HEIGHT_PX;
export const STORES_PAGE_MOBILE_TITLE_FONT_SIZE_PX = WISHLIST_PAGE_MOBILE_TITLE_FONT_SIZE_PX;
export const STORES_PAGE_MOBILE_TITLE_LINE_HEIGHT_PX = WISHLIST_PAGE_MOBILE_TITLE_LINE_HEIGHT_PX;

export const STORES_PAGE_HEADING_PADDING_Y_PX = 0;
export const STORES_PAGE_HEADING_MIN_HEIGHT_PX = 0;
export const STORES_PAGE_HEADING_BOTTOM_GAP_PX = 32;
export const STORES_PAGE_HEADING_BOTTOM_GAP_LG_PX = 48;

export const STORES_PANEL_HEIGHT_PX = 560;
export const STORES_LIST_PANEL_WIDTH_PX = 320;
export const STORES_LIST_MAX_HEIGHT_PX = STORES_PANEL_HEIGHT_PX;
export const STORES_MAP_MIN_HEIGHT_PX = STORES_PANEL_HEIGHT_PX;
export const STORES_MAP_MIN_HEIGHT_MOBILE_PX = 320;

/** Yerevan center — default map viewport before stores load. */
export const STORES_MAP_DEFAULT_CENTER = {
  latitude: 40.1772,
  longitude: 44.5136,
} as const;

export const STORES_MAP_DEFAULT_ZOOM = 13;
export const STORES_MAP_SELECTED_ZOOM = 15;
/** Keep viewport fixed when marker popups open (no auto-pan). */
export const STORES_MAP_POPUP_AUTO_PAN = false;

export const STORES_PAGE_ASSETS = {
  iconLocation: '/assets/contact/icon-location.png',
} as const;

export const STORES_CARD_ACTIVE_BG = '#e8f4fd';
export const STORES_CARD_ACTIVE_BORDER = BRAND_COLORS.sky;
export const STORES_CARD_ACTIVE_DOT = '#3b82f6';
