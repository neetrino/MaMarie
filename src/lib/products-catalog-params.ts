export const PRODUCTS_CATALOG_DEFAULT_LIMIT = 12;

export const PRODUCTS_CATALOG_FILTER_PARAM_KEYS = [
  'search',
  'category',
  'minPrice',
  'maxPrice',
  'colors',
  'sizes',
  'brand',
  'clothingTypes',
  'sort',
] as const;

export interface ProductsCatalogParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  colors?: string;
  sizes?: string;
  brand?: string;
  clothingTypes?: string;
  sort?: string;
}

type SearchParamsInput = Record<string, string | string[] | undefined>;

function readString(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readPage(value: string | string[] | undefined): number {
  const raw = readString(value);
  if (!raw) {
    return 1;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function readLimit(value: string | string[] | undefined): number {
  const raw = readString(value);
  if (!raw) {
    return PRODUCTS_CATALOG_DEFAULT_LIMIT;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return PRODUCTS_CATALOG_DEFAULT_LIMIT;
  }
  return Math.min(parsed, 200);
}

/**
 * Normalizes catalog query params from URL search params or Next.js searchParams.
 */
export function parseProductsCatalogParams(
  input: URLSearchParams | SearchParamsInput
): ProductsCatalogParams {
  const get = (key: string): string | string[] | undefined => {
    if (input instanceof URLSearchParams) {
      const value = input.get(key);
      return value ?? undefined;
    }
    return input[key];
  };

  const params: ProductsCatalogParams = {
    page: readPage(get('page')),
    limit: readLimit(get('limit')),
  };

  const search = readString(get('search'));
  const category = readString(get('category'));
  const minPrice = readString(get('minPrice'));
  const maxPrice = readString(get('maxPrice'));
  const colors = readString(get('colors'));
  const sizes = readString(get('sizes'));
  const brand = readString(get('brand'));
  const clothingTypes = readString(get('clothingTypes'));
  const sort = readString(get('sort'));

  if (search) params.search = search;
  if (category) params.category = category;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (colors) params.colors = colors;
  if (sizes) params.sizes = sizes;
  if (brand) params.brand = brand;
  if (clothingTypes) params.clothingTypes = clothingTypes;
  if (sort) params.sort = sort;

  return normalizeProductsCatalogParams(params);
}

const MULTI_VALUE_PARAM_KEYS = ['colors', 'sizes', 'brand', 'clothingTypes'] as const;

function normalizeMultiValueParam(
  key: (typeof MULTI_VALUE_PARAM_KEYS)[number],
  value: string
): string {
  const items = parseSelectedList(value);
  if (items.length === 0) {
    return '';
  }
  if (key === 'colors') {
    return items.map((item) => item.toLowerCase()).sort().join(',');
  }
  if (key === 'sizes') {
    return items.map((item) => item.toUpperCase()).sort().join(',');
  }
  return [...items].sort().join(',');
}

/**
 * Canonicalizes catalog params so equivalent filters share one cache key.
 */
export function normalizeProductsCatalogParams(params: ProductsCatalogParams): ProductsCatalogParams {
  const normalized: ProductsCatalogParams = {
    page: params.page,
    limit: params.limit,
  };

  if (params.search?.trim()) {
    normalized.search = params.search.trim();
  }
  if (params.category?.trim()) {
    normalized.category = params.category.trim();
  }
  if (params.minPrice?.trim()) {
    normalized.minPrice = params.minPrice.trim();
  }
  if (params.maxPrice?.trim()) {
    normalized.maxPrice = params.maxPrice.trim();
  }
  if (params.sort?.trim()) {
    normalized.sort = params.sort.trim();
  }

  MULTI_VALUE_PARAM_KEYS.forEach((key) => {
    const raw = params[key];
    if (!raw?.trim()) {
      return;
    }
    const canonical = normalizeMultiValueParam(key, raw);
    if (canonical) {
      normalized[key] = canonical;
    }
  });

  return normalized;
}

/**
 * Builds URLSearchParams for catalog navigation and API requests.
 */
export function serializeProductsCatalogParams(params: ProductsCatalogParams): URLSearchParams {
  const canonical = normalizeProductsCatalogParams(params);
  const query = new URLSearchParams();
  query.set('page', String(canonical.page));
  query.set('limit', String(canonical.limit));

  if (canonical.search) query.set('search', canonical.search);
  if (canonical.category) query.set('category', canonical.category);
  if (canonical.minPrice) query.set('minPrice', canonical.minPrice);
  if (canonical.maxPrice) query.set('maxPrice', canonical.maxPrice);
  if (canonical.colors) query.set('colors', canonical.colors);
  if (canonical.sizes) query.set('sizes', canonical.sizes);
  if (canonical.brand) query.set('brand', canonical.brand);
  if (canonical.clothingTypes) query.set('clothingTypes', canonical.clothingTypes);
  if (canonical.sort) query.set('sort', canonical.sort);

  return query;
}

/** Stable string key for comparing catalog param sets. */
export function productsCatalogParamsKey(params: ProductsCatalogParams): string {
  return serializeProductsCatalogParams(params).toString();
}

/** Updates the browser URL without triggering a Next.js navigation. */
export type ProductsCatalogHistoryMode = 'push' | 'replace';

export function syncProductsCatalogUrl(
  params: ProductsCatalogParams,
  mode: ProductsCatalogHistoryMode = 'replace'
): void {
  if (typeof window === 'undefined') {
    return;
  }
  const query = serializeProductsCatalogParams(params);
  const nextUrl = query.toString() ? `/products?${query.toString()}` : '/products';
  const currentUrl = `${window.location.pathname}${window.location.search}`;
  if (currentUrl === nextUrl) {
    return;
  }
  if (mode === 'push') {
    window.history.pushState(window.history.state, '', nextUrl);
    return;
  }
  window.history.replaceState(window.history.state, '', nextUrl);
}

/** Splits comma-separated filter values into a trimmed list. */
export function parseSelectedList(value?: string): string[] {
  if (!value?.trim()) {
    return [];
  }
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}
