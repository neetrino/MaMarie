'use client';

import { useState, useEffect } from 'react';
import {
  PRODUCTS_CATALOG_CARD_HEIGHT_PX,
  PRODUCTS_CATALOG_CARD_WIDTH_PX,
  RELATED_PRODUCTS_CARD_GAP_PX,
  RELATED_PRODUCTS_GRID_OFFSET_TOP_PX,
  RELATED_PRODUCTS_MOBILE_GRID_OFFSET_TOP_PX,
  RELATED_PRODUCTS_MOBILE_HEADING_MIN_HEIGHT_PX,
  RELATED_PRODUCTS_MOBILE_TITLE_FONT_SIZE_PX,
  RELATED_PRODUCTS_MOBILE_TITLE_LINE_HEIGHT_PX,
  RELATED_PRODUCTS_MOBILE_TITLE_MAX_LINES,
} from '../constants/products-catalog';
import {
  MOBILE_PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX,
} from '../constants/mobile-products-catalog';
import {
  BEST_PRODUCTS_ASSETS,
  BEST_PRODUCTS_HEADING_COLOR,
  BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX,
  BEST_PRODUCTS_HEADING_PADDING_Y_PX,
  BEST_PRODUCTS_TITLE_LINE_HEIGHT_PX,
} from '../constants/home-sections';
import { getStoredLanguage, type LanguageCode } from '../lib/language';
import { t } from '../lib/i18n';
import { LAZY_LOAD_ROOT_MARGIN_PX } from '../constants/lazy-loading';
import { resolveProductCardEagerMount, resolveProductCardImagePriority } from '../lib/product-card-lazy';
import { HomeSectionHeadingRow } from './home/HomeSectionHeading';
import { ProductCardMountPlaceholder } from './home/ProductCardMountPlaceholder';
import { LazyWhenVisible } from './LazyWhenVisible';
import { useRelatedProducts } from './hooks/useRelatedProducts';
import { RelatedProductCard } from './RelatedProducts/RelatedProductCard';
import { RelatedProductMobileCard } from './RelatedProducts/RelatedProductMobileCard';

interface RelatedProductsProps {
  categorySlug?: string;
  currentProductId: string;
  /** PDP: use dedicated related endpoint + cache (server resolves category). */
  productSlug?: string;
}

const DESKTOP_RELATED_ROW_CLASS =
  'scrollbar-hide hidden snap-x snap-mandatory overflow-x-auto overflow-y-visible pb-6 lg:flex';

const MOBILE_RELATED_ROW_CLASS =
  'scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overflow-y-visible pb-6 lg:hidden';

/**
 * Related products — desktop horizontal shop cards; mobile horizontal row with shop catalog cards.
 */
