'use client';

import {
  PRODUCTS_CATALOG_CARD_HEIGHT_PX,
  PRODUCTS_CATALOG_CARD_WIDTH_PX,
} from '../../constants/products-catalog';
import { mapToHomeProductCard } from '../home/best-products-data';
import { HomeProductCard } from '../home/HomeProductCard';

export interface RelatedProductCardData {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  compareAtPrice: number | null;
  discountPercent?: number | null;
  image: string | null;
  inStock: boolean;
  brand?: {
    id: string;
    name: string;
  } | null;
}

interface RelatedProductCardProps {
  product: RelatedProductCardData;
  imagePriority?: boolean;
}

/** Related products row — same card as shop catalog (`HomeProductCard`). */
export function RelatedProductCard({
  product,
  imagePriority = false,
}: RelatedProductCardProps) {
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
    <div className="shrink-0 snap-start" style={{ width: PRODUCTS_CATALOG_CARD_WIDTH_PX }}>
      <HomeProductCard
        product={cardProduct}
        layoutWidthPx={PRODUCTS_CATALOG_CARD_WIDTH_PX}
        layoutHeightPx={PRODUCTS_CATALOG_CARD_HEIGHT_PX}
        imagePriority={imagePriority}
      />
    </div>
  );
}
