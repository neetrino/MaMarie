'use client';

import { useMemo } from 'react';
import { useTranslation } from '../../lib/i18n-client';
import { mapToHomeProductCard } from '../../components/home/best-products-data';
import { HomeProductCard } from '../../components/home/HomeProductCard';
import { ProductCardMountPlaceholder } from '../../components/home/ProductCardMountPlaceholder';
import { HomeSectionHeadingRow } from '../../components/home/HomeSectionHeading';
import { MobileWishlistProductGrid } from '../../components/wishlist/MobileWishlistProductGrid';
import { useWishlistProducts } from '../../components/wishlist/useWishlistProducts';
import { WishlistEmptyState } from '../../components/wishlist/WishlistEmptyState';
import {
  BEST_PRODUCTS_ASSETS,
  BEST_PRODUCTS_GRID_OFFSET_TOP_PX,
  BEST_PRODUCTS_HEADING_COLOR,
  BEST_PRODUCTS_HEADING_PADDING_Y_PX,
} from '../../constants/home-sections';
import {
  MOBILE_WISHLIST_PAGE_BG,
  MOBILE_WISHLIST_PAGE_HORIZONTAL_PADDING_PX,
  MOBILE_WISHLIST_PAGE_PADDING_BOTTOM_PX,
  MOBILE_WISHLIST_PAGE_PADDING_TOP_PX,
  WISHLIST_DESKTOP_GRID_CLASS,
} from '../../constants/mobile-wishlist';
import {
  PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
} from '../../constants/products-catalog';
import {
  WISHLIST_CARD_HEIGHT_PX,
  WISHLIST_CARD_ROW_GAP_PX,
  WISHLIST_CARD_WIDTH_PX,
  WISHLIST_EMPTY_TITLE_MARGIN_BOTTOM_PX,
  WISHLIST_PAGE_HEADING_MIN_HEIGHT_PX,
  WISHLIST_PAGE_MOBILE_HEADING_MIN_HEIGHT_PX,
  WISHLIST_PAGE_MOBILE_TITLE_FONT_SIZE_PX,
  WISHLIST_PAGE_MOBILE_TITLE_LINE_HEIGHT_PX,
  WISHLIST_PAGE_MOBILE_TITLE_MAX_LINES,
  WISHLIST_PAGE_TITLE_FONT_SIZE_PX,
  WISHLIST_PAGE_TITLE_LINE_HEIGHT_PX,
} from '../../constants/wishlist-empty-state';

/**
 * Wishlist page that shows saved products using the shared catalog product cards.
 */
export default function WishlistPage() {
  const { t } = useTranslation();
  const { products, wishlistIds, loading } = useWishlistProducts();

  const cardProducts = useMemo(
    () => products.map(mapToHomeProductCard),
    [products],
  );

  const hasSavedItems = wishlistIds.length > 0;
  const showEmptyState = !loading && products.length === 0 && !hasSavedItems;
  const gridItemCount = loading && cardProducts.length === 0 ? wishlistIds.length : cardProducts.length;

  return (
    <>
      <div
        className="mobile-wishlist-page w-full max-w-full overflow-x-hidden lg:hidden"
        style={{
          paddingTop: MOBILE_WISHLIST_PAGE_PADDING_TOP_PX,
          paddingBottom: MOBILE_WISHLIST_PAGE_PADDING_BOTTOM_PX,
          paddingLeft: MOBILE_WISHLIST_PAGE_HORIZONTAL_PADDING_PX,
          paddingRight: MOBILE_WISHLIST_PAGE_HORIZONTAL_PADDING_PX,
          backgroundColor: MOBILE_WISHLIST_PAGE_BG,
        }}
      >
        <div
          style={
            showEmptyState
              ? { marginBottom: WISHLIST_EMPTY_TITLE_MARGIN_BOTTOM_PX }
              : undefined
          }
        >
          <HomeSectionHeadingRow
            id="wishlist-heading-mobile"
            title={t('common.wishlist.title')}
            seeAllHref="/products"
            seeAllLabel=""
            color={BEST_PRODUCTS_HEADING_COLOR}
            chevronSrc={BEST_PRODUCTS_ASSETS.chevronRight}
            titleFontSizePx={WISHLIST_PAGE_TITLE_FONT_SIZE_PX}
            titleLineHeightPx={WISHLIST_PAGE_TITLE_LINE_HEIGHT_PX}
            minHeightPx={WISHLIST_PAGE_HEADING_MIN_HEIGHT_PX}
            mobileTitleFontSizePx={WISHLIST_PAGE_MOBILE_TITLE_FONT_SIZE_PX}
            mobileTitleLineHeightPx={WISHLIST_PAGE_MOBILE_TITLE_LINE_HEIGHT_PX}
            mobileMinHeightPx={WISHLIST_PAGE_MOBILE_HEADING_MIN_HEIGHT_PX}
            mobileTitleMaxLines={WISHLIST_PAGE_MOBILE_TITLE_MAX_LINES}
            headingPaddingYPx={BEST_PRODUCTS_HEADING_PADDING_Y_PX}
            showSeeAllLink={false}
          />
        </div>

        {showEmptyState ? (
          <WishlistEmptyState t={t} />
        ) : gridItemCount > 0 ? (
          <MobileWishlistProductGrid
            products={cardProducts}
            loading={loading}
            placeholderCount={wishlistIds.length}
            addToCartLabel={t('common.wishlist.addToCart')}
          />
        ) : null}
      </div>

      <div className="mx-auto hidden max-w-7xl px-4 py-12 sm:px-6 lg:block lg:px-8">
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
              className={WISHLIST_DESKTOP_GRID_CLASS}
              style={{
                columnGap: PRODUCTS_CATALOG_CARD_COLUMN_GAP_PX,
                rowGap: WISHLIST_CARD_ROW_GAP_PX,
              }}
            >
              {cardProducts.map((product) => (
                <HomeProductCard
                  key={product.id}
                  product={product}
                  layoutWidthPx={WISHLIST_CARD_WIDTH_PX}
                  layoutHeightPx={WISHLIST_CARD_HEIGHT_PX}
                  imagePriority
                />
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
    </>
  );
}
