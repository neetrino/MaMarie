import { BRAND_COLORS } from './brand';
import type { ProfileTab } from '../app/profile/types';
import {
  PROFILE_MOBILE_ICON_THEMES,
  PROFILE_MOBILE_TAB_ICON_THEME,
  type ProfileMobileIconTheme,
} from './profile-mobile-page';

/** Desktop profile — clay dashboard (Figma). */
export const PROFILE_DESKTOP_PAGE_BG = '#faf8f5';
export const PROFILE_DESKTOP_CARD_RADIUS_PX = 15;
export const PROFILE_DESKTOP_CARD_SHADOW = '0 4px 24px rgba(0, 0, 0, 0.06)';
export const PROFILE_DESKTOP_SIDEBAR_WIDTH_PX = 280;
export const PROFILE_DESKTOP_SHELL_PADDING_TOP_PX = 12;
export const PROFILE_DESKTOP_SHELL_PADDING_BOTTOM_PX = 20;
export const PROFILE_DESKTOP_CONTENT_GAP_PX = 40;

export const PROFILE_DESKTOP_CARD_BASE_CLASS = '!rounded-[15px] bg-white ring-1 ring-gray-100/80';

export const PROFILE_DESKTOP_CARD_CLASS = `${PROFILE_DESKTOP_CARD_BASE_CLASS} shadow-[0_4px_24px_rgba(0,0,0,0.06)]`;

/** Dashboard stat panels and sections — flat clay, no drop shadow. */
export const PROFILE_DESKTOP_DASHBOARD_CARD_CLASS = PROFILE_DESKTOP_CARD_BASE_CLASS;

export const PROFILE_DESKTOP_DASHBOARD_SECTION_CARD_CLASS = '!shadow-none';

export const PROFILE_DESKTOP_ASSETS = {
  chevronRight: '/assets/home/icon-chevron-right-pink.svg',
  decoBow: '/assets/home/about-us/deco-bow.png',
  decoHeadphones: '/assets/home/about-us/deco-headphones.png',
  /** Misnamed in about-us — actually the strawberry illustration. */
  decoStrawberry: '/assets/home/about-us/deco-star.png',
  decoStar: '/assets/footer/deco-star.png',
  /** Figma `66:457` — pink arrow in white circle on order view-details CTA. */
  orderViewDetailsArrow: '/assets/cart/empty-cta-arrow.svg',
} as const;

export const PROFILE_DESKTOP_STAT_ICON_INNER_DEFAULT_CLASS =
  '[&>svg]:block [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0';
export const PROFILE_DESKTOP_STAT_ICON_INNER_LARGE_CLASS =
  '[&>svg]:block [&>svg]:h-7 [&>svg]:w-7 [&>svg]:shrink-0 [&>svg]:translate-y-0.5';

export const PROFILE_DESKTOP_STAT_THEMES = {
  pink: {
    iconBackground: '#fdeef2',
    iconForeground: BRAND_COLORS.pink,
    valueColor: BRAND_COLORS.pink,
    decoration: PROFILE_DESKTOP_ASSETS.decoBow,
    iconInnerClass: PROFILE_DESKTOP_STAT_ICON_INNER_DEFAULT_CLASS,
  },
  yellow: {
    iconBackground: '#fef8e3',
    iconForeground: '#e8b84a',
    valueColor: '#d4a017',
    decoration: PROFILE_DESKTOP_ASSETS.decoStrawberry,
    iconInnerClass: PROFILE_DESKTOP_STAT_ICON_INNER_DEFAULT_CLASS,
  },
  blue: {
    iconBackground: '#e8f4fd',
    iconForeground: '#5281e1',
    valueColor: '#5281e1',
    decoration: PROFILE_DESKTOP_ASSETS.decoHeadphones,
    iconInnerClass: PROFILE_DESKTOP_STAT_ICON_INNER_DEFAULT_CLASS,
  },
  green: {
    iconBackground: '#e8f8ef',
    iconForeground: '#5cb176',
    valueColor: '#5cb176',
    decoration: PROFILE_DESKTOP_ASSETS.decoStar,
    iconInnerClass: PROFILE_DESKTOP_STAT_ICON_INNER_LARGE_CLASS,
  },
} as const;

export type ProfileDesktopStatTheme = keyof typeof PROFILE_DESKTOP_STAT_THEMES;

