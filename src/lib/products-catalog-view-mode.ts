import {
  PRODUCTS_CATALOG_DEFAULT_VIEW_MODE,
  normalizeProductsCatalogViewMode,
  resolveProductsCatalogPageLimit,
  type ProductsCatalogViewMode,
} from '../constants/products-catalog';

export const PRODUCTS_CATALOG_VIEW_MODE_STORAGE_KEY = 'products-view-mode';
export const PRODUCTS_CATALOG_VIEW_MODE_COOKIE = 'products-view-mode';
const VIEW_MODE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** Reads persisted view mode from the SSR cookie (when set). */
export function readProductsCatalogViewModeFromCookieValue(
  raw: string | undefined
): ProductsCatalogViewMode | null {
  if (!raw?.trim()) {
    return null;
  }
  return normalizeProductsCatalogViewMode(raw.trim());
}

/** Resolves catalog page size from cookie when URL has no explicit `limit`. */
export function resolveCatalogLimitFromViewMode(
  viewMode: ProductsCatalogViewMode
): number {
  return resolveProductsCatalogPageLimit(viewMode);
}

export function resolveInitialProductsCatalogViewMode(
  cookieValue: string | undefined
): ProductsCatalogViewMode {
  return readProductsCatalogViewModeFromCookieValue(cookieValue) ?? PRODUCTS_CATALOG_DEFAULT_VIEW_MODE;
}

/** Persists view mode for SSR alignment on the next navigation. */
export function writeProductsCatalogViewModeCookie(mode: ProductsCatalogViewMode): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${PRODUCTS_CATALOG_VIEW_MODE_COOKIE}=${mode}; path=/; max-age=${VIEW_MODE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

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
  writeProductsCatalogViewModeCookie(mode);
  window.dispatchEvent(new CustomEvent('view-mode-changed', { detail: mode }));
}
