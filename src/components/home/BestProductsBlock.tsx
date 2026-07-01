'use client';

import {
  BEST_PRODUCTS_ASSETS,
  BEST_PRODUCTS_CARD_GAP_PX,
  BEST_PRODUCTS_GRID_OFFSET_TOP_PX,
  BEST_PRODUCTS_HEADING_COLOR,
  BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX,
  BEST_PRODUCTS_HEADING_PADDING_Y_PX,
  BEST_PRODUCTS_TITLE_LINE_HEIGHT_PX,
  HOME_PRODUCT_CARD_HEIGHT_PX,
  HOME_PRODUCT_CARD_WIDTH_PX,
} from '../../constants/home-sections';
import { useTranslation } from '../../lib/i18n-client';
import { LAZY_LOAD_ROOT_MARGIN_PX } from '../../constants/lazy-loading';
import { resolveProductCardEagerMount, resolveProductCardImagePriority } from '../../lib/product-card-lazy';
import { LazyWhenVisible } from '../LazyWhenVisible';
import type { HomeProductCardData } from './HomeProductCard';
import { HomeProductCard } from './HomeProductCard';
import { ProductCardMountPlaceholder } from './ProductCardMountPlaceholder';
import { HomeSectionHeadingRow } from './HomeSectionHeading';

interface BestProductsBlockProps {
  products: HomeProductCardData[];
}

export function BestProductsBlock({ products }: BestProductsBlockProps) {
  const { t } = useTranslation();

  return (
    <>
      <HomeSectionHeadingRow
        id="best-products-heading"
        title={t('home.bestProducts.title')}
        seeAllHref="/products"
        seeAllLabel={t('common.search.seeAll')}
        color={BEST_PRODUCTS_HEADING_COLOR}
        chevronSrc={BEST_PRODUCTS_ASSETS.chevronRight}
        titleLineHeightPx={BEST_PRODUCTS_TITLE_LINE_HEIGHT_PX}
        minHeightPx={BEST_PRODUCTS_HEADING_MIN_HEIGHT_PX}
        headingPaddingYPx={BEST_PRODUCTS_HEADING_PADDING_Y_PX}
      />

      <div
        className="flex w-full overflow-x-auto pb-8 lg:overflow-visible"
        style={{
          paddingTop: BEST_PRODUCTS_GRID_OFFSET_TOP_PX,
          gap: BEST_PRODUCTS_CARD_GAP_PX,
        }}
      >
        {products.map((product, index) => (
          <LazyWhenVisible
            key={product.id}
            eager={resolveProductCardEagerMount(index, 'grid-4')}
            minHeightPx={HOME_PRODUCT_CARD_HEIGHT_PX}
            prefetchHorizontalPx={LAZY_LOAD_ROOT_MARGIN_PX}
            fallback={
              <ProductCardMountPlaceholder
                variant="grid"
                widthPx={HOME_PRODUCT_CARD_WIDTH_PX}
                heightPx={HOME_PRODUCT_CARD_HEIGHT_PX}
              />
            }
          >
            <HomeProductCard
              product={product}
              imagePriority={resolveProductCardImagePriority(index, 'grid-4')}
            />
          </LazyWhenVisible>
        ))}
      </div>
    </>
  );
}
