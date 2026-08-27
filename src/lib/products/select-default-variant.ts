/**
 * Picks the product's default presentation variant.
 * Prefers explicit `isMain`; never selects by lowest price.
 */

export interface DefaultVariantCandidate {
  id: string;
  isMain?: boolean | null;
  position?: number | null;
  published?: boolean | null;
}

/**
 * Returns the Main Variant when set; otherwise the first valid/active variant by position.
 */
export function selectDefaultVariant<T extends DefaultVariantCandidate>(
  variants: T[] | null | undefined
): T | null {
  if (!Array.isArray(variants) || variants.length === 0) {
    return null;
  }

  const published = variants.filter((variant) => variant.published !== false);
  const pool = published.length > 0 ? published : variants;

  const main = pool.find((variant) => variant.isMain === true);
  if (main) {
    return main;
  }

  return [...pool].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0] ?? null;
}

/**
 * Sorts variants with Main first, then by position — never by price for presentation order.
 */
export function sortVariantsForPresentation<T extends DefaultVariantCandidate>(
  variants: T[] | null | undefined
): T[] {
  if (!Array.isArray(variants) || variants.length === 0) {
    return [];
  }

  return [...variants].sort((a, b) => {
    if (a.isMain === true && b.isMain !== true) return -1;
    if (b.isMain === true && a.isMain !== true) return 1;
    return (a.position ?? 0) - (b.position ?? 0);
  });
}
