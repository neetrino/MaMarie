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
  decorationStar: '/assets/hero/decoration-star.png',
  decorationBunny: '/assets/hero/decoration-bunny.png',
  musicNotes: '/assets/hero/music-notes.png',
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
  offsetYPx?: number;
  scale?: number;
  scaleOrigin?: string;
}

/** Nudge left arc wing up — «SHAPE» side in `layerLeft`. */
export const HERO_LAYER_LEFT_OFFSET_Y_PX = -125;

/** Scale for «SHAPE YOUR CHILDHOOD» headline (left wing + right arc). */
export const HERO_HEADLINE_SCALE = 0.9;

/** Photo collage layers — paint order back → front (Figma `9:590`). */
export const HERO_PHOTO_LAYERS: HeroLayerPlacement[] = [
  {
    /** Figma node 68:2329 — girl (center). */
    assetKey: 'layerCenter',
    leftPx: 584,
    topPx: 157,
    widthPx: 490,
    heightPx: 696,
    zIndex: 20,
    crop: { widthPercent: 104.38, heightPercent: 110.37, leftPercent: 0, topPercent: 0 },
  },
  {
    /** Figma node 68:2328 — boy accent (right, flipped). */
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
    /** Figma node 68:2331 — boy + left text wing. */
    assetKey: 'layerLeft',
    leftPx: 102,
    topPx: 249,
    widthPx: 721,
    heightPx: 655,
    zIndex: 50,
    offsetYPx: HERO_LAYER_LEFT_OFFSET_Y_PX,
    scale: HERO_HEADLINE_SCALE,
    scaleOrigin: 'top left',
    crop: { widthPercent: 100, heightPercent: 110.08, leftPercent: 0, topPercent: -6.64 },
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

/** Floating clay icons — enable when assets are exported to public/assets/hero/. */
export const HERO_DECORATIONS: HeroDecorationPlacement[] = [];

/** Fine-tune arc overlay — «Y» aligned with beanie. */
export const HERO_ARC_OFFSET_X_PX = 198;
export const HERO_ARC_OFFSET_Y_PX = -36;

/** Arc sits above photos and left text wing. */
export const HERO_ARC_Z_INDEX = 100;

/** Arc headline group `77:2826`. */
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
