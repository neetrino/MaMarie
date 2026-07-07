/** Partner stores page layout tokens — aligned with contact page patterns. */
import { BRAND_COLORS } from './brand';
import { HOME_SECTION_MAX_WIDTH_PX } from './home-sections';

export const STORES_PAGE_MAX_WIDTH_PX = HOME_SECTION_MAX_WIDTH_PX;
export const STORES_PAGE_HORIZONTAL_PADDING_PX = 32;
export const STORES_PAGE_VERTICAL_PADDING_PX = 48;
export const STORES_PAGE_BG = '#ffffff';
export const STORES_PAGE_MOBILE_BG = '#ffffff';
export const STORES_PAGE_MOBILE_PADDING_PX = 20;
export const STORES_PAGE_COLUMN_GAP_PX = 24;
export const STORES_PAGE_CARD_RADIUS_PX = 24;
export const STORES_PAGE_CARD_SHADOW = '0 8px 32px rgba(87, 66, 59, 0.08)';

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

export const STORES_PAGE_ASSETS = {
  iconLocation: '/assets/contact/icon-location.png',
} as const;

export const STORES_CARD_ACTIVE_BG = '#e8f4fd';
export const STORES_CARD_ACTIVE_BORDER = BRAND_COLORS.sky;
export const STORES_CARD_ACTIVE_DOT = '#3b82f6';
