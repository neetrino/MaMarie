'use client';

import type { ReactNode } from 'react';
import { ProductsFiltersProvider } from '../ProductsFiltersProvider';
import { useProductsCatalog } from './ProductsCatalogProvider';

interface ProductsFiltersProviderBridgeProps {
  children: ReactNode;
}

/** Keeps sidebar filter options in sync with active catalog params. */
export function ProductsFiltersProviderBridge({ children }: ProductsFiltersProviderBridgeProps) {
  const { params } = useProductsCatalog();

  return (
    <ProductsFiltersProvider
      category={params.category}
      search={params.search}
      minPrice={params.minPrice}
      maxPrice={params.maxPrice}
    >
      {children}
    </ProductsFiltersProvider>
  );
}
