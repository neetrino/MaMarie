import { PRODUCT_PDP_RELATED_PLACEHOLDER_MIN_HEIGHT_PX } from './constants';

/** Placeholder while related products stream in (below the fold). */
export function ProductRelatedFallback() {
  return (
    <div
      className="mt-12 border-t border-gray-200 py-8 lg:mt-20 lg:py-12"
      aria-busy="true"
      aria-label="Loading related products"
    >
      <div
        className="mx-auto max-w-xs animate-pulse rounded-lg bg-neutral-100"
        style={{ minHeight: PRODUCT_PDP_RELATED_PLACEHOLDER_MIN_HEIGHT_PX }}
      />
    </div>
  );
}