export const PROFILE_DESKTOP_STAT_CONFIG: ReadonlyArray<{
  key: 'totalOrders' | 'totalSpent' | 'pendingOrders' | 'savedAddresses';
  theme: ProfileDesktopStatTheme;
}> = [
  { key: 'totalOrders', theme: 'pink' },
  { key: 'totalSpent', theme: 'yellow' },
  { key: 'pendingOrders', theme: 'blue' },
  { key: 'savedAddresses', theme: 'green' },
];

export { PROFILE_MOBILE_ICON_THEMES, PROFILE_MOBILE_TAB_ICON_THEME };
export type { ProfileMobileIconTheme };

export const PROFILE_DESKTOP_TAB_ICON_THEME: Record<ProfileTab, ProfileMobileIconTheme> =
  PROFILE_MOBILE_TAB_ICON_THEME;

export const PROFILE_DESKTOP_PENDING_BADGE_CLASS =
  'inline-flex rounded-full bg-[#fef8e3] px-3 py-1 text-xs font-medium capitalize text-[#57423b]';

export const PROFILE_DESKTOP_SECTION_TITLE_CLASS = 'text-xl font-bold text-brand-pink';

/** Space between section title row and form/content below (+3px vs previous mb-6/mb-8). */
export const PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS = 'mb-[27px] sm:mb-[35px]';

/** Space between block above and form fields (+3px vs previous mb-8/mb-10). */
export const PROFILE_DESKTOP_SECTION_TO_FORM_SPACING_CLASS = 'mb-[35px] sm:mb-[43px]';

export const PROFILE_DESKTOP_ORDERS_PAGE_TITLE_CLASS = 'text-2xl font-bold text-brand-pink';

export const PROFILE_DESKTOP_INNER_CARD_CLASS =
  '!rounded-[15px] border border-gray-100 bg-[#fcfcfc] transition hover:border-brand-pink/20 hover:bg-white';

export const PROFILE_DESKTOP_ORDER_CARD_CLASS =
  '!rounded-[15px] border border-gray-100 bg-white no-underline transition-transform duration-200 ease-out hover:-translate-y-1 hover:no-underline motion-reduce:transition-none motion-reduce:hover:translate-y-0';

export const PROFILE_DESKTOP_ORDER_CARD_SEPARATOR_CLASS = 'my-4 border-t border-dashed border-gray-200';

export const PROFILE_DESKTOP_ORDER_CARD_GRID_CLASS =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3';

/** Figma `66:454` — compact order card view-details pill CTA. */
export const PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_HEIGHT_PX = 36;
export const PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ICON_SIZE_PX = 28;
export const PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ARROW_SIZE_PX = 14;
export const PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_ICON_OFFSET_X_PX = 3;
export const PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_FONT_SIZE_PX = 12;

export const PROFILE_DESKTOP_ORDER_VIEW_DETAILS_CTA_CLASS =
  'flex w-full items-center justify-between rounded-full bg-brand-pink py-0.5 pl-4 pr-0.5 text-xs font-medium text-white';

export const PROFILE_DESKTOP_INPUT_CLASS = '!rounded-[15px]';

export const PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS =
  'profile-btn-primary inline-flex h-11 items-center justify-center px-6 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50';

export const PROFILE_DESKTOP_OUTLINE_BUTTON_CLASS =
  'profile-btn-outline inline-flex h-11 items-center justify-center px-6 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export const PROFILE_DESKTOP_DANGER_BUTTON_CLASS =
  'profile-btn-primary profile-btn-danger inline-flex h-11 items-center justify-center px-6 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50';

export const PROFILE_DESKTOP_ALERT_ERROR_CLASS =
  'rounded-[15px] border border-red-200 bg-red-50 p-4 text-sm text-red-600';

export const PROFILE_DESKTOP_ALERT_SUCCESS_CLASS =
  'rounded-[15px] border border-green-200 bg-green-50 p-4 text-sm text-green-600';

export const PROFILE_DESKTOP_DEFAULT_BADGE_CLASS =
  'inline-flex rounded-full bg-[#e8f4fd] px-3 py-1 text-xs font-medium text-[#5281e1]';

/** Profile side sheets — cart-style drawer from the right, half screen width. */
export const PROFILE_SIDE_SHEET_WIDTH_PERCENT = 50;
export const PROFILE_SIDE_SHEET_Z_INDEX = 95;
export const PROFILE_SIDE_SHEET_PANEL_TRANSITION_MS = 300;
export const PROFILE_SIDE_SHEET_BACKDROP_TRANSITION_MS = 200;
export const PROFILE_SIDE_SHEET_PANEL_Z_INDEX = 2;
export const PROFILE_SIDE_SHEET_RADIUS_PX = 24;
