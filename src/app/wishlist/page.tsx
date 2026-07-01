'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '../../lib/api-client';
import { getStoredLanguage } from '../../lib/language';
import { useTranslation } from '../../lib/i18n-client';
import { WISHLIST_KEY } from '../../lib/storageCounts';
import { logger } from '../../lib/utils/logger';
import { resolveProductCardEagerMount, resolveProductCardImagePriority } from '../../lib/product-card-lazy';
import type { WishlistUpdatedDetail } from '../../components/hooks/useWishlist';
import { WishlistEmptyState } from '../../components/wishlist/WishlistEmptyState';
import { HomeSectionHeadingRow } from '../../components/home/HomeSectionHeading';
import { mapToHomeProductCard } from '../../components/home/best-products-data';
import { HomeProductCard } from '../../components/home/HomeProductCard';
import { ProductCardMountPlaceholder } from '../../components/home/ProductCardMountPlaceholder';
import { LazyWhenVisible } from '../../components/LazyWhenVisible';
import {
  BEST_PRODUCTS_ASSETS,
  BEST_PRODUCTS_GRID_OFFSET_TOP_PX,
  BEST_PRODUCTS_HEADING_COLOR,
  BEST_PRODUCTS_HEADING_PADDING_Y_PX,
} from '../../constants/home-sections';
import {
  PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
  getProductsCatalogGridClassName,
} from '../../constants/products-catalog';
import {
  WISHLIST_CARD_HEIGHT_PX,
  WISHLIST_CARD_ROW_GAP_PX,
  WISHLIST_CARD_WIDTH_PX,
  WISHLIST_EMPTY_TITLE_MARGIN_BOTTOM_PX,
  WISHLIST_PAGE_HEADING_MIN_HEIGHT_PX,
  WISHLIST_PAGE_TITLE_FONT_SIZE_PX,
  WISHLIST_PAGE_TITLE_LINE_HEIGHT_PX,
} from '../../constants/wishlist-empty-state';
import type {
  ProductColorOption,
  ProductSizeOption,
} from '../../lib/services/product-variant-attributes';

interface WishlistProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice: number | null;
  compareAtPrice: number | null;
  discountPercent: number | null;
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

const WISHLIST_VIEW_MODE = 'wishlist-grid-4' as const;

function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Wishlist page that shows saved products using the shared catalog product cards.
 */
export default function WishlistPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistProducts = useCallback(async (idsToLoad: string[]) => {
    if (idsToLoad.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const languagePreference = getStoredLanguage();
      const response = await apiClient.get<{
        data: WishlistProduct[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>('/api/v1/products', {
        params: {
          ids: idsToLoad.join(','),
          limit: String(idsToLoad.length),
          lang: languagePreference,
        },
      });

      const productById = new Map(response.data.map((product) => [product.id, product]));
      const wishlistProducts = idsToLoad
        .map((id) => productById.get(id))
        .filter((product): product is WishlistProduct => product !== undefined);
      setProducts(wishlistProducts);

      const normalizedIds = wishlistProducts.map((product) => product.id);
      if (normalizedIds.length !== idsToLoad.length) {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(normalizedIds));
        window.dispatchEvent(
          new CustomEvent<WishlistUpdatedDetail>('wishlist-updated', {
            detail: {
              ids: normalizedIds,
              count: normalizedIds.length,
            },
          }),
        );
      }
    } catch (error) {
      logger.error('[Wishlist] Error fetching wishlist products', { error });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ids = getWishlist();
    setWishlistIds(ids);
    void fetchWishlistProducts(ids);

    const handleWishlistUpdate = (event: Event) => {
      const wishlistDetail = (event as CustomEvent<WishlistUpdatedDetail | null>).detail;
      const updatedIds = wishlistDetail?.ids ?? getWishlist();
      setWishlistIds(updatedIds);

      setProducts((prev) => {
        const filtered = prev.filter((product) => updatedIds.includes(product.id));
        const knownIds = new Set(prev.map((product) => product.id));
        if (updatedIds.some((id) => !knownIds.has(id))) {
          void fetchWishlistProducts(updatedIds);
        }
        return filtered;
      });
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, [fetchWishlistProducts]);

  const cardProducts = useMemo(
    () => products.map(mapToHomeProductCard),
    [products],
  );

  const hasSavedItems = wishlistIds.length > 0;
  const showEmptyState = !loading && products.length === 0 && !hasSavedItems;
  const gridItemCount = loading && cardProducts.length === 0 ? wishlistIds.length : cardProducts.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        style={
          showEmptyState
            ? { marginBottom: WISHLIST_EMPTY_TITLE_MARGIN_BOTTOM_PX }
            : undefined
        }
      >
        <HomeSectionHeadingRow
          id="wishlist-heading"
          title={t('common.wishlist.title')}
          seeAllHref="/products"
          seeAllLabel=""
          color={BEST_PRODUCTS_HEADING_COLOR}
          chevronSrc={BEST_PRODUCTS_ASSETS.chevronRight}
          titleFontSizePx={WISHLIST_PAGE_TITLE_FONT_SIZE_PX}
          titleLineHeightPx={WISHLIST_PAGE_TITLE_LINE_HEIGHT_PX}
          minHeightPx={WISHLIST_PAGE_HEADING_MIN_HEIGHT_PX}
          headingPaddingYPx={BEST_PRODUCTS_HEADING_PADDING_Y_PX}
          showSeeAllLink={false}
        />
      </div>

      {showEmptyState ? (
        <WishlistEmptyState t={t} />
      ) : gridItemCount > 0 ? (
        <div className="w-full" style={{ paddingTop: BEST_PRODUCTS_GRID_OFFSET_TOP_PX }} aria-busy={loading}>
          <div
            className={getProductsCatalogGridClassName('grid-4')}
            style={{
              columnGap: PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
              rowGap: WISHLIST_CARD_ROW_GAP_PX,
            }}
          >
            {cardProducts.map((product, index) => (
              <LazyWhenVisible
                key={product.id}
                eager={resolveProductCardEagerMount(index, WISHLIST_VIEW_MODE)}
                minHeightPx={WISHLIST_CARD_HEIGHT_PX}
                fallback={
                  <ProductCardMountPlaceholder
                    variant="grid"
                    widthPx={WISHLIST_CARD_WIDTH_PX}
                    heightPx={WISHLIST_CARD_HEIGHT_PX}
                  />
                }
              >
                <HomeProductCard
                  product={product}
                  layoutWidthPx={WISHLIST_CARD_WIDTH_PX}
                  layoutHeightPx={WISHLIST_CARD_HEIGHT_PX}
                  imagePriority={resolveProductCardImagePriority(index, WISHLIST_VIEW_MODE)}
                />
              </LazyWhenVisible>
            ))}

            {loading && cardProducts.length === 0
              ? wishlistIds.map((id) => (
                  <ProductCardMountPlaceholder
                    key={`wishlist-placeholder-${id}`}
                    variant="grid"
                    widthPx={WISHLIST_CARD_WIDTH_PX}
                    heightPx={WISHLIST_CARD_HEIGHT_PX}
                  />
                ))
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
