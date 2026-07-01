'use client';

import {
  MOBILE_WISHLIST_CARD_COLUMN_GAP_PX,
  MOBILE_WISHLIST_CARD_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_ROW_GAP_PX,
  MOBILE_WISHLIST_CARD_WIDTH_PX,
  MOBILE_WISHLIST_PAGE_BG,
  MOBILE_WISHLIST_PAGE_HORIZONTAL_PADDING_PX,
  MOBILE_WISHLIST_PAGE_PADDING_BOTTOM_PX,
  MOBILE_WISHLIST_PAGE_PADDING_TOP_PX,
  MOBILE_WISHLIST_TITLE_TO_GRID_GAP_PX,
} from '../../constants/mobile-wishlist';
import { resolveProductCardEagerMount, resolveProductCardImagePriority } from '../../lib/product-card-lazy';
import type { HomeProductCardData } from '../home/HomeProductCard';
import { ProductCardMountPlaceholder } from '../home/ProductCardMountPlaceholder';
import { LazyWhenVisible } from '../LazyWhenVisible';
import { MobileWishlistProductCard } from './MobileWishlistProductCard';

const MOBILE_WISHLIST_VIEW_MODE = 'wishlist-grid-4' as const;

interface MobileWishlistProductGridProps {
  products: HomeProductCardData[];
  loading: boolean;
  placeholderCount: number;
  addToCartLabel: string;
}

/** Figma `74:796` — two-column mobile wishlist product grid. */
export function MobileWishlistProductGrid({
  products,
  loading,
  placeholderCount,
  addToCartLabel,
}: MobileWishlistProductGridProps) {
  return (
    <div
      className="grid w-full"
      style={{
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        columnGap: MOBILE_WISHLIST_CARD_COLUMN_GAP_PX,
        rowGap: MOBILE_WISHLIST_CARD_ROW_GAP_PX,
        paddingTop: MOBILE_WISHLIST_TITLE_TO_GRID_GAP_PX,
      }}
      aria-busy={loading}
    >
      {products.map((product, index) => (
        <LazyWhenVisible
          key={product.id}
          eager={resolveProductCardEagerMount(index, MOBILE_WISHLIST_VIEW_MODE)}
          minHeightPx={MOBILE_WISHLIST_CARD_HEIGHT_PX}
          fallback={
            <ProductCardMountPlaceholder
              variant="grid"
              widthPx={MOBILE_WISHLIST_CARD_WIDTH_PX}
              heightPx={MOBILE_WISHLIST_CARD_HEIGHT_PX}
            />
          }
        >
          <MobileWishlistProductCard
            product={product}
            imagePriority={resolveProductCardImagePriority(index, MOBILE_WISHLIST_VIEW_MODE)}
            addToCartLabel={addToCartLabel}
          />
        </LazyWhenVisible>
      ))}

      {loading && products.length === 0
        ? Array.from({ length: placeholderCount }, (_, index) => (
            <ProductCardMountPlaceholder
              key={`mobile-wishlist-placeholder-${index}`}
              variant="grid"
              widthPx={MOBILE_WISHLIST_CARD_WIDTH_PX}
              heightPx={MOBILE_WISHLIST_CARD_HEIGHT_PX}
            />
          ))
        : null}
    </div>
  );
}
