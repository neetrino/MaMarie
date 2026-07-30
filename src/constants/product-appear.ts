import type { CSSProperties } from 'react';

/** Hidden until scroll/mount trigger — not dimmed, fully invisible. */
export const PRODUCT_APPEAR_PENDING_CLASS = 'product-appear-pending';

/** Soft fade + rise cascade. */
export const PRODUCT_APPEAR_CLASS = 'animate-catalog-grid-in';

export const PRODUCT_APPEAR_DURATION_MS = 560;
export const PRODUCT_APPEAR_STAGGER_MS = 70;
export const PRODUCT_APPEAR_STAGGER_CAP = 8;

export function productAppearDelayMs(index: number): number {
  const waveIndex = Math.max(index, 0) % (PRODUCT_APPEAR_STAGGER_CAP + 1);
  return waveIndex * PRODUCT_APPEAR_STAGGER_MS;
}

export function productAppearStyle(index: number): CSSProperties {
  return {
    '--product-appear-delay': `${productAppearDelayMs(index)}ms`,
    '--product-appear-duration': `${PRODUCT_APPEAR_DURATION_MS}ms`,
  } as CSSProperties;
}
