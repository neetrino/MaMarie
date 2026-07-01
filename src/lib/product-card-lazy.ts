import type { ProductsCatalogViewMode } from '../constants/products-catalog';

/** First visible row mounts eagerly; the rest defer until near the viewport. */
export const PRODUCT_CARD_LAZY_EAGER_COUNT_GRID3 = 3;
export const PRODUCT_CARD_LAZY_EAGER_COUNT_GRID4 = 4;
export const PRODUCT_CARD_LAZY_EAGER_COUNT_LIST = 4;

export function resolveProductCardEagerMount(
  index: number,
  viewMode: ProductsCatalogViewMode | 'wishlist-grid-4',
): boolean {
  if (viewMode === 'list') {
    return index < PRODUCT_CARD_LAZY_EAGER_COUNT_LIST;
  }

  if (viewMode === 'grid-4' || viewMode === 'wishlist-grid-4') {
    return index < PRODUCT_CARD_LAZY_EAGER_COUNT_GRID4;
  }

  return index < PRODUCT_CARD_LAZY_EAGER_COUNT_GRID3;
}

export function resolveProductCardImagePriority(
  index: number,
  viewMode: ProductsCatalogViewMode | 'wishlist-grid-4',
): boolean {
  return resolveProductCardEagerMount(index, viewMode);
}
