import {
  HOME_SECTION_CONTENT_MAX_WIDTH_PX,
  HOME_SECTION_PADDING_LEFT_PX,
  HOME_SECTION_PADDING_RIGHT_PX,
} from './home-sections';

/** Pull section up so background sits flush under Why Us cards (Figma y=2711). */
export const ABOUT_US_SECTION_OFFSET_TOP_PX = 0;
export const ABOUT_US_SECTION_MIN_HEIGHT_PX = 810;
export const ABOUT_US_SECTION_PADDING_TOP_PX = 52;
export const ABOUT_US_SECTION_PADDING_BOTTOM_PX = 269;

export const ABOUT_US_CONTENT_GAP_PX = 42;

export const ABOUT_US_CARD_SMALL_WIDTH_PX = 323;
export const ABOUT_US_CARD_SMALL_RADIUS_PX = 40;
export const ABOUT_US_CARD_SMALL_PADDING_X_PX = 32;
export const ABOUT_US_CARD_SMALL_PADDING_Y_PX = 39;

export const ABOUT_US_CARD_LARGE_WIDTH_PX = 515;
export const ABOUT_US_CARD_LARGE_HEIGHT_PX = 298;
export const ABOUT_US_CARD_LARGE_RADIUS_PX = 40;
export const ABOUT_US_CARD_LARGE_PADDING_X_PX = 42;
export const ABOUT_US_CARD_LARGE_PADDING_Y_PX = 48;
export const ABOUT_US_LARGE_CARD_LOGO_OFFSET_TOP_PX = -12;

export const ABOUT_US_RIGHT_COLUMN_WIDTH_PX = 640.6;
export const ABOUT_US_RIGHT_COLUMN_HEIGHT_PX = 488.77;
export const ABOUT_US_RIGHT_CARD_TOP_PX = 117;

export const ABOUT_US_TEXT_COLOR = '#57423b';
export const ABOUT_US_TEXT_SIZE_PX = 14;
export const ABOUT_US_TEXT_LINE_HEIGHT_PX = 20;
export const ABOUT_US_LARGE_CARD_TEXT_SIZE_PX = 15;
export const ABOUT_US_TEXT_LINE_HEIGHT_LARGE_PX = 24;
export const ABOUT_US_TEXT_TRACKING_LARGE_PX = -0.3;

export const ABOUT_US_LOGO_WIDTH_PX = 94;
export const ABOUT_US_LOGO_HEIGHT_PX = 50;
export const ABOUT_US_SMALL_CARD_LOGO_WIDTH_PX = 106;
export const ABOUT_US_SMALL_CARD_LOGO_HEIGHT_PX = 50;
export const ABOUT_US_SMALL_CARD_LOGO_OFFSET_TOP_PX = -10;
export const ABOUT_US_CARD_LOGO_TEXT_GAP_PX = 4;

export const ABOUT_US_LOGO_CROP_HEIGHT_PERCENT = 207.48;
export const ABOUT_US_LOGO_CROP_WIDTH_PERCENT = 112.61;
export const ABOUT_US_LOGO_CROP_LEFT_PERCENT = -7.56;
export const ABOUT_US_LOGO_CROP_TOP_PERCENT = -53.74;

export interface AboutUsDecorationLayout {
  leftPx: number;
  topPx: number;
  sizePx: number;
  rotateDeg?: number;
  flipX?: boolean;
  flipY?: boolean;
}

export const ABOUT_US_ASSETS = {
  sectionBg: '/assets/home/about-us/section-bg.png',
  logoInline: '/assets/home/about-us/logo-inline.png',
  decoBunny: '/assets/home/about-us/deco-bunny.png',
  decoShoes: '/assets/home/about-us/deco-shoes.png',
  decoHeadphones: '/assets/home/about-us/deco-headphones.png',
  decoStar: '/assets/home/about-us/deco-star.png',
  decoBow: '/assets/home/about-us/deco-bow.png',
} as const;

export const ABOUT_US_SMALL_CARD_DECORATIONS: AboutUsDecorationLayout[] = [
  { leftPx: 132, topPx: -63, sizePx: 104, rotateDeg: -168.97, flipX: true, flipY: true },
  { leftPx: 16, topPx: 122, sizePx: 88 },
];

export const ABOUT_US_LARGE_DECORATIONS: Array<
  AboutUsDecorationLayout & { imageSrc: string }
> = [
  {
    leftPx: 55,
    topPx: 341,
    sizePx: 108,
    rotateDeg: 53.16,
    imageSrc: ABOUT_US_ASSETS.decoHeadphones,
  },
  {
    leftPx: 439,
    topPx: 55,
    sizePx: 153,
    rotateDeg: -66.47,
    imageSrc: ABOUT_US_ASSETS.decoStar,
  },
  {
    leftPx: 251,
    topPx: 14,
    sizePx: 181,
    rotateDeg: 260,
    flipY: true,
    imageSrc: ABOUT_US_ASSETS.decoBow,
  },
];

/** Content row width — fits `HOME_SECTION_CONTENT_MAX_WIDTH_PX`. */
export const ABOUT_US_CONTENT_ROW_WIDTH_PX =
  ABOUT_US_CARD_SMALL_WIDTH_PX +
  ABOUT_US_CONTENT_GAP_PX +
  ABOUT_US_RIGHT_COLUMN_WIDTH_PX;

export const ABOUT_US_SHELL_PADDING_LEFT_PX = HOME_SECTION_PADDING_LEFT_PX;
export const ABOUT_US_SHELL_PADDING_RIGHT_PX = HOME_SECTION_PADDING_RIGHT_PX;
export const ABOUT_US_CONTENT_MAX_WIDTH_PX = HOME_SECTION_CONTENT_MAX_WIDTH_PX;
