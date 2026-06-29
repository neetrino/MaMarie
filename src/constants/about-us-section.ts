import { FOOTER_TOP_GAP_PX } from './footer';
import {
  HOME_SECTION_CONTENT_MAX_WIDTH_PX,
  HOME_SECTION_PADDING_LEFT_PX,
  HOME_SECTION_PADDING_RIGHT_PX,
  HOME_SECTION_STACK_GAP_PX,
} from './home-sections';

/** Figma node `51:408` — About us section. */
export const ABOUT_US_SECTION_BG = '#ffffff';
/** Above footer (`z-20`) so large decorations can overlap the gap. */
export const ABOUT_US_SECTION_Z_INDEX = 25;
/** Large bow (`51:422`) — foreground over cards and footer edge. */
export const ABOUT_US_FOREGROUND_DECORATION_Z_INDEX = 30;
/** White space after «Ինչու Մենք» — extra room above About Us content; photo may extend into it. */
export const ABOUT_US_AFTER_WHY_US_GAP_PX = 160;
export const ABOUT_US_SECTION_OFFSET_TOP_PX = ABOUT_US_AFTER_WHY_US_GAP_PX;
export const ABOUT_US_SECTION_MIN_HEIGHT_PX = 939 + (ABOUT_US_AFTER_WHY_US_GAP_PX - HOME_SECTION_STACK_GAP_PX);
export const ABOUT_US_SECTION_PADDING_TOP_PX = 84;
/** Extends white section bg into the footer gap so clay can overlap without clipping. */
export const ABOUT_US_SECTION_PADDING_BOTTOM_PX = 223 + FOOTER_TOP_GAP_PX;
/** Cards + decoration icons — shifted up without moving the section photo. */
export const ABOUT_US_CONTENT_SHIFT_UP_PX = 90;
/** Side-card clay (`decoBunny` top −63) — extra room above card row without shifting Figma card positions. */
export const ABOUT_US_CARD_DECORATION_OVERFLOW_TOP_PX = 123;
/** Yellow card carrot (`51:427`) — lifted under `closingText`. */
export const ABOUT_US_YELLOW_CARD_CARROT_TOP_PX = 149;

export const ABOUT_US_CONTENT_OFFSET_LEFT_PX =
  463 - HOME_SECTION_PADDING_LEFT_PX;
export const ABOUT_US_CONTENT_GAP_PX = 42;

export const ABOUT_US_CARD_LEFT_WIDTH_PX = 365;
export const ABOUT_US_CARD_LEFT_TEXT_WIDTH_PX = 304;
export const ABOUT_US_CARD_WHITE_BG = '#ffffff';
export const ABOUT_US_CARD_RADIUS_PX = 40;
export const ABOUT_US_CARD_PADDING_X_PX = 32;
export const ABOUT_US_CARD_PADDING_Y_PX = 39;
export const ABOUT_US_CARD_WHITE_SHADOW =
  '0px 4px 4.5px rgba(0, 0, 0, 0.03)';

export const ABOUT_US_CARD_YELLOW_WIDTH_PX = 323;
export const ABOUT_US_CARD_YELLOW_BG = '#f9e490';
export const ABOUT_US_CARD_YELLOW_LEFT_PX = 1026 - HOME_SECTION_PADDING_LEFT_PX;
export const ABOUT_US_CARD_YELLOW_TOP_PX = 538 - ABOUT_US_SECTION_PADDING_TOP_PX;
export const ABOUT_US_BLOCK_MIN_HEIGHT_PX = 632;

export const ABOUT_US_STORY_CARD_WIDTH_PX = 518;
export const ABOUT_US_STORY_CARD_HEIGHT_PX = 237;
export const ABOUT_US_STORY_CARD_BG = '#e3f1ff';
export const ABOUT_US_STORY_CARD_PADDING_X_PX = 47;
export const ABOUT_US_STORY_CARD_TOP_PX = 106;

export const ABOUT_US_RIGHT_COLUMN_WIDTH_PX = 640.6;
export const ABOUT_US_RIGHT_COLUMN_HEIGHT_PX = 407.76;

export const ABOUT_US_TEXT_COLOR = '#57423b';
export const ABOUT_US_TEXT_SIZE_PX = 14;
export const ABOUT_US_TEXT_LINE_HEIGHT_PX = 20;
export const ABOUT_US_STORY_TEXT_LINE_HEIGHT_PX = 23;
export const ABOUT_US_STORY_TEXT_TRACKING_PX = -0.3;
export const ABOUT_US_STORY_TEXT_WIDTH_PX = 413;
export const ABOUT_US_STORY_LOGO_TEXT_OFFSET_TOP_PX = 21.45;

