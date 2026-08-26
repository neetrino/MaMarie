'use client';

import { CategoryFilter } from '../CategoryFilter';
import { BrandFilter } from '../BrandFilter';
import { CatalogAttributeFilter } from '../CatalogAttributeFilter';
import { ColorFilter } from '../ColorFilter';
import { PriceFilter } from '../PriceFilter';
import { SizeFilter } from '../SizeFilter';
import { useTranslation } from '../../lib/i18n-client';
import { useProductsFilters } from '../ProductsFiltersProvider';
import { useProductsCatalog } from './ProductsCatalogProvider';
import { ProductsFilterSection } from './ProductsFilterSection';

export function ProductsCatalogFilterFields() {
  const { params } = useProductsCatalog();
  const { t } = useTranslation();
  const extraAttributes = useProductsFilters()?.data?.attributes ?? [];

  return (
    <>
      <ProductsFilterSection title={t('products.catalog.filters.category')}>
        <CategoryFilter
          currentCategory={params.category}
          categoryScope={params.categoryScope}
          variant="catalog"
        />
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

      {extraAttributes.map((group) => (
        <ProductsFilterSection key={group.key} title={group.name}>
          <CatalogAttributeFilter attributeKey={group.key} values={group.values} />
        </ProductsFilterSection>
      ))}
    </>
  );
}
