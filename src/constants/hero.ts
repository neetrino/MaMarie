import { BRAND_COLORS } from './brand';
import { HOME_SECTION_CONTENT_MAX_WIDTH_PX } from './home-sections';

/** Figma hero artboard — frame `9:590` (1440×853). */
export const HERO_DESIGN_WIDTH_PX = 1440;
export const HERO_DESIGN_HEIGHT_PX = 853;

/** Hero canvas matches homepage content column (`HOME_SECTION_CONTENT_MAX_WIDTH_PX`). */
export const HERO_CANVAS_MAX_WIDTH_PX = HOME_SECTION_CONTENT_MAX_WIDTH_PX;
export const HERO_CANVAS_MAX_HEIGHT_PX = Math.round(
  HERO_CANVAS_MAX_WIDTH_PX * (HERO_DESIGN_HEIGHT_PX / HERO_DESIGN_WIDTH_PX),
);
export const HERO_CANVAS_MIN_HEIGHT_PX = Math.round(520 * (HERO_CANVAS_MAX_WIDTH_PX / HERO_DESIGN_WIDTH_PX));

/** Match navbar horizontal inset (header only — hero canvas is full 1440). */
export const HERO_PADDING_LEFT_PX = 87;
export const HERO_PADDING_RIGHT_PX = 93;

/** Nudge entire hero section down. */
export const HERO_SECTION_OFFSET_Y_PX = 32;

/** @deprecated Use `HERO_CANVAS_MAX_WIDTH_PX` — kept for layer math compatibility. */
export const HERO_CONTENT_SCALE = HERO_CANVAS_MAX_WIDTH_PX / HERO_DESIGN_WIDTH_PX;

export const HERO_CONTENT_MAX_WIDTH_PX = HERO_CANVAS_MAX_WIDTH_PX;
export const HERO_CONTENT_MAX_HEIGHT_PX = HERO_CANVAS_MAX_HEIGHT_PX;
export const HERO_CONTENT_MIN_HEIGHT_PX = HERO_CANVAS_MIN_HEIGHT_PX;

export const HERO_ASSETS = {
  shapeTextArc: '/assets/hero/shape-text-arc.png',
  layerLeft: '/assets/hero/hero-layer-left.png',
  layerCenter: '/assets/hero/hero-layer-center.png',
  layerRight: '/assets/hero/hero-layer-right.png',
  decorationCameraLarge: '/assets/hero/decoration-camera-large.png',
  /** Clay bunny — exported as `decoration-camera-mid.png`. */
  decorationBunny: '/assets/hero/decoration-camera-mid.png',
  /** Clay melody notes — exported as `decoration-camera-small.png`. */
  musicNotes: '/assets/hero/decoration-camera-small.png',
} as const;

export interface HeroImageCrop {
  widthPercent: number;
  heightPercent: number;
  leftPercent: number;
  topPercent: number;
}

export interface HeroLayerPlacement {
  assetKey: keyof typeof HERO_ASSETS;
  leftPx: number;
  topPx: number;
  widthPx: number;
  heightPx: number;
  zIndex: number;
  objectFit?: 'cover' | 'contain';
  crop?: HeroImageCrop;
  flip?: boolean;
  offsetYPx?: number;
  offsetXPx?: number;
  scale?: number;
  scaleOrigin?: string;
}

/** Shared kid photo frame — girl (68:2329) and boy (68:2328). */
export const HERO_KID_PHOTO_WIDTH_PX = 490;
export const HERO_KID_PHOTO_HEIGHT_PX = 696;

/** Extra scale — boy PNG has more padding than girl. */
export const HERO_LAYER_RIGHT_SCALE = 1.38;

/** Nudge boy down. */
export const HERO_LAYER_RIGHT_OFFSET_Y_PX = 140;

/** Nudge boy left. */
export const HERO_LAYER_RIGHT_OFFSET_X_PX = -50;

