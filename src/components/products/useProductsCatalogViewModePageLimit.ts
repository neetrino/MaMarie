'use client';

import { useEffect } from 'react';
import { resolveProductsCatalogPageLimit } from '../../constants/products-catalog';
import { useProductsCatalog } from './ProductsCatalogProvider';
import { useProductsCatalogViewMode } from './useProductsCatalogViewMode';

/** Keeps catalog API `limit` aligned with the active view mode (list / grid-3 / grid-4). */
export function useProductsCatalogViewModePageLimit(): void {
  const { params, updateParams } = useProductsCatalog();
  const { viewMode } = useProductsCatalogViewMode();

  useEffect(() => {
    const expectedLimit = resolveProductsCatalogPageLimit(viewMode);
    if (params.limit !== expectedLimit) {
      updateParams({ limit: expectedLimit, page: 1 });
    }
  }, [viewMode, params.limit, updateParams]);
}
