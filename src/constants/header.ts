import { LOGO_HEADER_HEIGHT_PX } from './brand';
import { MOBILE_HOME_HORIZONTAL_PADDING_PX } from './mobile-home';

/** Scroll distance before home navbar switches to pill mode. */
export const HEADER_HOME_SCROLL_THRESHOLD_PX = 12;

/** Top inset when navbar overlays the hero — 0 = flush to viewport top. */
export const HEADER_HOME_OVERLAY_TOP_PX = 0;

/** Nudge homepage navbar up (negative px = higher on screen). */
export const HEADER_HOME_OFFSET_Y_PX = -16;

/** Mobile uses the same Figma offset; z-index/stacking keeps it visible on real devices. */
export const HEADER_HOME_OFFSET_Y_MOBILE_PX = HEADER_HOME_OFFSET_Y_PX;

/** Figma `74:729` — mobile top navbar layout. */
/** Matches mobile hero horizontal inset (`MOBILE_HOME_HORIZONTAL_PADDING_PX`). */
export const HEADER_MOBILE_PADDING_X_PX = MOBILE_HOME_HORIZONTAL_PADDING_PX;
export const HEADER_MOBILE_NAV_ROW_HEIGHT_PX = 80;
export const HEADER_MOBILE_LOGO_WIDTH_PX = 98;
export const HEADER_MOBILE_LOGO_HEIGHT_PX = 49;
/** Figma `74:731` — image crop inside the mobile logo frame. */
export const HEADER_MOBILE_LOGO_CROP_WIDTH_PERCENT = 100.05;
export const HEADER_MOBILE_LOGO_CROP_HEIGHT_PERCENT = 114.27;
export const HEADER_MOBILE_LOGO_CROP_TOP_PERCENT = 0.01;
export const HEADER_MOBILE_ACTION_BUTTON_SIZE_PX = 40;
export const HEADER_MOBILE_ACTIONS_GAP_PX = 11;
export const HEADER_MOBILE_LANGUAGE_ICON_SIZE_PX = 24;
export const HEADER_MOBILE_MENU_ICON_SIZE_PX = 22;

/** Shared bottom band — logo, actions, and scrolled pill align to this height. */
export const HEADER_MOBILE_NAV_BAND_HEIGHT_PX = HEADER_MOBILE_LOGO_HEIGHT_PX;

/** Scrolled pill on mobile — taller than logo/actions band, bottom-aligned. */
export const HEADER_MOBILE_PILL_EXTRA_HEIGHT_PX = 7;
export const HEADER_MOBILE_PILL_HEIGHT_PX =
  HEADER_MOBILE_NAV_BAND_HEIGHT_PX + HEADER_MOBILE_PILL_EXTRA_HEIGHT_PX;

/** Width of language + menu button group (`40 + 11 + 40`). */
export const HEADER_MOBILE_ACTIONS_WIDTH_PX =
  HEADER_MOBILE_ACTION_BUTTON_SIZE_PX * 2 + HEADER_MOBILE_ACTIONS_GAP_PX;

/** Figma `74:729` — top inset before logo/actions band (`80 − 49`). */
export const HEADER_MOBILE_NAV_TOP_INSET_PX =
  HEADER_MOBILE_NAV_ROW_HEIGHT_PX - HEADER_MOBILE_NAV_BAND_HEIGHT_PX;

/** Bottom edge of the fixed mobile header in viewport coordinates. */
export const HEADER_MOBILE_VISIBLE_BOTTOM_PX =
  HEADER_MOBILE_NAV_ROW_HEIGHT_PX +
  HEADER_HOME_OVERLAY_TOP_PX +
  HEADER_HOME_OFFSET_Y_MOBILE_PX;

/** Fixed stacking — header stays above menu scrim/panel and bottom-nav overlays on real devices. */
export const HEADER_MOBILE_Z_INDEX = 80;
export const MOBILE_NAV_MENU_SCRIM_Z_INDEX = 60;
export const MOBILE_NAV_MENU_PANEL_Z_INDEX = 75;

/** @deprecated Use `HEADER_MOBILE_VISIBLE_BOTTOM_PX`. */
export const HEADER_MOBILE_NAV_HEIGHT_PX = HEADER_MOBILE_VISIBLE_BOTTOM_PX;

/** Vertical padding on desktop nav row (smaller = navbar sits higher). */
export const HEADER_DESKTOP_ROW_PADDING_Y_PX = 0;

/** Pill fade-in duration (ms). */
export const HEADER_PILL_APPEAR_DURATION_MS = 500;

/** On scroll, logo and action icons nudge inward toward pill center. */
export const HEADER_MOBILE_PILL_CONTENT_INSET_PX = 8;
/** Extra right nudge for the logo on scroll (added to `HEADER_MOBILE_PILL_CONTENT_INSET_PX`). */
export const HEADER_MOBILE_PILL_LOGO_EXTRA_INSET_PX = 4;
export const HEADER_MOBILE_PILL_LOGO_INSET_PX =
  HEADER_MOBILE_PILL_CONTENT_INSET_PX + HEADER_MOBILE_PILL_LOGO_EXTRA_INSET_PX;

/** Fixed pill height — narrower than full nav row, vertically centered on scroll. */
export const HEADER_PILL_SHELL_HEIGHT_PX = 70;

/** Figma `51:335` — login pill next to currency (Component 7). */
export const HEADER_LOGIN_PILL_WIDTH_PX = 46;
export const HEADER_LOGIN_PILL_HEIGHT_PX = 41;
export const HEADER_LOGIN_ICON_SIZE_PX = 25;

/** Mobile nav menu modal — panel below fixed header. */
export const MOBILE_NAV_DROPDOWN_TOP_PX = HEADER_MOBILE_VISIBLE_BOTTOM_PX;
export const MOBILE_NAV_DROPDOWN_INSET_PX = 12;
export const MOBILE_NAV_DROPDOWN_GAP_PX = 8;
export const MOBILE_NAV_DROPDOWN_RADIUS_PX = 24;
export const MOBILE_NAV_DROPDOWN_PADDING_X_PX = HEADER_MOBILE_PADDING_X_PX;
export const MOBILE_NAV_DROPDOWN_LINK_PADDING_Y_PX = 14;
export const MOBILE_NAV_MENU_EXIT_ANIMATION_MS = 260;
/** Burger ↔ close icon crossfade on the mobile menu button. */
export const MOBILE_NAV_MENU_BUTTON_ANIMATION_MS = 280;

/** Main content top inset — keeps pages below the fixed navbar (not used on `/`). */
export const HEADER_CONTENT_CLEARANCE_MOBILE_PX = HEADER_MOBILE_VISIBLE_BOTTOM_PX;

export const HEADER_CONTENT_CLEARANCE_DESKTOP_PX =
  LOGO_HEADER_HEIGHT_PX +
  HEADER_DESKTOP_ROW_PADDING_Y_PX * 2 +
  HEADER_HOME_OVERLAY_TOP_PX +
  HEADER_HOME_OFFSET_Y_PX;
