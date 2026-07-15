import {
  MOBILE_HOME_BG,
  MOBILE_HOME_BOTTOM_CONTENT_PADDING_PX,
  MOBILE_HOME_HORIZONTAL_PADDING_PX,
} from './mobile-home';

/** Mobile checkout page — same surface as home / order confirmation. */
export const CHECKOUT_PAGE_BG = MOBILE_HOME_BG;
export const CHECKOUT_PAGE_HORIZONTAL_PADDING_PX = MOBILE_HOME_HORIZONTAL_PADDING_PX;
/** Space below fixed navbar before page title (mobile). */
export const CHECKOUT_PAGE_NAVBAR_GAP_MOBILE_PX = 45;
export const CHECKOUT_PAGE_PADDING_TOP_PX = CHECKOUT_PAGE_NAVBAR_GAP_MOBILE_PX;
export const CHECKOUT_PAGE_PADDING_BOTTOM_PX = MOBILE_HOME_BOTTOM_CONTENT_PADDING_PX;

/** Desktop — wider column for form + summary side-by-side. */
export const CHECKOUT_PAGE_BG_DESKTOP = '#ffffff';
export const CHECKOUT_PAGE_MAX_WIDTH_PX = 1024;
export const CHECKOUT_PAGE_PADDING_X_DESKTOP_PX = 24;
export const CHECKOUT_PAGE_PADDING_TOP_DESKTOP_PX = 48;
export const CHECKOUT_PAGE_PADDING_BOTTOM_DESKTOP_PX = 48;

export const CHECKOUT_PAGE_TITLE_TO_CONTENT_GAP_PX = 24;
export const CHECKOUT_FORM_SECTION_GAP_PX = 16;
export const CHECKOUT_GRID_GAP_PX = 32;

/** Order summary receipt panel max width (px). */
export const CHECKOUT_ORDER_SUMMARY_MAX_WIDTH_PX = 300;

/** Order items preview thumbnail (px). */
export const CHECKOUT_ORDER_ITEMS_THUMB_SIZE_PX = 88;

/** Order item card — grows with title length within this range. */
export const CHECKOUT_ORDER_ITEM_CARD_MIN_WIDTH_PX = 200;
export const CHECKOUT_ORDER_ITEM_CARD_MAX_WIDTH_PX = 320;
export const CHECKOUT_ORDER_ITEM_TITLE_MAX_WIDTH_PX = 180;

/** Primary CTA pill — matches cart drawer checkout button. */
export const CHECKOUT_PRIMARY_BUTTON_HEIGHT_PX = 50;

/** Input fields, option cards, and inline alerts (px). */
export const CHECKOUT_FORM_RADIUS_PX = 15;
