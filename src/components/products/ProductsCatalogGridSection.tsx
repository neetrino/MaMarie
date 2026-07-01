'use client';

import { ProductsGrid } from '../ProductsGrid';
import { useTranslation } from '../../lib/i18n-client';
import {
  PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
  PRODUCTS_CATALOG_CARD_ROW_GAP_PX,
  PRODUCTS_CATALOG_CARD_HEIGHT_GRID4_PX,
  PRODUCTS_CATALOG_CARD_HEIGHT_PX,
  PRODUCTS_CATALOG_CARD_WIDTH_GRID4_PX,
  PRODUCTS_CATALOG_CARD_WIDTH_PX,
  PRODUCTS_CATALOG_GRID_OFFSET_TOP_PX,
  PRODUCTS_CATALOG_LIST_ROW_GAP_PX,
  PRODUCTS_CATALOG_LIST_ROW_HEIGHT_PX,
  PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX,
  getProductsCatalogGridClassName,
} from '../../constants/products-catalog';
import { useProductsCatalogViewMode } from './useProductsCatalogViewMode';
import { useProductsCatalogViewModePageLimit } from './useProductsCatalogViewModePageLimit';
import { useProductsCatalog } from './ProductsCatalogProvider';

const PRODUCTS_CATALOG_LOADING_CARD_COUNT = 6;

function ProductsCatalogGridLoading() {
  const { viewMode } = useProductsCatalogViewMode();
  const isListView = viewMode === 'list';
  const cardWidthPx =
    viewMode === 'grid-4' ? PRODUCTS_CATALOG_CARD_WIDTH_GRID4_PX : PRODUCTS_CATALOG_CARD_WIDTH_PX;
  const cardHeightPx =
    viewMode === 'grid-4' ? PRODUCTS_CATALOG_CARD_HEIGHT_GRID4_PX : PRODUCTS_CATALOG_CARD_HEIGHT_PX;

  return (
    <div
      className={getProductsCatalogGridClassName(viewMode)}
      style={
        isListView
          ? { gap: PRODUCTS_CATALOG_LIST_ROW_GAP_PX }
          : {
              columnGap: PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
              rowGap: PRODUCTS_CATALOG_CARD_ROW_GAP_PX,
            }
      }
      aria-busy="true"
      aria-label="Loading filtered products"
    >
      {Array.from({ length: PRODUCTS_CATALOG_LOADING_CARD_COUNT }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-[#f9e490]/60"
          style={
            isListView
              ? {
                  width: '100%',
                  height: PRODUCTS_CATALOG_LIST_ROW_HEIGHT_PX,
                  borderRadius: PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX,
                }
              : { width: cardWidthPx, height: cardHeightPx, borderRadius: 30 }
          }
        />
      ))}
    </div>
  );
}

function ProductsCatalogInlineUpdating() {
  const { t } = useTranslation();

  return (
    <div
      className="mb-3 flex items-center gap-2 text-sm text-[#757571]"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-[#f9e490] border-t-transparent"
        aria-hidden
      />
      <span>{t('common.messages.loading')}</span>
    </div>
  );
}

export function ProductsCatalogGridSection() {
  const { t } = useTranslation();
  useProductsCatalogViewModePageLimit();
  const {
    products,
    meta,
    params,
    isFetching,
    isOptimistic,
    isServerOnlyFetch,
    gridRevision,
    sortBy,
    updateParams,
  } = useProductsCatalog();
  const hasMore = !isOptimistic && params.page < meta.totalPages;

  const handleLoadMore = () => {
    if (!hasMore || isFetching) {
      return;
    }
    updateParams({ page: params.page + 1 }, { resetPage: false, append: true });
  };

  const showStaleGrid = products.length > 0;
  const showInitialLoading = isFetching && !showStaleGrid && !isOptimistic;
  const showBlockingOverlay = isFetching && showStaleGrid && !isOptimistic && !isServerOnlyFetch;
  const showInlineUpdating = isFetching && showStaleGrid && !isOptimistic && isServerOnlyFetch;

  return (
    <div
      className="relative"
      style={{ paddingTop: PRODUCTS_CATALOG_GRID_OFFSET_TOP_PX }}
      aria-busy={isFetching}
    >
      {showInlineUpdating ? <ProductsCatalogInlineUpdating /> : null}

      {showBlockingOverlay ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-white/50 backdrop-blur-[1px]"
          aria-hidden
        />
      ) : null}

      {showInitialLoading ? (
        <ProductsCatalogGridLoading />
      ) : showStaleGrid ? (
        <div key={gridRevision} className="animate-catalog-grid-in">
          <ProductsGrid
            products={products}
            sortBy={sortBy}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            isLoadingMore={isFetching && params.page > 1 && !isOptimistic}
          />
        </div>
      ) : (
        <div key={gridRevision} className="animate-catalog-grid-in py-12 text-center">
          <p className="text-lg text-[#757571]">{t('common.messages.noProductsFound')}</p>
        </div>
      )}
    </div>
  );
}
