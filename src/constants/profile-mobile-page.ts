import { BRAND_COLORS } from './brand';
import { MOBILE_HOME_BG, MOBILE_HOME_HORIZONTAL_PADDING_PX } from './mobile-home';
import type { ProfileTab } from '../app/profile/types';

/** Mobile profile — Figma clay menu screen. */
export const PROFILE_MOBILE_PAGE_BG = MOBILE_HOME_BG;
export const PROFILE_MOBILE_PAGE_HORIZONTAL_PADDING_PX = MOBILE_HOME_HORIZONTAL_PADDING_PX;
export const PROFILE_MOBILE_CARD_RADIUS_PX = 15;
export const PROFILE_MOBILE_MENU_ICON_BOX_SIZE_PX = 40;
export const PROFILE_MOBILE_MENU_ICON_BOX_RADIUS_PX = 12;
export const PROFILE_MOBILE_CHEVRON_SIZE_PX = 18;

/** Bottom sheet — tab content (orders, personal, etc.). */
export const PROFILE_MOBILE_TAB_SHEET_HEIGHT_VH = 72;
/** Above mobile bottom nav (`MOBILE_BOTTOM_NAV_Z_INDEX` = 70). */
export const PROFILE_MOBILE_TAB_SHEET_Z_INDEX = 90;
export const PROFILE_MOBILE_TAB_SHEET_CONTENT_PADDING_BOTTOM_PX = 28;
/** Space between drag handle and in-content title (replaces header divider on form tabs). */
export const PROFILE_MOBILE_TAB_SHEET_CONTENT_PADDING_TOP_PX = 45;
/** Horizontal inset for mobile profile sheet content (`px-5`). */
export const PROFILE_MOBILE_SHEET_CONTENT_PADDING_HORIZONTAL_PX = 20;
/** Order-details side sheet header on mobile (`px-6`). */
export const PROFILE_MOBILE_SIDE_SHEET_HEADER_PADDING_HORIZONTAL_PX = 24;
export const PROFILE_MOBILE_TAB_SHEET_PANEL_TRANSITION_MS = 300;
export const PROFILE_MOBILE_TAB_SHEET_BACKDROP_TRANSITION_MS = 200;
export const PROFILE_MOBILE_TAB_SHEET_DISMISS_DRAG_THRESHOLD_PX = 120;

/** Match site mobile header/footer breakpoint (`max-lg` / `< 1024px`). */
export const PROFILE_MOBILE_LAYOUT_MAX_WIDTH_PX = 1023;
export const PROFILE_MOBILE_LAYOUT_MEDIA_QUERY = `(max-width: ${PROFILE_MOBILE_LAYOUT_MAX_WIDTH_PX}px)`;

/** Form tabs in bottom sheet — no clay card frame on mobile. */
export const PROFILE_MOBILE_FORM_SECTION_FRAMELESS_CLASS =
  'max-lg:!rounded-none max-lg:!bg-transparent max-lg:!p-0 max-lg:!shadow-none max-lg:!ring-0';

/** Dashboard sheet title on mobile — one step up from section title (`text-xl`). */
export const PROFILE_MOBILE_PAGE_TITLE_SIZE_CLASS = 'max-lg:text-2xl';

/** Order cards in mobile profile sheets — clay drop shadow. */
export const PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS = 'max-lg:shadow-[0_4px_24px_rgba(0,0,0,0.06)]';

export const PROFILE_MOBILE_EMAIL_COLOR = '#6b7280';

export const PROFILE_MOBILE_ASSETS = {
  chevronRight: '/assets/home/icon-chevron-right-pink.svg',
} as const;

export const PROFILE_MOBILE_ICON_THEMES = {
  pink: {
    background: '#fdeef2',
    foreground: BRAND_COLORS.pink,
  },
  yellow: {
    background: '#fef8e3',
    foreground: '#e8b84a',
  },
  blue: {
    background: '#e8f4fd',
    foreground: '#5281e1',
  },
} as const;

export type ProfileMobileIconTheme = keyof typeof PROFILE_MOBILE_ICON_THEMES;

export const PROFILE_MOBILE_TAB_ICON_THEME: Record<ProfileTab, ProfileMobileIconTheme> = {
  dashboard: 'pink',
  orders: 'yellow',
  personal: 'blue',
  addresses: 'pink',
  password: 'yellow',
  deleteAccount: 'blue',
};
