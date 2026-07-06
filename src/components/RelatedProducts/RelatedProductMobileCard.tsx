'use client';

import {
  MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX,
} from '../../constants/mobile-products-catalog';
import { MobileProductsCatalogProductCard } from '../products/MobileProductsCatalogProductCard';
import {
  mapRelatedProductToHomeProductCard,
  type RelatedProductCardData,
} from './RelatedProductCard';

interface RelatedProductMobileCardProps {
  product: RelatedProductCardData;
  imagePriority?: boolean;
  addToCartLabel: string;
}

/** PDP related row on mobile — same card component and width as mobile shop catalog. */
export function RelatedProductMobileCard({
  product,
  imagePriority = false,
  addToCartLabel,
}: RelatedProductMobileCardProps) {
  const layoutWidthPx = MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX;
  const cardProduct = mapRelatedProductToHomeProductCard(product);

  return (
    <div className="shrink-0 snap-start" style={{ width: layoutWidthPx }}>
      <MobileProductsCatalogProductCard
        product={cardProduct}
        layoutWidthPx={layoutWidthPx}
        imagePriority={imagePriority}
        addToCartLabel={addToCartLabel}
      />
    </div>
  );
}
