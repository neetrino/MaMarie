import {
  PROFILE_DESKTOP_CARD_CLASS,
  PROFILE_DESKTOP_CONTENT_GAP_PX,
  PROFILE_DESKTOP_DASHBOARD_CARD_CLASS,
  PROFILE_DESKTOP_HEADER_CARD_PADDING_BOTTOM_PX,
  PROFILE_DESKTOP_HEADER_CARD_PADDING_TOP_PX,
  PROFILE_DESKTOP_HEADER_CARD_PADDING_X_PX,
  PROFILE_DESKTOP_INNER_CARD_CLASS,
  PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS,
  PROFILE_DESKTOP_SHELL_PADDING_BOTTOM_PX,
  PROFILE_DESKTOP_SHELL_PADDING_TOP_PX,
  PROFILE_DESKTOP_SIDEBAR_WIDTH_PX,
  PROFILE_DESKTOP_STAT_CONFIG,
  PROFILE_DESKTOP_STAT_THEMES,
  type ProfileDesktopStatTheme,
} from './profile-desktop-page';
import {
  PROFILE_MOBILE_ICON_THEMES,
  type ProfileMobileIconTheme,
} from './profile-mobile-page';

export {
  PROFILE_DESKTOP_CARD_CLASS,
  PROFILE_DESKTOP_CONTENT_GAP_PX,
  PROFILE_DESKTOP_DASHBOARD_CARD_CLASS,
  PROFILE_DESKTOP_HEADER_CARD_PADDING_BOTTOM_PX,
  PROFILE_DESKTOP_HEADER_CARD_PADDING_TOP_PX,
  PROFILE_DESKTOP_HEADER_CARD_PADDING_X_PX,
  PROFILE_DESKTOP_INNER_CARD_CLASS,
  PROFILE_DESKTOP_PRIMARY_BUTTON_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_SPACING_CLASS,
  PROFILE_DESKTOP_SHELL_PADDING_BOTTOM_PX,
  PROFILE_DESKTOP_SHELL_PADDING_TOP_PX,
  PROFILE_DESKTOP_SIDEBAR_WIDTH_PX,
  PROFILE_DESKTOP_STAT_CONFIG,
  PROFILE_DESKTOP_STAT_THEMES,
  PROFILE_MOBILE_ICON_THEMES,
};

export type { ProfileDesktopStatTheme, ProfileMobileIconTheme };

/** Admin dashboard stat cards — maps API stat keys to profile clay themes. */
export const ADMIN_DASHBOARD_STAT_CONFIG: ReadonlyArray<{
  key: 'users' | 'products' | 'orders' | 'revenue';
  theme: ProfileDesktopStatTheme;
}> = [
  { key: 'users', theme: 'blue' },
  { key: 'products', theme: 'green' },
  { key: 'orders', theme: 'yellow' },
  { key: 'revenue', theme: 'pink' },
];

/** Tinted icon backgrounds for admin sidebar / drawer nav items. */
export const ADMIN_MENU_ICON_THEME: Record<string, ProfileMobileIconTheme> = {
  dashboard: 'pink',
  orders: 'yellow',
  products: 'blue',
  categories: 'pink',
  brands: 'yellow',
  attributes: 'blue',
  'quick-settings': 'yellow',
  coupons: 'pink',
  users: 'blue',
  analytics: 'pink',
  'price-filter-settings': 'yellow',
  delivery: 'blue',
  messages: 'pink',
  settings: 'yellow',
};

export const ADMIN_DESKTOP_CARD_CLASS = PROFILE_DESKTOP_CARD_CLASS;
