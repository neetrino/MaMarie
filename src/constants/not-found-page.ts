import { BRAND_COLORS } from './brand';
import { HERO_GENDER_BUTTON_BOYS_BG_COLOR } from './hero';
import {
  HOME_SECTION_CONTENT_MAX_WIDTH_PX,
  HOME_SECTION_PADDING_LEFT_PX,
  HOME_SECTION_PADDING_RIGHT_PX,
} from './home-sections';

/** Figma 404 page — clay illustration source dimensions. */
export const NOT_FOUND_ILLUSTRATION_WIDTH_PX = 1024;
export const NOT_FOUND_ILLUSTRATION_HEIGHT_PX = 557;
export const NOT_FOUND_ILLUSTRATION_MAX_WIDTH_PX = 560;

export const NOT_FOUND_SECTION_PADDING_TOP_PX = 24;
export const NOT_FOUND_SECTION_PADDING_BOTTOM_PX = 48;
export const NOT_FOUND_CONTENT_MAX_WIDTH_PX = HOME_SECTION_CONTENT_MAX_WIDTH_PX;
export const NOT_FOUND_CONTENT_PADDING_X_PX =
  HOME_SECTION_PADDING_LEFT_PX + HOME_SECTION_PADDING_RIGHT_PX;

export const NOT_FOUND_TITLE_FONT_SIZE_PX = 32;
export const NOT_FOUND_TITLE_LINE_HEIGHT = 1.2;
export const NOT_FOUND_TITLE_COLOR = '#1c1b1b';
export const NOT_FOUND_TITLE_TO_ACTIONS_GAP_PX = 32;

export const NOT_FOUND_ACTIONS_GAP_PX = 16;

export const NOT_FOUND_BUTTON_MIN_WIDTH_PX = 220;
export const NOT_FOUND_BUTTON_ICON_SIZE_PX = 20;
export const NOT_FOUND_BUTTON_ICON_GAP_PX = 10;

export const NOT_FOUND_HOME_BUTTON_BG = BRAND_COLORS.pink;
export const NOT_FOUND_SHOP_BUTTON_BG = HERO_GENDER_BUTTON_BOYS_BG_COLOR;

export const NOT_FOUND_ASSETS = {
  illustration: '/assets/not-found/404-illustration.png',
  iconCart: '/assets/brand/icon-cart.svg',
} as const;