/** Photo collage layers — paint order back → front (Figma frame `9:590`). */
export const HERO_PHOTO_LAYERS: HeroLayerPlacement[] = [
  {
    /** Figma `af0b019…` — girl (68:2329). */
    assetKey: 'layerCenter',
    leftPx: 584,
    topPx: 157,
    widthPx: HERO_KID_PHOTO_WIDTH_PX,
    heightPx: HERO_KID_PHOTO_HEIGHT_PX,
    zIndex: 2,
  },
  {
    /** Figma `chatgptImageJun102026At` — boy (68:2328), matched visually to girl. */
    assetKey: 'layerRight',
    leftPx: 377,
    topPx: 204,
    widthPx: HERO_KID_PHOTO_WIDTH_PX,
    heightPx: HERO_KID_PHOTO_HEIGHT_PX,
    zIndex: 3,
    offsetXPx: HERO_LAYER_RIGHT_OFFSET_X_PX,
    offsetYPx: HERO_LAYER_RIGHT_OFFSET_Y_PX,
    flip: true,
    scale: HERO_LAYER_RIGHT_SCALE,
    scaleOrigin: 'center bottom',
    crop: {
      widthPercent: 118,
      heightPercent: 118,
      leftPercent: -9,
      topPercent: -14,
    },
  },
  {
    /** Figma `chatgptImageJun102026At3` — boy + left «SHAPE» wing (68:2331). */
    assetKey: 'layerLeft',
    leftPx: 102,
    topPx: 249,
    widthPx: 721,
    heightPx: 655,
    zIndex: 5,
  },
];

export interface HeroDecorationPlacement {
  assetKey: keyof typeof HERO_ASSETS;
  leftPx: number;
  topPx: number;
  widthPx: number;
  heightPx: number;
  rotateDeg?: number;
  flipX?: boolean;
  flipY?: boolean;
  zIndex: number;
}

/** Bunny decoration — Figma `camera101` base size was 158px. */
export const HERO_BUNNY_FIGMA_SIZE_PX = 158;
export const HERO_BUNNY_SIZE_PX = 120;
export const HERO_BUNNY_ROTATE_DEG = 380;
export const HERO_BUNNY_OFFSET_X_PX = -14;
export const HERO_BUNNY_OFFSET_Y_PX = -14;

/** Clay star — Figma `camera51` base size was 375.2px. */
export const HERO_STAR_FIGMA_SIZE_PX = 375.2;
export const HERO_STAR_SIZE_PX = 330;
export const HERO_STAR_ROTATE_DEG = 310;

/** Melody notes rotation — Figma `camera91`. */
export const HERO_MELODY_ROTATE_DEG = 50;

/** Nudge melody notes up. */
export const HERO_MELODY_OFFSET_Y_PX = -24;

/** Hero section sits below fixed header (z-50) and must not paint over page content. */
export const HERO_SECTION_Z_INDEX = 0;

/** Local paint order inside hero canvas only (never use global values like 50+). */
export const HERO_DECORATION_BACK_Z_INDEX = 1;
export const HERO_DECORATION_FRONT_Z_INDEX = 6;
export const HERO_ARC_Z_INDEX = 4;
export const HERO_CTA_Z_INDEX = 7;

/** Clay decorations — Figma `camera51`, `camera91`, `camera101`. */
export const HERO_DECORATIONS: HeroDecorationPlacement[] = [
  {
    /** Clay star — Figma `camera51`. */
    assetKey: 'decorationCameraLarge',
    leftPx: 1032.64 + (HERO_STAR_FIGMA_SIZE_PX - HERO_STAR_SIZE_PX) / 2,
    topPx: 13.64 + (HERO_STAR_FIGMA_SIZE_PX - HERO_STAR_SIZE_PX) / 2,
    widthPx: HERO_STAR_SIZE_PX,
    heightPx: HERO_STAR_SIZE_PX,
    rotateDeg: HERO_STAR_ROTATE_DEG,
    zIndex: HERO_DECORATION_BACK_Z_INDEX,
  },
  {
    /** Melody notes — Figma `camera91` slot. */
    assetKey: 'musicNotes',
    leftPx: 211,
    topPx: 150 + HERO_MELODY_OFFSET_Y_PX,
    widthPx: 173.8,
    heightPx: 173.8,
    rotateDeg: HERO_MELODY_ROTATE_DEG,
    zIndex: HERO_DECORATION_BACK_Z_INDEX,
  },
  {
    /** Bunny — Figma `camera101` slot. */
    assetKey: 'decorationBunny',
    leftPx: 646 + (HERO_BUNNY_FIGMA_SIZE_PX - HERO_BUNNY_SIZE_PX) / 2 + HERO_BUNNY_OFFSET_X_PX,
    topPx: 237 + (HERO_BUNNY_FIGMA_SIZE_PX - HERO_BUNNY_SIZE_PX) / 2 + HERO_BUNNY_OFFSET_Y_PX,
    widthPx: HERO_BUNNY_SIZE_PX,
    heightPx: HERO_BUNNY_SIZE_PX,
    rotateDeg: HERO_BUNNY_ROTATE_DEG,
    flipX: true,
    zIndex: HERO_DECORATION_FRONT_Z_INDEX,
  },
];

