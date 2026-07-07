'use client';

import type { CSSProperties } from 'react';
import {
  MOBILE_WISHLIST_CARD_COLUMN_GAP_PX,
  MOBILE_WISHLIST_CARD_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_ROW_GAP_PX,
  MOBILE_WISHLIST_CARD_WIDTH_PX,
  MOBILE_WISHLIST_TITLE_TO_GRID_GAP_PX,
} from '../../constants/mobile-wishlist';
import type { HomeProductCardData } from '../home/HomeProductCard';
import { ProductCardMountPlaceholder } from '../home/ProductCardMountPlaceholder';
import { MobileWishlistProductCard } from './MobileWishlistProductCard';

interface MobileWishlistProductGridProps {
  products: HomeProductCardData[];
  loading: boolean;
  placeholderCount: number;
  addToCartLabel: string;
}

/** Figma `74:796` — mobile wishlist grid (2 phone, 4 iPad mini, 3 iPad Pro). */
export function MobileWishlistProductGrid({
  products,
  loading,
  placeholderCount,
  addToCartLabel,
}: MobileWishlistProductGridProps) {
  return (
    <div
      className="mobile-wishlist-tablet-grid grid w-full"
      style={{
        columnGap: MOBILE_WISHLIST_CARD_COLUMN_GAP_PX,
        rowGap: MOBILE_WISHLIST_CARD_ROW_GAP_PX,
        paddingTop: MOBILE_WISHLIST_TITLE_TO_GRID_GAP_PX,
      } as CSSProperties}
      aria-busy={loading}
    >
      {products.map((product) => (
        <MobileWishlistProductCard
          key={product.id}
          product={product}
          imagePriority
          addToCartLabel={addToCartLabel}
        />
      ))}

      {loading && products.length === 0
        ? Array.from({ length: placeholderCount }, (_, index) => (
            <ProductCardMountPlaceholder
              key={`mobile-wishlist-placeholder-${index}`}
              variant="grid"
              widthPx={MOBILE_WISHLIST_CARD_WIDTH_PX}
              heightPx={MOBILE_WISHLIST_CARD_HEIGHT_PX}
              className="mobile-wishlist-card-placeholder w-full max-w-none"
            />
          ))
        : null}
    </div>
  );
}
