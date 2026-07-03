'use client';

import {
  MOBILE_PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_ROW_GAP_PX,
} from '../../constants/mobile-products-catalog';
import type { HomeProductCardData } from '../home/HomeProductCard';
import { MobileProductsCatalogProductCard } from './MobileProductsCatalogProductCard';

interface MobileProductsCatalogProductGridProps {
  products: HomeProductCardData[];
  addToCartLabel: string;
}

/** Figma mobile shop — two-column product grid with yellow catalog cards. */
export function MobileProductsCatalogProductGrid({
  products,
  addToCartLabel,
}: MobileProductsCatalogProductGridProps) {
  return (
    <div
      className="mobile-tablet-three-column-grid grid w-full min-w-0"
      style={{
        columnGap: MOBILE_PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
        rowGap: MOBILE_PRODUCTS_CATALOG_CARD_ROW_GAP_PX,
      }}
    >
      {products.map((product, index) => (
        <MobileProductsCatalogProductCard
          key={product.id}
          product={product}
          imagePriority={index < 4}
          addToCartLabel={addToCartLabel}
        />
      ))}
    </div>
  );
}
