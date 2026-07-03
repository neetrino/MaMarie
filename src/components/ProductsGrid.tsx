'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';
import {
  PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
  PRODUCTS_CATALOG_CARD_ROW_GAP_GRID3_PX,
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
  PRODUCTS_CATALOG_LIST_ROW_HEIGHT_PX,
} from '../constants/products-catalog';
import { mapToHomeProductCard } from './home/best-products-data';
import { HomeProductCard } from './home/HomeProductCard';
import { HomeProductCardListRow } from './home/HomeProductCardListRow';
import { ProductCardMountPlaceholder } from './home/ProductCardMountPlaceholder';
import { MobileProductsCatalogProductGrid } from './products/MobileProductsCatalogProductGrid';
import { MobileProductsCatalogTrack } from './products/MobileProductsCatalogTrack';
import { LazyWhenVisible } from './LazyWhenVisible';
import { useTranslation } from '../lib/i18n-client';
import { resolveProductCardEagerMount, resolveProductCardImagePriority } from '../lib/product-card-lazy';
import { useTouchDevice } from '../lib/use-touch-device';
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
  const isTouchDevice = useTouchDevice();

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
  const rowGapPx =
    viewMode === 'grid-3'
      ? PRODUCTS_CATALOG_CARD_ROW_GAP_GRID3_PX
      : PRODUCTS_CATALOG_CARD_ROW_GAP_PX;

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
        className="mt-10 flex w-full max-w-[200px] self-center items-center justify-center font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
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
        className="mt-10 flex w-full max-w-[200px] self-center items-center justify-center font-bold text-white transition-opacity hover:opacity-90"
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

  const mobileGrid = (
    <MobileProductsCatalogTrack className="block w-full min-w-0 max-lg:overflow-visible lg:hidden">
      <MobileProductsCatalogProductGrid
        products={sortedProducts}
        addToCartLabel={t('common.wishlist.addToCart')}
      />
    </MobileProductsCatalogTrack>
  );

  if (viewMode === 'list') {
    return (
      <div className="flex w-full min-w-0 flex-col">
        <div
          className="hidden w-full lg:flex lg:flex-col"
          style={{ gap: PRODUCTS_CATALOG_LIST_ROW_GAP_PX }}
        >
          {sortedProducts.map((product, index) => (
            <LazyWhenVisible
              key={product.id}
              eager={resolveProductCardEagerMount(index, viewMode)}
              minHeightPx={PRODUCTS_CATALOG_LIST_ROW_HEIGHT_PX}
              fallback={<ProductCardMountPlaceholder variant="list" />}
            >
              <HomeProductCardListRow
                product={product}
                imagePriority={resolveProductCardImagePriority(index, viewMode)}
              />
            </LazyWhenVisible>
          ))}
        </div>

        {mobileGrid}

        {loadMoreCta}
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col">
      {mobileGrid}

      <div className="hidden w-full lg:block">
        <div
          className={getProductsCatalogGridClassName(viewMode)}
          style={{
            columnGap: PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
            rowGap: rowGapPx,
          }}
        >
          {sortedProducts.map((product, index) => (
            <LazyWhenVisible
              key={product.id}
              eager={resolveProductCardEagerMount(index, viewMode)}
              minHeightPx={cardHeightPx}
              fallback={
                <ProductCardMountPlaceholder
                  variant="grid"
                  widthPx={cardWidthPx}
                  heightPx={cardHeightPx}
                />
              }
            >
              <HomeProductCard
                product={product}
                layoutWidthPx={cardWidthPx}
                layoutHeightPx={cardHeightPx}
                compactPanel={viewMode === 'grid-4'}
                disableHoverEffects={isTouchDevice}
                imagePriority={resolveProductCardImagePriority(index, viewMode)}
              />
            </LazyWhenVisible>
          ))}
        </div>
      </div>

      {loadMoreCta}
    </div>
  );
});
