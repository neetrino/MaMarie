'use client';

import {
  BEST_PRODUCTS_CARD_GAP_PX,
  BEST_PRODUCTS_GRID_OFFSET_TOP_PX,
  BEST_PRODUCTS_SECTION_MAX_WIDTH_PX,
  BEST_PRODUCTS_SECTION_PADDING_LEFT_PX,
  BEST_PRODUCTS_SECTION_PADDING_RIGHT_PX,
} from '../../constants/home-sections';
import type { HomeProductCardData } from './HomeProductCard';
import { HomeProductCard } from './HomeProductCard';

interface BestProductsGridProps {
  products: HomeProductCardData[];
}

/**
 * Four product cards row — Figma node `1:72` / card `1:73`.
 */
export function BestProductsGrid({ products }: BestProductsGridProps) {
  return (
    <div
      className="w-full bg-white"
      style={{ paddingTop: BEST_PRODUCTS_GRID_OFFSET_TOP_PX }}
    >
      <div
        className="mx-auto flex w-full overflow-x-auto pb-8 lg:overflow-visible"
        style={{
          maxWidth: BEST_PRODUCTS_SECTION_MAX_WIDTH_PX,
          paddingLeft: BEST_PRODUCTS_SECTION_PADDING_LEFT_PX,
          paddingRight: BEST_PRODUCTS_SECTION_PADDING_RIGHT_PX,
          gap: BEST_PRODUCTS_CARD_GAP_PX,
        }}
      >
        {products.map((product) => (
          <HomeProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
