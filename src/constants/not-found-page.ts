import { BRAND_COLORS } from './brand';
import { ABOUT_US_ASSETS } from './about-us-section';
import { HERO_GENDER_BUTTON_BOYS_BG_COLOR, HERO_GENDER_BUTTONS_GAP_PX } from './hero';
import {
  HOME_SECTION_CONTENT_MAX_WIDTH_PX,
  HOME_SECTION_PADDING_LEFT_PX,
  HOME_SECTION_PADDING_RIGHT_PX,
} from './home-sections';

export const NOT_FOUND_ILLUSTRATION_WIDTH_PX = 930;
export const NOT_FOUND_ILLUSTRATION_HEIGHT_PX = 620;
export const NOT_FOUND_ILLUSTRATION_MAX_WIDTH_PX = 930;
/** Lift only the 404 art on desktop; mobile keeps art below the fixed navbar. */
export const NOT_FOUND_ILLUSTRATION_LIFT_PX = 48;
export const NOT_FOUND_MOBILE_ILLUSTRATION_LIFT_PX = 0;

export const NOT_FOUND_SECTION_PADDING_TOP_PX = 24;
export const NOT_FOUND_SECTION_PADDING_BOTTOM_PX = 48;
export const NOT_FOUND_CONTENT_MAX_WIDTH_PX = HOME_SECTION_CONTENT_MAX_WIDTH_PX;
export const NOT_FOUND_CONTENT_PADDING_X_PX =
  HOME_SECTION_PADDING_LEFT_PX + HOME_SECTION_PADDING_RIGHT_PX;

/** Figma `276:681` — title below illustration. */
export const NOT_FOUND_TITLE_FONT_SIZE_PX = 30;
export const NOT_FOUND_TITLE_LINE_HEIGHT = 1.1;
export const NOT_FOUND_TITLE_COLOR = BRAND_COLORS.pink;
export const NOT_FOUND_TITLE_TRACKING_PX = -0.45;
export const NOT_FOUND_ILLUSTRATION_TO_TITLE_GAP_PX = -66;
/** Lift only «Էջը չի գտնվել»; illustration and buttons stay put. */
export const NOT_FOUND_TITLE_LIFT_PX = 60;
export const NOT_FOUND_TITLE_TO_ACTIONS_GAP_PX = 16;

/** Mobile 404 — title + CTAs below illustration (no overlap with fixed navbar). */
export const NOT_FOUND_MOBILE_COPY_BLOCK_OFFSET_PX = 16;
export const NOT_FOUND_MOBILE_ILLUSTRATION_TO_TITLE_GAP_PX = 20;
export const NOT_FOUND_MOBILE_TITLE_LIFT_PX = 0;
export const NOT_FOUND_MOBILE_TITLE_TO_ACTIONS_GAP_PX = 32;

export const NOT_FOUND_ACTIONS_GAP_PX = HERO_GENDER_BUTTONS_GAP_PX;

export const NOT_FOUND_BUTTON_ICON_SIZE_PX = 20;
export const NOT_FOUND_BUTTON_ICON_GAP_PX = 10;

export const NOT_FOUND_HOME_BUTTON_BG = BRAND_COLORS.pink;
export const NOT_FOUND_SHOP_BUTTON_BG = HERO_GENDER_BUTTON_BOYS_BG_COLOR;

/** Figma `276:677` — right decoration on illustration. */
export const NOT_FOUND_DECO_RIGHT_WIDTH_PERCENT = 13.44;
export const NOT_FOUND_DECO_RIGHT_LEFT_PERCENT = 62.07;
export const NOT_FOUND_DECO_RIGHT_TOP_PERCENT = 0.36;
export const NOT_FOUND_DECO_RIGHT_ROTATE_DEG = -1.13;

/** Homepage about-us bunny — reused on 404 green «4». */
export const NOT_FOUND_DECO_BUNNY_SIZE_PX = 156;
export const NOT_FOUND_MOBILE_DECO_BUNNY_SIZE_PX = 100;
export const NOT_FOUND_MOBILE_DECO_BUNNY_OFFSET_X_PX = -20;
export const NOT_FOUND_DECO_BUNNY_LEFT_PERCENT = 2;
export const NOT_FOUND_MOBILE_DECO_BUNNY_LEFT_PERCENT = 0;
export const NOT_FOUND_DECO_BUNNY_TOP_PERCENT = 28;
export const NOT_FOUND_MOBILE_DECO_BUNNY_TOP_PERCENT = 21;
export const NOT_FOUND_DECO_BUNNY_ROTATE_DEG = -168.97;
export const NOT_FOUND_DECO_BUNNY_FLIP_X = false;
export const NOT_FOUND_DECO_BUNNY_FLIP_Y = true;

export const NOT_FOUND_ASSETS = {
  illustration: '/assets/not-found/404-illustration.png',
  decoBunny: ABOUT_US_ASSETS.decoBunny,
  decoRight: '/assets/not-found/deco-right.png',
  iconCart: '/assets/brand/icon-cart.svg',
} as const;
