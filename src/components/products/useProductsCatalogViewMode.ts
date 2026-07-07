'use client';

import { useEffect, useState } from 'react';
import {
  PRODUCTS_CATALOG_DEFAULT_VIEW_MODE,
  type ProductsCatalogViewMode,
} from '../../constants/products-catalog';
import {
  persistProductsCatalogViewMode,
  readStoredProductsCatalogViewMode,
  writeProductsCatalogViewModeCookie,
  PRODUCTS_CATALOG_VIEW_MODE_STORAGE_KEY,
} from '../../lib/products-catalog-view-mode';
import { useOptionalProductsCatalog } from './ProductsCatalogProvider';

/** Shared catalog view mode — SSR seed + localStorage persistence. */
export function useProductsCatalogViewMode() {
  const catalog = useOptionalProductsCatalog();
  const [viewMode, setViewMode] = useState<ProductsCatalogViewMode>(
    catalog?.initialViewMode ?? PRODUCTS_CATALOG_DEFAULT_VIEW_MODE
  );

  useEffect(() => {
    const storedMode = readStoredProductsCatalogViewMode();
    if (storedMode !== null) {
      setViewMode(storedMode);
      return;
    }
    if (catalog?.initialViewMode) {
      localStorage.setItem(PRODUCTS_CATALOG_VIEW_MODE_STORAGE_KEY, catalog.initialViewMode);
      writeProductsCatalogViewModeCookie(catalog.initialViewMode);
    }
  }, [catalog?.initialViewMode]);

  useEffect(() => {
    const handleViewModeChange = (event: CustomEvent<ProductsCatalogViewMode>) => {
      setViewMode(event.detail);
    };

    window.addEventListener('view-mode-changed', handleViewModeChange as EventListener);
    return () => {
      window.removeEventListener('view-mode-changed', handleViewModeChange as EventListener);
    };
  }, []);

  const setViewModePersisted = (mode: ProductsCatalogViewMode) => {
    setViewMode(mode);
    persistProductsCatalogViewMode(mode);
  };

  return { viewMode, setViewMode: setViewModePersisted };
}

export {
  PRODUCTS_CATALOG_VIEW_MODE_STORAGE_KEY,
} from '../../lib/products-catalog-view-mode';