export function RelatedProducts({ categorySlug, currentProductId, productSlug }: RelatedProductsProps) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const { products, loading } = useRelatedProducts({
    categorySlug,
    currentProductId,
    language,
    productSlug,
  });

  useEffect(() => {
    setLanguage(getStoredLanguage());

    const handleLanguageUpdate = () => {
      setLanguage(getStoredLanguage());
    };

    window.addEventListener('language-updated', handleLanguageUpdate);
    return () => {
      window.removeEventListener('language-updated', handleLanguageUpdate);
    };
  }, []);

  const desktopRowStyle = {
    gap: RELATED_PRODUCTS_CARD_GAP_PX,
    paddingTop: RELATED_PRODUCTS_GRID_OFFSET_TOP_PX,
  } as const;

  const mobileRowStyle = {
    gap: MOBILE_PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
    paddingTop: RELATED_PRODUCTS_MOBILE_GRID_OFFSET_TOP_PX,
  } as const;

  const addToCartLabel = t(language, 'common.wishlist.addToCart');

  return (
    <section className="mt-12 border-t border-gray-200 py-8 lg:mt-20 lg:py-12">
      <HomeSectionHeadingRow
        id="related-products-heading"
        title={t(language, 'product.related_products_title')}
        seeAllHref="/products"
        seeAllLabel=""
        color={BEST_PRODUCTS_HEADING_COLOR}
        chevronSrc={BEST_PRODUCTS_ASSETS.chevronRight}
        titleLineHeightPx={BEST_PRODUCTS_TITLE_LINE_HEIGHT_PX}
        minHeightPx={BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX}
        headingPaddingYPx={BEST_PRODUCTS_HEADING_PADDING_Y_PX}
        mobileTitleFontSizePx={RELATED_PRODUCTS_MOBILE_TITLE_FONT_SIZE_PX}
        mobileTitleLineHeightPx={RELATED_PRODUCTS_MOBILE_TITLE_LINE_HEIGHT_PX}
        mobileMinHeightPx={RELATED_PRODUCTS_MOBILE_HEADING_MIN_HEIGHT_PX}
        mobileTitleMaxLines={RELATED_PRODUCTS_MOBILE_TITLE_MAX_LINES}
        showSeeAllLink={false}
      />

      {loading ? (
        <>
          <div className={`${MOBILE_RELATED_ROW_CLASS} w-full min-w-0`} style={mobileRowStyle}>
            {[1, 2, 3].map((index) => (
              <div
                key={`mobile-related-skeleton-${index}`}
                className="shrink-0 animate-pulse rounded-[30px] bg-gray-100"
                style={{
                  width: MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX,
                  height: MOBILE_PRODUCTS_CATALOG_CARD_HEIGHT_PX,
                }}
              />
            ))}
          </div>
          <div className={DESKTOP_RELATED_ROW_CLASS} style={desktopRowStyle}>
            {[1, 2, 3, 4].map((index) => (
              <div
                key={`desktop-related-skeleton-${index}`}
                className="shrink-0 animate-pulse rounded-[30px] bg-gray-100"
                style={{
                  width: PRODUCTS_CATALOG_CARD_WIDTH_PX,
                  height: PRODUCTS_CATALOG_CARD_HEIGHT_PX,
                }}
              />
            ))}
          </div>
        </>
      ) : products.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">{t(language, 'product.noRelatedProducts')}</p>
        </div>
      ) : (
        <>
          <div className={`${MOBILE_RELATED_ROW_CLASS} w-full min-w-0`} style={mobileRowStyle}>
            {products.map((product, index) => (
              <LazyWhenVisible
                key={product.id}
                eager={resolveProductCardEagerMount(index, 'grid-4')}
                minHeightPx={MOBILE_PRODUCTS_CATALOG_CARD_HEIGHT_PX}
                prefetchHorizontalPx={LAZY_LOAD_ROOT_MARGIN_PX}
                className="shrink-0 snap-start"
                fallback={
                  <ProductCardMountPlaceholder
                    variant="grid"
                    widthPx={MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX}
                    heightPx={MOBILE_PRODUCTS_CATALOG_CARD_HEIGHT_PX}
                  />
                }
              >
                <RelatedProductMobileCard
                  product={product}
                  imagePriority={resolveProductCardImagePriority(index, 'grid-4')}
                  addToCartLabel={addToCartLabel}
                />
              </LazyWhenVisible>
            ))}
          </div>

          <div className={DESKTOP_RELATED_ROW_CLASS} style={desktopRowStyle}>
            {products.map((product, index) => (
              <LazyWhenVisible
                key={product.id}
                eager={resolveProductCardEagerMount(index, 'grid-4')}
                minHeightPx={PRODUCTS_CATALOG_CARD_HEIGHT_PX}
                prefetchHorizontalPx={LAZY_LOAD_ROOT_MARGIN_PX}
                className="shrink-0 snap-start"
                fallback={
                  <div className="shrink-0 snap-start" style={{ width: PRODUCTS_CATALOG_CARD_WIDTH_PX }}>
                    <ProductCardMountPlaceholder
                      variant="grid"
                      widthPx={PRODUCTS_CATALOG_CARD_WIDTH_PX}
                      heightPx={PRODUCTS_CATALOG_CARD_HEIGHT_PX}
                    />
                  </div>
                }
              >
                <RelatedProductCard
                  product={product}
                  imagePriority={resolveProductCardImagePriority(index, 'grid-4')}
                />
              </LazyWhenVisible>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
