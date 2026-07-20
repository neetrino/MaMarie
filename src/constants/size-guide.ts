/** Kids size guide — body measurements (cm). */
export const SIZE_GUIDE_ILLUSTRATION_SRC = '/assets/product/size-guide-illustration.webp';

export const SIZE_GUIDE_ILLUSTRATION_WIDTH_PX = 644;
export const SIZE_GUIDE_ILLUSTRATION_HEIGHT_PX = 975;

export type SizeGuideRow = {
  sizeLabel: string;
  heightCm: number;
  chestCm: number;
  waistCm: number;
  hipCm: number;
};

export const SIZE_GUIDE_ROWS: readonly SizeGuideRow[] = [
  { sizeLabel: '2–3', heightCm: 98, chestCm: 55, waistCm: 52, hipCm: 57 },
  { sizeLabel: '4–5', heightCm: 110, chestCm: 59, waistCm: 55, hipCm: 61 },
  { sizeLabel: '6–7', heightCm: 116, chestCm: 62, waistCm: 57, hipCm: 64 },
] as const;

export const SIZE_GUIDE_MEASURE_KEYS = ['height', 'chest', 'waist', 'hip'] as const;

export type SizeGuideMeasureKey = (typeof SIZE_GUIDE_MEASURE_KEYS)[number];
