'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '../../lib/i18n-client';
import { CategoryFilter } from '../CategoryFilter';
import { ColorFilter } from '../ColorFilter';
import { PriceFilter } from '../PriceFilter';
import { SizeFilter } from '../SizeFilter';
import {
  PRODUCTS_CATALOG_CTA_BG,
  PRODUCTS_CATALOG_CTA_HEIGHT_PX,
  PRODUCTS_CATALOG_CTA_INSET_SHADOW,
  PRODUCTS_CATALOG_CTA_WIDTH_PX,
  PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX,
} from '../../constants/products-catalog';
import { ProductsFilterSection } from './ProductsFilterSection';

interface ProductsFilterSidebarProps {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  selectedColors: string[];
  selectedSizes: string[];
}

function ProductsFilterSidebarContent({
  category,
  search,
  minPrice,
  maxPrice,
  selectedColors,
  selectedSizes,
}: ProductsFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const filterKeys = ['search', 'category', 'minPrice', 'maxPrice', 'colors', 'sizes', 'brand'];
    filterKeys.forEach((key) => params.delete(key));
    params.delete('page');
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : '/products');
  };

  return (
    <aside
      className="hidden shrink-0 self-start lg:sticky lg:top-24 lg:z-10 lg:block"
      style={{ width: PRODUCTS_CATALOG_SIDEBAR_WIDTH_PX }}
    >
      <div className="flex flex-col items-center gap-[18px]">
        <div className="flex w-full flex-col gap-5">
          <ProductsFilterSection title={t('products.catalog.filters.category')}>
            <CategoryFilter currentCategory={category} variant="catalog" />
          </ProductsFilterSection>

          <ProductsFilterSection title={t('products.catalog.filters.size')}>
            <SizeFilter
              category={category}
              search={search}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedSizes={selectedSizes}
              variant="catalog"
            />
          </ProductsFilterSection>

          <ProductsFilterSection title={t('products.catalog.filters.price')}>
            <PriceFilter
              currentMinPrice={minPrice}
              currentMaxPrice={maxPrice}
              category={category}
              search={search}
              variant="catalog"
            />
          </ProductsFilterSection>

          <ProductsFilterSection title={t('products.catalog.filters.color')}>
            <ColorFilter
              category={category}
              search={search}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedColors={selectedColors}
              variant="catalog"
            />
          </ProductsFilterSection>
        </div>

        <button
          type="button"
          onClick={handleClearFilters}
          className="flex items-center justify-center font-bold text-white transition-opacity hover:opacity-90"
          style={{
            width: PRODUCTS_CATALOG_CTA_WIDTH_PX,
            height: PRODUCTS_CATALOG_CTA_HEIGHT_PX,
            borderRadius: 9999,
            backgroundColor: PRODUCTS_CATALOG_CTA_BG,
            boxShadow: PRODUCTS_CATALOG_CTA_INSET_SHADOW,
          }}
        >
          {t('products.catalog.cancelFilters')}
        </button>
      </div>
    </aside>
  );
}

export function ProductsFilterSidebar(props: ProductsFilterSidebarProps) {
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
            <div className="h-32 rounded-2xl bg-neutral-200" />
          </div>
        </aside>
      }
    >
      <ProductsFilterSidebarContent {...props} />
    </Suspense>
  );
}
