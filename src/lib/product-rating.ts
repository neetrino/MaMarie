/**
 * Default rating shown when a product has no reviews yet.
 */
export const DEFAULT_PRODUCT_RATING = 5;

/**
 * Resolves the rating to display for a product.
 * Products without reviews show 5.0, not 0.0.
 */
export function getEffectiveProductRating(
  averageRating: number | null | undefined,
  reviewsCount: number | null | undefined,
): number {
  const count = reviewsCount ?? 0;
  if (count <= 0) {
    return DEFAULT_PRODUCT_RATING;
  }

  const rating = averageRating ?? 0;
  return rating > 0 ? rating : DEFAULT_PRODUCT_RATING;
}

/**
 * Formats product rating for compact card display (e.g. "4.7").
 */
export function formatProductRatingLabel(
  averageRating: number | null | undefined,
  reviewsCount: number | null | undefined,
): string {
  return getEffectiveProductRating(averageRating, reviewsCount).toFixed(1);
}
