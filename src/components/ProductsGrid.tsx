'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';
import {
  PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
  PRODUCTS_CATALOG_CARD_ROW_GAP_PX,
  PRODUCTS_CATALOG_CARD_HEIGHT_GRID4_PX,
  PRODUCTS_CATALOG_CARD_HEIGHT_PX,
  PRODUCTS_CATALOG_CARD_WIDTH_GRID4_PX,
  PRODUCTS_CATALOG_CARD_WIDTH_PX,
  PRODUCTS_CATALOG_CTA_BG,
  PRODUCTS_CATALOG_CTA_HEIGHT_PX,
  PRODUCTS_CATALOG_CTA_INSET_SHADOW,
  PRODUCTS_CATALOG_CTA_WIDTH_PX,
  getProductsCatalogGridClassName,
  PRODUCTS_CATALOG_LIST_ROW_GAP_PX,
} from '../constants/products-catalog';
import { mapToHomeProductCard } from './home/best-products-data';
import { HomeProductCard } from './home/HomeProductCard';
import { HomeProductCardListRow } from './home/HomeProductCardListRow';
import { useTranslation } from '../lib/i18n-client';
import { useProductsCatalogViewMode } from './products/useProductsCatalogViewMode';

import type {
  ProductColorOption,
  ProductSizeOption,
} from '../lib/services/product-variant-attributes';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  originalPrice?: number | null;
  image: string | null;
  inStock: boolean;
  brand: {
    id: string;
    name: string;
  } | null;
  defaultVariantId?: string | null;
  colors?: ProductColorOption[];
  sizes?: ProductSizeOption[];
  averageRating?: number;
  reviewsCount?: number;
}

interface ProductsGridProps {
  products: Product[];
  sortBy?: string;
  loadMoreHref?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export const ProductsGrid = memo(function ProductsGrid({
  products,
  sortBy = 'default',
  loadMoreHref = null,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
}: ProductsGridProps) {
  const { t } = useTranslation();
  const { viewMode } = useProductsCatalogViewMode();

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return sorted.map(mapToHomeProductCard);
  }, [products, sortBy]);

  const cardWidthPx =
    viewMode === 'grid-4' ? PRODUCTS_CATALOG_CARD_WIDTH_GRID4_PX : PRODUCTS_CATALOG_CARD_WIDTH_PX;
  const cardHeightPx =
    viewMode === 'grid-4' ? PRODUCTS_CATALOG_CARD_HEIGHT_GRID4_PX : PRODUCTS_CATALOG_CARD_HEIGHT_PX;

  if (sortedProducts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-[#757571]">{t('products.grid.noProducts')}</p>
      </div>
    );
  }

  const loadMoreCta =
    onLoadMore && hasMore ? (
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isLoadingMore}
        className="mt-10 flex items-center justify-center font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
        style={{
          width: PRODUCTS_CATALOG_CTA_WIDTH_PX,
          height: PRODUCTS_CATALOG_CTA_HEIGHT_PX,
          borderRadius: 9999,
          backgroundColor: PRODUCTS_CATALOG_CTA_BG,
          boxShadow: PRODUCTS_CATALOG_CTA_INSET_SHADOW,
        }}
      >
        {t('products.catalog.seeAll')}
      </button>
    ) : loadMoreHref ? (
      <Link
        href={loadMoreHref}
        className="mt-10 flex items-center justify-center font-bold text-white transition-opacity hover:opacity-90"
        style={{
          width: PRODUCTS_CATALOG_CTA_WIDTH_PX,
          height: PRODUCTS_CATALOG_CTA_HEIGHT_PX,
          borderRadius: 9999,
          backgroundColor: PRODUCTS_CATALOG_CTA_BG,
          boxShadow: PRODUCTS_CATALOG_CTA_INSET_SHADOW,
        }}
      >
        {t('products.catalog.seeAll')}
      </Link>
    ) : null;

  if (viewMode === 'list') {
    return (
      <div className="flex w-full flex-col items-center">
        <div
          className={getProductsCatalogGridClassName(viewMode)}
          style={{ gap: PRODUCTS_CATALOG_LIST_ROW_GAP_PX }}
        >
          {sortedProducts.map((product, index) => (
            <HomeProductCardListRow
              key={product.id}
              product={product}
              imagePriority={index < 6}
            />
          ))}
        </div>
        {loadMoreCta}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={getProductsCatalogGridClassName(viewMode)}
        style={{
          columnGap: PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
          rowGap: PRODUCTS_CATALOG_CARD_ROW_GAP_PX,
        }}
      >
        {sortedProducts.map((product, index) => (
          <HomeProductCard
            key={product.id}
            product={product}
            layoutWidthPx={cardWidthPx}
            layoutHeightPx={cardHeightPx}
            compactPanel={viewMode === 'grid-4'}
            imagePriority={index < 6}
          />
        ))}
      </div>

      {loadMoreCta}
    </div>
  );
});
