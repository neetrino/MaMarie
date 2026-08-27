/**
 * Normalizes isMain across a variant payload so exactly one variant is Main.
 */
export function normalizeVariantIsMainFlags<T extends { isMain?: boolean }>(
  variants: T[]
): Array<T & { isMain: boolean }> {
  if (variants.length === 0) {
    return [];
  }

  const mainIndex = variants.findIndex((variant) => variant.isMain === true);
  const resolvedIndex = mainIndex >= 0 ? mainIndex : 0;

  return variants.map((variant, index) => ({
    ...variant,
    isMain: index === resolvedIndex,
  }));
}
