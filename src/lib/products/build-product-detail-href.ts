/**
 * Builds a storefront product detail URL, optionally pinning a variant via slug suffix.
 */
export function buildProductDetailHref(
  slug: string,
  variantId?: string | null
): string {
  if (variantId?.trim()) {
    return `/products/${slug}:${variantId.trim()}`;
  }
  return `/products/${slug}`;
}
