/** Figma hero artboard — frame `9:590` (1440×853). */
export const HERO_DESIGN_WIDTH_PX = 1440;
export const HERO_DESIGN_HEIGHT_PX = 853;

/** Match navbar horizontal inset (header only — hero canvas is full 1440). */
export const HERO_PADDING_LEFT_PX = 87;
export const HERO_PADDING_RIGHT_PX = 93;

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
    zIndex: 20,
  },
  {
    /** Figma `chatgptImageJun102026At` — boy (68:2328), matched visually to girl. */
    assetKey: 'layerRight',
    leftPx: 377,
    topPx: 204,
    widthPx: HERO_KID_PHOTO_WIDTH_PX,
    heightPx: HERO_KID_PHOTO_HEIGHT_PX,
    zIndex: 30,
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
    zIndex: 50,
  },
];

export interface HeroDecorationPlacement {
  assetKey: keyof typeof HERO_ASSETS;
  leftPx: number;
  topPx: number;
  widthPx: number;
  heightPx: number;
  rotateDeg?: number;
  flipY?: boolean;
  zIndex: number;
}

/** Bunny decoration — Figma `camera101` base size was 158px. */
export const HERO_BUNNY_FIGMA_SIZE_PX = 158;
export const HERO_BUNNY_SIZE_PX = 120;

/** Clay star — Figma `camera51` base size was 375.2px. */
export const HERO_STAR_FIGMA_SIZE_PX = 375.2;
export const HERO_STAR_SIZE_PX = 330;
export const HERO_STAR_ROTATE_DEG = 310;

/** Melody notes rotation — Figma `camera91`. */
export const HERO_MELODY_ROTATE_DEG = 50;

/** Nudge melody notes up. */
export const HERO_MELODY_OFFSET_Y_PX = -24;

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
    zIndex: 5,
  },
  {
    /** Melody notes — Figma `camera91` slot. */
    assetKey: 'musicNotes',
    leftPx: 211,
    topPx: 150 + HERO_MELODY_OFFSET_Y_PX,
    widthPx: 173.8,
    heightPx: 173.8,
    rotateDeg: HERO_MELODY_ROTATE_DEG,
    zIndex: 55,
  },
  {
    /** Bunny — Figma `camera101` slot. */
    assetKey: 'decorationBunny',
    leftPx: 646 + (HERO_BUNNY_FIGMA_SIZE_PX - HERO_BUNNY_SIZE_PX) / 2,
    topPx: 237 + (HERO_BUNNY_FIGMA_SIZE_PX - HERO_BUNNY_SIZE_PX) / 2,
    widthPx: HERO_BUNNY_SIZE_PX,
    heightPx: HERO_BUNNY_SIZE_PX,
    zIndex: 60,
  },
];

/** Arc sits between center/right photos and left wing — Figma paint order. */
export const HERO_ARC_Z_INDEX = 40;

/** Arc headline — Figma `chatgptImageJun102026At2` (77:2826). */
export const HERO_ARC_PLACEMENT = {
  leftPx: 629,
  topPx: 55,
  widthPx: 628,
  heightPx: 590,
} as const;

/** Fine-tune right arc — «YOUR CHILDHOOD». */
export const HERO_ARC_OFFSET_X_PX = -20;

/** CTA row — Figma `.buttons`. */
export const HERO_CTA_PLACEMENT = {
  leftPx: 850,
  topPx: 645,
  heightPx: 64,
} as const;

export const HERO_CTA_PRIMARY_WIDTH_PX = 152;
export const HERO_CTA_SECONDARY_WIDTH_PX = 198;
export const HERO_CTA_GAP_PX = 7;

/** Bottom pill row — Figma `.button4` (carousel placeholder). */
export const HERO_BOTTOM_PILL_PLACEMENT = {
  leftPx: 516,
  topPx: 743,
  widthPx: 401,
  heightPx: 64,
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
