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
