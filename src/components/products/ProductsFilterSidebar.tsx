'use client';

import { Suspense } from 'react';
import { useTranslation } from '../../lib/i18n-client';
import { CategoryFilter } from '../CategoryFilter';
import { BrandFilter } from '../BrandFilter';
import { ColorFilter } from '../ColorFilter';
import { PriceFilter } from '../PriceFilter';
import { SizeFilter } from '../SizeFilter';
import {
  PRODUCTS_CATALOG_CTA_BG,
  PRODUCTS_CATALOG_CTA_HEIGHT_PX,
  PRODUCTS_CATALOG_CTA_INSET_SHADOW,
  PRODUCTS_CATALOG_CTA_WIDTH_PX,
  PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
  PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX,
} from '../../constants/products-catalog';
import { useProductsCatalog } from './ProductsCatalogProvider';
import { useProductsCatalogFilterNavigation } from './useProductsCatalogFilterNavigation';
import { ProductsFilterSection } from './ProductsFilterSection';

function ProductsFilterSidebarContent() {
  const { params } = useProductsCatalog();
  const { clearFilters } = useProductsCatalogFilterNavigation();
  const { t } = useTranslation();

  return (
    <aside
      className="hidden shrink-0 self-start lg:sticky lg:top-24 lg:z-10 lg:block"
      style={{ width: PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX }}
    >
      <div className="flex flex-col items-center gap-[18px]">
        <div className="flex w-full flex-col gap-5">
          <ProductsFilterSection title={t('products.catalog.filters.category')}>
            <CategoryFilter currentCategory={params.category} variant="catalog" />
          </ProductsFilterSection>

          <ProductsFilterSection title={t('products.catalog.filters.size')}>
            <SizeFilter
              category={params.category}
              search={params.search}
              minPrice={params.minPrice}
              maxPrice={params.maxPrice}
              variant="catalog"
            />
          </ProductsFilterSection>

          <ProductsFilterSection title={t('products.catalog.filters.brand')}>
            <BrandFilter
              category={params.category}
              search={params.search}
              minPrice={params.minPrice}
              maxPrice={params.maxPrice}
              variant="catalog"
            />
          </ProductsFilterSection>

          <ProductsFilterSection title={t('products.catalog.filters.price')}>
            <PriceFilter
              currentMinPrice={params.minPrice}
              currentMaxPrice={params.maxPrice}
              category={params.category}
              search={params.search}
              variant="catalog"
            />
          </ProductsFilterSection>

          <ProductsFilterSection title={t('products.catalog.filters.color')}>
            <ColorFilter
              category={params.category}
              search={params.search}
              minPrice={params.minPrice}
              maxPrice={params.maxPrice}
              variant="catalog"
            />
          </ProductsFilterSection>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center justify-center font-bold text-white transition-opacity hover:opacity-90"
          style={{
            width: PRODUCTS_CATALOG_CTA_WIDTH_PX,
            height: PRODUCTS_CATALOG_CTA_HEIGHT_PX,
            borderRadius: 9999,
            backgroundColor: PRODUCTS_CATALOG_CTA_BG,
            boxShadow: PRODUCTS_CATALOG_CTA_INSET_SHADOW,
            fontSize: PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
          }}
        >
          {t('products.catalog.cancelFilters')}
        </button>
      </div>
    </aside>
  );
}

export function ProductsFilterSidebar() {
  return (
    <Suspense
      fallback={
        <aside
          className="hidden shrink-0 animate-pulse lg:block"
          style={{ width: PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX }}
          aria-hidden
        >
          <div className="flex flex-col gap-5">
            <div className="h-28 rounded-2xl bg-neutral-200" />
            <div className="h-36 rounded-2xl bg-neutral-200" />
            <div className="h-72 rounded-2xl bg-neutral-200" />
            <div className="h-32 rounded-2xl bg-neutral-200" />
          </div>
        </aside>
      }
    >
      <ProductsFilterSidebarContent />
    </Suspense>
  );
}
