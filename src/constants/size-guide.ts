/** Kids size guide — body measurements (cm). */
export const SIZE_GUIDE_ILLUSTRATION_SRC = '/assets/product/size-guide-illustration.webp';

export const SIZE_GUIDE_ILLUSTRATION_WIDTH_PX = 612;
export const SIZE_GUIDE_ILLUSTRATION_HEIGHT_PX = 976;

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

/**
 * Overlay label classes — % positions match lines on the cropped illustration.
 * (HTML text over photo so labels stay sharp.)
 */
export const SIZE_GUIDE_OVERLAY_LABEL_CLASS: Record<SizeGuideMeasureKey, string> = {
  height:
    'pointer-events-none absolute left-[1%] top-[49%] -translate-x-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-bold uppercase tracking-wide text-[#57423b] sm:text-xs',
  chest:
    'pointer-events-none absolute left-[56%] top-[22.5%] -translate-x-1/2 -translate-y-full text-[11px] font-bold uppercase tracking-wide text-[#57423b] sm:text-xs',
  waist:
    'pointer-events-none absolute left-[56%] top-[37%] -translate-x-1/2 -translate-y-full text-[11px] font-bold uppercase tracking-wide text-[#57423b] sm:text-xs',
  hip:
    'pointer-events-none absolute left-[56%] top-[58%] -translate-x-1/2 -translate-y-full text-[11px] font-bold uppercase tracking-wide text-[#57423b] sm:text-xs',
};
