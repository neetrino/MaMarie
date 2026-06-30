import type { GeneratedVariant } from '../types';

/** Ensures exactly one variant is marked as main when the list is non-empty. */
export function ensureOneMainVariant(variants: GeneratedVariant[]): GeneratedVariant[] {
  if (variants.length === 0) return variants;
  const mainCount = variants.filter((v) => v.isMain).length;
  if (mainCount === 1) return variants;
  return variants.map((v, index) => ({ ...v, isMain: index === 0 }));
}

/** Sets the given variant as the sole main variant. */
export function setMainVariant(
  variants: GeneratedVariant[],
  variantId: string
): GeneratedVariant[] {
  return variants.map((v) => ({ ...v, isMain: v.id === variantId }));
}
