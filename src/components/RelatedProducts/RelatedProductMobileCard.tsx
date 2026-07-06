'use client';

import {
  RELATED_PRODUCTS_MOBILE_CARD_WIDTH_PX,
} from '../../constants/products-catalog';
import {
  MOBILE_WISHLIST_CARD_WIDTH_PX,
} from '../../constants/mobile-wishlist';
import { mapToHomeProductCard } from '../home/best-products-data';
import { MobileWishlistProductCard } from '../wishlist/MobileWishlistProductCard';
import type { RelatedProductCardData } from './RelatedProductCard';

interface RelatedProductMobileCardProps {
  product: RelatedProductCardData;
  imagePriority?: boolean;
  addToCartLabel: string;
}

/** PDP related row on mobile — same card as wishlist. */
export function RelatedProductMobileCard({
  product,
  imagePriority = false,
  addToCartLabel,
}: RelatedProductMobileCardProps) {
  const cardProduct = mapToHomeProductCard({
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    originalPrice: product.originalPrice,
    image: product.image,
    inStock: product.inStock,
    brand: product.brand ? { name: product.brand.name } : null,
  });

  return (
    <div className="shrink-0 snap-start" style={{ width: RELATED_PRODUCTS_MOBILE_CARD_WIDTH_PX }}>
      <MobileWishlistProductCard
        product={cardProduct}
        layoutWidthPx={MOBILE_WISHLIST_CARD_WIDTH_PX}
        imagePriority={imagePriority}
        addToCartLabel={addToCartLabel}
      />
    </div>
  );
}
