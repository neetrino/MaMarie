import { LOGO_HEADER_HEIGHT_PX } from './brand';

/** Scroll distance before home navbar switches to pill mode. */
export const HEADER_HOME_SCROLL_THRESHOLD_PX = 12;

/** Top inset when navbar overlays the hero — 0 = flush to viewport top. */
export const HEADER_HOME_OVERLAY_TOP_PX = 0;

/** Nudge homepage navbar up (negative px = higher on screen). */
export const HEADER_HOME_OFFSET_Y_PX = -16;

/** Mobile nav row height — matches `h-16` in `HeaderNavRows`. */
export const HEADER_MOBILE_NAV_HEIGHT_PX = 64;

/** Vertical padding on desktop nav row (smaller = navbar sits higher). */
export const HEADER_DESKTOP_ROW_PADDING_Y_PX = 0;

/** Pill fade-in duration (ms). */
export const HEADER_PILL_APPEAR_DURATION_MS = 500;

/** Fixed pill height — narrower than full nav row, vertically centered on scroll. */
export const HEADER_PILL_SHELL_HEIGHT_PX = 70;

/** Figma `51:335` — login pill next to currency (Component 7). */
export const HEADER_LOGIN_PILL_WIDTH_PX = 46;
export const HEADER_LOGIN_PILL_HEIGHT_PX = 41;
export const HEADER_LOGIN_ICON_SIZE_PX = 25;

/** Main content top inset — keeps pages below the fixed navbar (not used on `/`). */
export const HEADER_CONTENT_CLEARANCE_MOBILE_PX =
  HEADER_MOBILE_NAV_HEIGHT_PX + HEADER_HOME_OVERLAY_TOP_PX + HEADER_HOME_OFFSET_Y_PX;

export const HEADER_CONTENT_CLEARANCE_DESKTOP_PX =
  LOGO_HEADER_HEIGHT_PX +
  HEADER_DESKTOP_ROW_PADDING_Y_PX * 2 +
  HEADER_HOME_OVERLAY_TOP_PX +
  HEADER_HOME_OFFSET_Y_PX;
