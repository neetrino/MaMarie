import { BRAND_COLORS } from './brand';
import { HOME_SECTION_CONTENT_MAX_WIDTH_PX } from './home-sections';

/** Figma hero artboard — frame `51:329` (1440×853). */
export const HERO_DESIGN_WIDTH_PX = 1440;
export const HERO_DESIGN_HEIGHT_PX = 853;

/** Hero canvas matches homepage content column (`HOME_SECTION_CONTENT_MAX_WIDTH_PX`). */
export const HERO_CANVAS_MAX_WIDTH_PX = HOME_SECTION_CONTENT_MAX_WIDTH_PX;
export const HERO_CANVAS_MAX_HEIGHT_PX = Math.round(
  HERO_CANVAS_MAX_WIDTH_PX * (HERO_DESIGN_HEIGHT_PX / HERO_DESIGN_WIDTH_PX),
);
export const HERO_CANVAS_MIN_HEIGHT_PX = Math.round(520 * (HERO_CANVAS_MAX_WIDTH_PX / HERO_DESIGN_WIDTH_PX));

/** Nudge entire hero section down (below fixed header). */
export const HERO_SECTION_OFFSET_Y_PX = 32;

export const HERO_CONTENT_MAX_WIDTH_PX = HERO_CANVAS_MAX_WIDTH_PX;
export const HERO_CONTENT_MAX_HEIGHT_PX = HERO_CANVAS_MAX_HEIGHT_PX;
export const HERO_CONTENT_MIN_HEIGHT_PX = HERO_CANVAS_MIN_HEIGHT_PX;

export const HERO_ASSETS = {
  /** Figma `51:332` — girl + pink «SHAPE YOUR» arch. */
  pinkArch: '/assets/hero/hero-pink-arch.png',
  mainComposite: '/assets/hero/hero-main-composite.png',
  leftWing: '/assets/hero/hero-left-wing.png',
  decorationBunny: '/assets/hero/decoration-camera-mid.png',
  decorationStrawberry: '/assets/hero/decoration-strawberry.png',
  decorationMelody: '/assets/hero/decoration-camera-small.png',
  decorationCarrot: '/assets/hero/decoration-carrot.png',
} as const;

export interface HeroFlatPlacement {
  kind: 'flat';
  assetKey: keyof typeof HERO_ASSETS;
  leftPx: number;
  topPx: number;
  widthPx: number;
  heightPx: number;
  zIndex: number;
  /** Figma `51:333` — `object-bottom` + fill frame. */
  objectFit?: 'fill' | 'contain' | 'cover';
  objectPosition?: 'bottom' | 'center';
  priority?: boolean;
}

export interface HeroRotatedPlacement {
  kind: 'rotated';
  assetKey: keyof typeof HERO_ASSETS;
  leftPx: number;
  topPx: number;
  containerWidthPx: number;
  containerHeightPx: number;
  imageWidthPx: number;
  imageHeightPx: number;
  rotateDeg: number;
  flipY?: boolean;
  zIndex: number;
  objectPosition?: 'bottom' | 'cover';
  priority?: boolean;
}

export type HeroSceneLayer = HeroFlatPlacement | HeroRotatedPlacement;

/** Hero scene layers — paint order back → front (Figma frame `51:329`). */
export const HERO_SCENE_LAYERS: HeroSceneLayer[] = [
  {
    kind: 'rotated',
    assetKey: 'decorationBunny',
    leftPx: 720,
    topPx: 238,
    containerWidthPx: 251.608,
    containerHeightPx: 251.608,
    imageWidthPx: 188.1,
    imageHeightPx: 188.1,
    rotateDeg: -153.94,
    flipY: true,
    zIndex: 1,
  },
  {
    kind: 'rotated',
    assetKey: 'decorationStrawberry',
    leftPx: 357,
    topPx: 42,
    containerWidthPx: 332.217,
    containerHeightPx: 332.217,
    imageWidthPx: 248.831,
    imageHeightPx: 248.831,
    rotateDeg: -64.25,
    zIndex: 2,
  },
  {
    /** Figma `51:332` — pink «SHAPE YOUR» arch behind composite. */
    kind: 'rotated',
    assetKey: 'pinkArch',
    leftPx: 455,
    topPx: -27,
    containerWidthPx: 970.455,
    containerHeightPx: 936.881,
    imageWidthPx: 798.426,
    imageHeightPx: 750.114,
    rotateDeg: -15.57,
    zIndex: 3,
    priority: true,
  },
  {
    /** Figma `51:333` — girl + ottomans (893×538). */
    kind: 'flat',
    assetKey: 'mainComposite',
    leftPx: 282,
    topPx: 158,
    widthPx: 893,
    heightPx: 538,
    zIndex: 4,
    objectFit: 'fill',
    objectPosition: 'bottom',
    priority: true,
  },
  {
    kind: 'rotated',
    assetKey: 'decorationMelody',
    leftPx: 179.41,
    topPx: 124.41,
    containerWidthPx: 167.982,
    containerHeightPx: 167.982,
    imageWidthPx: 124.147,
    imageHeightPx: 124.147,
    rotateDeg: 28.09,
    zIndex: 5,
  },
  {
    kind: 'rotated',
    assetKey: 'leftWing',
    leftPx: -26.26,
    topPx: 114.99,
    containerWidthPx: 839.692,
    containerHeightPx: 850.998,
    imageWidthPx: 604.736,
    imageHeightPx: 634.95,
    rotateDeg: -29.66,
    zIndex: 6,
    objectPosition: 'bottom',
  },
  {
    kind: 'rotated',
    assetKey: 'decorationCarrot',
    leftPx: 1038,
    topPx: 565,
    containerWidthPx: 175.211,
    containerHeightPx: 175.211,
    imageWidthPx: 137.966,
    imageHeightPx: 137.966,
    rotateDeg: 71.1,
    zIndex: 7,
  },
];

/** Hero section sits below fixed header (z-50) and must not paint over page content. */
export const HERO_SECTION_Z_INDEX = 0;
export const HERO_CTA_Z_INDEX = 8;

/** Gender CTA buttons — Figma nodes `51:338`–`51:342`. */
export const HERO_GENDER_BUTTONS_TOP_PX = 763;
export const HERO_GENDER_BUTTONS_GAP_PX = 31;
export const HERO_GENDER_BUTTON_HEIGHT_PX = 56;
export const HERO_GENDER_BUTTON_GIRLS_WIDTH_PX = 183;
export const HERO_GENDER_BUTTON_PADDING_X_PX = 59;
export const HERO_GENDER_BUTTON_FONT_SIZE_PX = 16;
export const HERO_GENDER_BUTTON_LINE_HEIGHT_PX = 28;
export const HERO_GENDER_BUTTON_GIRLS_BG_COLOR = BRAND_COLORS.pink;
export const HERO_GENDER_BUTTON_BOYS_BG_COLOR = '#5281e1';
export const HERO_GENDER_BUTTON_INSET_SHADOW =
  'inset 0px -4px 8px 0px rgba(0, 0, 0, 0.27), inset 0px 4px 4px 0px rgba(255, 255, 255, 0.4), inset 0px 20px 40px -10px rgba(164, 60, 18, 0.2)';

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