export const ABOUT_US_LOGO_WIDTH_PX = 94;
export const ABOUT_US_LOGO_HEIGHT_PX = 50;
export const ABOUT_US_LOGO_CROP_HEIGHT_PERCENT = 207.48;
export const ABOUT_US_LOGO_CROP_WIDTH_PERCENT = 112.61;
export const ABOUT_US_LOGO_CROP_LEFT_PERCENT = -7.56;
export const ABOUT_US_LOGO_CROP_TOP_PERCENT = -53.74;

export interface AboutUsDecorationLayout {
  leftPx: number;
  topPx: number;
  wrapperSizePx: number;
  imageSizePx: number;
  rotateDeg?: number;
  flipX?: boolean;
  flipY?: boolean;
  zIndex?: number;
}

export const ABOUT_US_ASSETS = {
  sectionPhoto: '/assets/home/about-us/section-photo.png',
  logoInline: '/assets/home/about-us/logo-inline.png',
  decoBunny: '/assets/home/about-us/deco-bunny.png',
  decoShoes: '/assets/home/about-us/deco-shoes.png',
  decoHeadphones: '/assets/home/about-us/deco-headphones.png',
  decoStar: '/assets/home/about-us/deco-star.png',
  decoBow: '/assets/home/about-us/deco-bow.png',
} as const;

const ABOUT_US_SIDE_CARD_BUNNY_DECORATION: AboutUsDecorationLayout & {
  imageSrc: string;
} = {
  leftPx: 104,
  topPx: -63,
  wrapperSizePx: 122.073,
  imageSizePx: 104.088,
  rotateDeg: -168.97,
  flipX: true,
  flipY: true,
  imageSrc: ABOUT_US_ASSETS.decoBunny,
};

const ABOUT_US_SIDE_CARD_CARROT_DECORATION: AboutUsDecorationLayout & {
  imageSrc: string;
} = {
  leftPx: 16,
  topPx: 164,
  wrapperSizePx: 88,
  imageSizePx: 88,
  imageSrc: ABOUT_US_ASSETS.decoShoes,
};

export const ABOUT_US_SIDE_CARD_DECORATIONS: Array<
  AboutUsDecorationLayout & { imageSrc: string }
> = [ABOUT_US_SIDE_CARD_BUNNY_DECORATION, ABOUT_US_SIDE_CARD_CARROT_DECORATION];

export const ABOUT_US_YELLOW_CARD_DECORATIONS: Array<
  AboutUsDecorationLayout & { imageSrc: string }
> = [
  ABOUT_US_SIDE_CARD_BUNNY_DECORATION,
  {
    ...ABOUT_US_SIDE_CARD_CARROT_DECORATION,
    topPx: ABOUT_US_YELLOW_CARD_CARROT_TOP_PX,
  },
];

/** Bow / bird (`51:422`) — tilt reduced so beak points at story copy below. */
export const ABOUT_US_STORY_BOW_ROTATE_DEG = 248;

export const ABOUT_US_STORY_DECORATIONS: Array<
  AboutUsDecorationLayout & { imageSrc: string }
> = [
  {
    leftPx: 47,
    topPx: 256.99,
    wrapperSizePx: 150.771,
    imageSizePx: 107.701,
    rotateDeg: 53.16,
    imageSrc: ABOUT_US_ASSETS.decoHeadphones,
  },
  {
    leftPx: 291.27,
    topPx: 0,
    wrapperSizePx: 207.282,
    imageSizePx: 161.045,
    rotateDeg: ABOUT_US_STORY_BOW_ROTATE_DEG,
    flipY: true,
    zIndex: ABOUT_US_FOREGROUND_DECORATION_Z_INDEX,
    imageSrc: ABOUT_US_ASSETS.decoBow,
  },
  {
    leftPx: 443,
    topPx: 83,
    wrapperSizePx: 179.47,
    imageSizePx: 135.764,
    rotateDeg: -24.19,
    imageSrc: ABOUT_US_ASSETS.decoStar,
  },
];

export const ABOUT_US_BG_WRAPPER_LEFT_PX = -353;
/** Raised above Figma `-261` so the photo sits higher in the section. */
export const ABOUT_US_BG_WRAPPER_TOP_PX = -360;
export const ABOUT_US_BG_WRAPPER_WIDTH_PX = 1434.877;
export const ABOUT_US_BG_WRAPPER_HEIGHT_PX = 1490.623;
export const ABOUT_US_BG_ROTATE_DEG = 142.7;
export const ABOUT_US_BG_IMAGE_WIDTH_PX = 896.628;
export const ABOUT_US_BG_IMAGE_HEIGHT_PX = 1190.834;

export const ABOUT_US_SHELL_PADDING_LEFT_PX = HOME_SECTION_PADDING_LEFT_PX;
export const ABOUT_US_SHELL_PADDING_RIGHT_PX = HOME_SECTION_PADDING_RIGHT_PX;
export const ABOUT_US_CONTENT_MAX_WIDTH_PX = HOME_SECTION_CONTENT_MAX_WIDTH_PX;
