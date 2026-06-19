'use client';

import {
  BEST_PRODUCTS_ASSETS,
  BEST_PRODUCTS_CARD_GAP_PX,
  BEST_PRODUCTS_GRID_OFFSET_TOP_PX,
  BEST_PRODUCTS_HEADING_COLOR,
} from '../../constants/home-sections';
import { useTranslation } from '../../lib/i18n-client';
import type { HomeProductCardData } from './HomeProductCard';
import { HomeProductCard } from './HomeProductCard';
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
      />

      <div
        className="flex w-full overflow-x-auto pb-8 lg:overflow-visible"
        style={{
          paddingTop: BEST_PRODUCTS_GRID_OFFSET_TOP_PX,
          gap: BEST_PRODUCTS_CARD_GAP_PX,
        }}
      >
        {products.map((product) => (
          <HomeProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
