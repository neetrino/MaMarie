'use client';

import { useEffect, useState } from 'react';
import {
  PRODUCTS_CATALOG_DEFAULT_VIEW_MODE,
  normalizeProductsCatalogViewMode,
  type ProductsCatalogViewMode,
} from '../../constants/products-catalog';

export const PRODUCTS_CATALOG_VIEW_MODE_STORAGE_KEY = 'products-view-mode';

/** Loads saved view mode when the user has chosen one; otherwise keeps the catalog default. */
export function readStoredProductsCatalogViewMode(): ProductsCatalogViewMode | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem(PRODUCTS_CATALOG_VIEW_MODE_STORAGE_KEY);
  if (stored === null) {
    return null;
  }

  const mode = normalizeProductsCatalogViewMode(stored);
  if (stored !== mode) {
    localStorage.setItem(PRODUCTS_CATALOG_VIEW_MODE_STORAGE_KEY, mode);
  }

  return mode;
}

export function persistProductsCatalogViewMode(mode: ProductsCatalogViewMode): void {
  localStorage.setItem(PRODUCTS_CATALOG_VIEW_MODE_STORAGE_KEY, mode);
  window.dispatchEvent(new CustomEvent('view-mode-changed', { detail: mode }));
}

/** Shared catalog view mode — defaults to the 2nd toolbar option until the user picks another. */
export function useProductsCatalogViewMode() {
  const [viewMode, setViewMode] = useState<ProductsCatalogViewMode>(
    PRODUCTS_CATALOG_DEFAULT_VIEW_MODE,
  );

  useEffect(() => {
    const storedMode = readStoredProductsCatalogViewMode();
    if (storedMode !== null) {
      setViewMode(storedMode);
    }
  }, []);

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
