'use client';

import {
  PRODUCTS_CATALOG_CARD_HEIGHT_PX,
  PRODUCTS_CATALOG_CARD_WIDTH_PX,
} from '../../constants/products-catalog';
import type {
  ProductColorOption,
  ProductSizeOption,
} from '../../lib/services/product-variant-attributes';
import { mapToHomeProductCard } from '../home/best-products-data';
import { HomeProductCard } from '../home/HomeProductCard';
import type { HomeProductCardData } from '../home/HomeProductCard';

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
  defaultVariantId?: string | null;
  colors?: ProductColorOption[];
  sizes?: ProductSizeOption[];
  averageRating?: number;
  reviewsCount?: number;
}

interface RelatedProductCardProps {
  product: RelatedProductCardData;
  imagePriority?: boolean;
}

/** Maps related API payload to the same card model as shop catalog. */
export function mapRelatedProductToHomeProductCard(
  product: RelatedProductCardData,
): HomeProductCardData {
  return mapToHomeProductCard({
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    originalPrice: product.originalPrice,
    image: product.image,
    inStock: product.inStock,
    brand: product.brand ? { name: product.brand.name } : null,
    defaultVariantId: product.defaultVariantId,
    colors: product.colors,
    sizes: product.sizes,
    averageRating: product.averageRating,
    reviewsCount: product.reviewsCount,
  });
}

/** Related products row — same card as shop catalog (`HomeProductCard`). */
export function RelatedProductCard({
  product,
  imagePriority = false,
}: RelatedProductCardProps) {
  const cardProduct = mapRelatedProductToHomeProductCard(product);

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
