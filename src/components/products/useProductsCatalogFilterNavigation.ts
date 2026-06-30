'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ProductsCatalogParams } from '../../lib/products-catalog-params';
import { useOptionalProductsCatalog } from './ProductsCatalogProvider';

/**
 * Applies catalog filter changes via client fetch when inside ProductsCatalogProvider,
 * otherwise falls back to lightweight router.replace navigation.
 */
export function useProductsCatalogFilterNavigation() {
  const catalog = useOptionalProductsCatalog();
  const router = useRouter();
  const searchParams = useSearchParams();

  const applyPatch = useCallback(
    (patch: Partial<ProductsCatalogParams>, resetPage = true) => {
      if (catalog) {
        catalog.updateParams(patch, { resetPage });
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      if (resetPage) {
        params.delete('page');
      }
      const query = params.toString();
      router.replace(query ? `/products?${query}` : '/products', { scroll: false });
    },
    [catalog, router, searchParams]
  );

  const clearFilters = useCallback(() => {
    if (catalog) {
      catalog.clearFilters();
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const filterKeys = [
      'search',
      'category',
      'minPrice',
      'maxPrice',
      'colors',
      'sizes',
      'brand',
      'clothingTypes',
    ];
    filterKeys.forEach((key) => params.delete(key));
    params.delete('page');
    const query = params.toString();
    router.replace(query ? `/products?${query}` : '/products', { scroll: false });
  }, [catalog, router, searchParams]);

  return { applyPatch, clearFilters, catalog };
}
