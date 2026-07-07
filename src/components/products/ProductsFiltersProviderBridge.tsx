'use client';

import type { ReactNode } from 'react';
import { ProductsFiltersProvider, type ProductsFiltersData } from '../ProductsFiltersProvider';
import { useProductsCatalog } from './ProductsCatalogProvider';

interface ProductsFiltersProviderBridgeProps {
  initialFilters?: ProductsFiltersData | null;
  children: ReactNode;
}

/** Keeps sidebar filter options in sync with active catalog params. */
export function ProductsFiltersProviderBridge({
  initialFilters = null,
  children,
}: ProductsFiltersProviderBridgeProps) {
  const { params } = useProductsCatalog();

  return (
    <ProductsFiltersProvider
      category={params.category}
      search={params.search}
      minPrice={params.minPrice}
      maxPrice={params.maxPrice}
      initialData={initialFilters}
    >
      {children}
    </ProductsFiltersProvider>
  );
}
