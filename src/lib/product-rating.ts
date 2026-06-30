/**
 * Formats product rating for compact card display (e.g. "4.7 (12)").
 * Matches single product page logic: 0.0 when there are no reviews.
 */
export function formatProductRatingLabel(averageRating: number, reviewsCount: number): string {
  const ratingLabel = averageRating > 0 ? averageRating.toFixed(1) : '0.0';
  return `${ratingLabel} (${reviewsCount})`;
}
