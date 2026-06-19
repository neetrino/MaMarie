/** Figma hero artboard — frame `9:590` (1440×853). */
export const HERO_DESIGN_WIDTH_PX = 1440;
export const HERO_DESIGN_HEIGHT_PX = 853;

/** Match navbar horizontal inset. */
export const HERO_PADDING_LEFT_PX = 87;
export const HERO_PADDING_RIGHT_PX = 93;

/** Nudge photo collage + arc right; CTA buttons stay at Figma coordinates. */
export const HERO_COLLAGE_SHIFT_X_PX = 32;

export const HERO_ASSETS = {
  shapeTextArc: '/assets/hero/shape-text-arc.png',
  layerLeft: '/assets/hero/hero-layer-left.png',
  layerCenter: '/assets/hero/hero-layer-center.png',
  layerRight: '/assets/hero/hero-layer-right.png',
  decorationCameraLarge: '/assets/hero/decoration-camera-large.png',
  decorationCameraSmall: '/assets/hero/decoration-camera-small.png',
  decorationCameraMid: '/assets/hero/decoration-camera-mid.png',
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
  crop?: HeroImageCrop;
  flip?: boolean;
}

/** Photo collage layers — paint order back → front (Figma `9:590`). */
export const HERO_PHOTO_LAYERS: HeroLayerPlacement[] = [
  {
    /** Figma node 68:2329 — center collage layer. */
    assetKey: 'layerCenter',
    leftPx: 584,
    topPx: 157,
    widthPx: 490,
    heightPx: 696,
    zIndex: 20,
    crop: { widthPercent: 104.38, heightPercent: 110.37, leftPercent: 0, topPercent: 0 },
  },
  {
    /** Figma node 68:2328 — right collage layer (flipped per Figma). */
    assetKey: 'layerRight',
    leftPx: 791,
    topPx: 204,
    widthPx: 414,
    heightPx: 649,
    zIndex: 30,
    flip: true,
    crop: { widthPercent: 201.31, heightPercent: 171.65, leftPercent: -50.65, topPercent: -37.22 },
  },
  {
    /** Figma node 68:2331 — boy + left collage wing. */
    assetKey: 'layerLeft',
    leftPx: 102,
    topPx: 249,
    widthPx: 721,
    heightPx: 655,
    zIndex: 50,
    crop: { widthPercent: 100, heightPercent: 110.08, leftPercent: 0, topPercent: -6.64 },
  },
];

export interface HeroDecorationPlacement {
  assetKey: keyof typeof HERO_ASSETS;
  leftPx: number;
  topPx: number;
  sizePx: number;
  innerSizePx: number;
  rotateDeg: number;
  flipY?: boolean;
  zIndex: number;
}

export const HERO_DECORATIONS: HeroDecorationPlacement[] = [
  {
    /** Figma node 77:2723 — large clay camera (top-right). */
    assetKey: 'decorationCameraLarge',
    leftPx: 1032.64,
    topPx: 13.64,
    sizePx: 375.168,
    innerSizePx: 273.164,
    rotateDeg: -58.8,
    zIndex: 10,
  },
  {
    /** Figma node 77:2724 — small clay camera (top-left). */
    assetKey: 'decorationCameraSmall',
    leftPx: 211,
    topPx: 150,
    sizePx: 173.795,
    innerSizePx: 124.147,
    rotateDeg: 53.16,
    zIndex: 55,
  },
  {
    /** Figma node 77:2748 — mid clay camera (center). */
    assetKey: 'decorationCameraMid',
    leftPx: 646,
    topPx: 237,
    sizePx: 157.955,
    innerSizePx: 122.629,
    rotateDeg: 159.38,
    flipY: true,
    zIndex: 60,
  },
];

/** Arc headline group `77:2826` — centered above collage. */
export const HERO_ARC_PLACEMENT = {
  topPx: 0,
  widthPx: 772,
  heightPx: 708,
  leftPx: 334,
} as const;

/** CTA row `68:2315`. */
export const HERO_CTA_PLACEMENT = {
  leftPx: 791,
  topPx: 645,
  heightPx: 64,
} as const;

export const HERO_CTA_PRIMARY_WIDTH_PX = 152;
export const HERO_CTA_SECONDARY_WIDTH_PX = 198;
export const HERO_CTA_GAP_PX = 16;

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