/** Arc sits between center/right photos and left wing — Figma paint order. */

/** Arc headline — Figma `chatgptImageJun102026At2` (77:2826). */
export const HERO_ARC_PLACEMENT = {
  leftPx: 629,
  topPx: 55,
  widthPx: 628,
  heightPx: 590,
} as const;

/** Fine-tune right arc — «YOUR CHILDHOOD». */
export const HERO_ARC_OFFSET_X_PX = -20;

/** Figma node `1:59` / `.button4` — frosted carousel pill (bottom of hero). */
export const HERO_BOTTOM_PILL_WIDTH_PX = 401;
export const HERO_BOTTOM_PILL_HEIGHT_PX = 64;
export const HERO_BOTTOM_PILL_BG_COLOR = 'rgba(255, 255, 255, 0.38)';
export const HERO_BOTTOM_PILL_BACKDROP_BLUR_PX = 8;
export const HERO_BOTTOM_PILL_FONT_SIZE_PX = 16;
export const HERO_BOTTOM_PILL_LINE_HEIGHT_PX = 28;
export const HERO_BOTTOM_PILL_TEXT_COLOR = '#ffffff';
export const HERO_BOTTOM_PILL_PRIMARY_BG_COLOR = BRAND_COLORS.pink;
export const HERO_BOTTOM_PILL_PRIMARY_INSET_SHADOW =
  'inset 0px -4px 8px 0px rgba(0, 0, 0, 0.27), inset 0px 4px 4px 0px rgba(255, 255, 255, 0.4), inset 0px 20px 40px -10px rgba(164, 60, 18, 0.2)';
export const HERO_BOTTOM_PILL_ACTIVE_TOP_PX = 7;
export const HERO_BOTTOM_PILL_INNER_ACTIVE_WIDTH_PX = 152;
export const HERO_BOTTOM_PILL_INNER_ACTIVE_HEIGHT_PX = 50;
export const HERO_BOTTOM_PILL_INDICATOR_INSET_X_PX = 11;
export const HERO_BOTTOM_PILL_SLIDE_MS = 300;
export const HERO_BOTTOM_PILL_TAB_COUNT = 3;
export const HERO_BOTTOM_PILL_TAB_WIDTH_PX = HERO_BOTTOM_PILL_WIDTH_PX / HERO_BOTTOM_PILL_TAB_COUNT;

export const HERO_BOTTOM_PILL_TAB_KEYS = [
  'home.hero.bottomPill.tab1',
  'home.hero.bottomPill.tab2',
  'home.hero.bottomPill.tab3',
] as const;

/** Sliding pink indicator position for the active tab. */
export function getHeroBottomPillIndicator(activeIndex: number): { leftPx: number; widthPx: number } {
  const tabWidthPx = HERO_BOTTOM_PILL_TAB_WIDTH_PX;
  const maxWidthPx = tabWidthPx - HERO_BOTTOM_PILL_INDICATOR_INSET_X_PX * 2;
  const widthPx = Math.min(HERO_BOTTOM_PILL_INNER_ACTIVE_WIDTH_PX, Math.max(maxWidthPx, 0));
  const leftPx = activeIndex * tabWidthPx + (tabWidthPx - widthPx) / 2;

  return { leftPx, widthPx };
}

/** Bottom pill placement — Figma `.button4`. */
export const HERO_BOTTOM_PILL_PLACEMENT = {
  leftPx: 516,
  topPx: 743,
  widthPx: HERO_BOTTOM_PILL_WIDTH_PX,
  heightPx: HERO_BOTTOM_PILL_HEIGHT_PX,
} as const;

export function heroPctX(px: number): string {
  return `${(px / HERO_DESIGN_WIDTH_PX) * 100}%`;
}

export function heroPctY(px: number): string {
  return `${(px / HERO_DESIGN_HEIGHT_PX) * 100}%`;
}

export function heroPctW(px: number): string {
  return `${(px / HERO_DESIGN_WIDTH_PX) * 100}%`;
}

export function heroPctH(px: number): string {
  return `${(px / HERO_DESIGN_HEIGHT_PX) * 100}%`;
}
