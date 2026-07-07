'use client';

import type { LinkProps } from 'next/link';
import type { FocusEvent, MouseEvent, TouchEvent } from 'react';
import type { ProductsCatalogResponse } from '../../app/products/products-catalog-types';
import type { ProductsFiltersData } from '../../components/ProductsFiltersProvider';
import { apiClient } from '../api-client';
import { getStoredLanguage } from '../language';
import {
  buildCatalogClientCacheKey,
  hasFreshCatalogClientCache,
  readCatalogClientCache,
  writeCatalogClientCache,
} from '../products-catalog-client-cache';
import {
  parseProductsCatalogParams,
  productsCatalogParamsKey,
  serializeProductsCatalogParams,
} from '../products-catalog-params';

const PREFETCH_COOLDOWN_MS = 5_000;
const PRODUCTS_LIST_SCOPE = 'products';
const PRODUCTS_FILTERS_SCOPE = 'filters';

const lastPrefetchAt = new Map<string, number>();

function parseOptionalPrice(value?: string): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }
  const parsed = Number.parseFloat(value.trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function shouldSkipPrefetch(key: string): boolean {
  const now = Date.now();
  const lastAt = lastPrefetchAt.get(key) ?? 0;
  if (now - lastAt < PREFETCH_COOLDOWN_MS) {
    return true;
  }
  lastPrefetchAt.set(key, now);
  return false;
}

function buildProductsListCacheKey(params: ReturnType<typeof parseProductsCatalogParams>): string {
  return buildCatalogClientCacheKey(PRODUCTS_LIST_SCOPE, {
    lang: getStoredLanguage(),
    query: productsCatalogParamsKey(params),
  });
}

function buildFiltersCacheKey(params: ReturnType<typeof parseProductsCatalogParams>): string {
  return buildCatalogClientCacheKey(PRODUCTS_FILTERS_SCOPE, {
    lang: getStoredLanguage(),
    category: params.category,
    search: params.search,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
  });
}

function warmProductsList(params: ReturnType<typeof parseProductsCatalogParams>): void {
  const cacheKey = buildProductsListCacheKey(params);
  if (hasFreshCatalogClientCache(cacheKey)) {
    return;
  }

  const query = serializeProductsCatalogParams(params);
  query.set('lang', getStoredLanguage());
  void apiClient
    .get<ProductsCatalogResponse>('/api/v1/products', {
      params: Object.fromEntries(query.entries()),
    })
    .then((response) => {
      writeCatalogClientCache(cacheKey, response);
    })
    .catch(() => {
      // Prefetch is best-effort.
    });
}

function warmProductsFilters(params: ReturnType<typeof parseProductsCatalogParams>): void {
  const cacheKey = buildFiltersCacheKey(params);
  if (hasFreshCatalogClientCache(cacheKey)) {
    return;
  }

  const requestParams: Record<string, string> = { lang: getStoredLanguage() };
  if (params.category) requestParams.category = params.category;
  if (params.search) requestParams.search = params.search;
  if (params.minPrice) requestParams.minPrice = params.minPrice;
  if (params.maxPrice) requestParams.maxPrice = params.maxPrice;

  void apiClient
    .get<ProductsFiltersData>('/api/v1/products/filters', { params: requestParams })
    .then((response) => {
      writeCatalogClientCache(cacheKey, response);
    })
    .catch(() => {
      // Prefetch is best-effort.
    });
}

/**
 * Warms catalog list + sidebar filter APIs before navigation (home hero girls/boys).
 */
export function warmStorefrontCatalogRoute(href: string): void {
  if (typeof window === 'undefined' || !href.startsWith('/products')) {
    return;
  }

  const queryIndex = href.indexOf('?');
  const query = queryIndex >= 0 ? href.slice(queryIndex + 1) : '';
  const params = parseProductsCatalogParams(new URLSearchParams(query));
  const prefetchKey = productsCatalogParamsKey(params);

  if (shouldSkipPrefetch(prefetchKey)) {
    return;
  }

  warmProductsList(params);
  warmProductsFilters(params);
}

/** Whether `href` targets the storefront products catalog. */
export function isStorefrontCatalogHref(href: LinkProps['href']): href is string {
  if (typeof href !== 'string') {
    return false;
  }
  return href === '/products' || href.startsWith('/products?') || href.startsWith('/products#');
}

interface StorefrontCatalogPrefetchHandlers {
  onMouseEnter?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onFocus?: (event: FocusEvent<HTMLAnchorElement>) => void;
  onTouchStart?: (event: TouchEvent<HTMLAnchorElement>) => void;
  prefetch?: LinkProps['prefetch'];
}

/** Merges catalog API warm-up handlers into Next.js `Link` props. */
export function mergeStorefrontCatalogPrefetchProps(
  href: LinkProps['href'],
  existing: StorefrontCatalogPrefetchHandlers = {}
): StorefrontCatalogPrefetchHandlers {
  if (!isStorefrontCatalogHref(href)) {
    return existing;
  }

  const warm = () => warmStorefrontCatalogRoute(href);

  return {
    prefetch: existing.prefetch ?? true,
    onMouseEnter: (event) => {
      warm();
      existing.onMouseEnter?.(event);
    },
    onFocus: (event) => {
      warm();
      existing.onFocus?.(event);
    },
    onTouchStart: (event) => {
      warm();
      existing.onTouchStart?.(event);
    },
  };
}

/** Reads warmed client cache for SSR-hydration alignment when available. */
export function readWarmedStorefrontCatalogList(
  params: ReturnType<typeof parseProductsCatalogParams>
): ProductsCatalogResponse | null {
  return readCatalogClientCache<ProductsCatalogResponse>(buildProductsListCacheKey(params));
}

/** Reads warmed client cache for sidebar filters when available. */
export function readWarmedStorefrontCatalogFilters(
  params: ReturnType<typeof parseProductsCatalogParams>
): ProductsFiltersData | null {
  return readCatalogClientCache<ProductsFiltersData>(buildFiltersCacheKey(params));
}
