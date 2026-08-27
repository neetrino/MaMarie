'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { apiClient } from '../lib/api-client';
import type { LanguageCode } from '../lib/language';
import { getStoredLanguage } from '../lib/language';
import { useTranslation } from '../lib/i18n-client';
import {
  buildCatalogClientCacheKey,
  readCatalogClientCache,
  writeCatalogClientCache,
} from '../lib/products-catalog-client-cache';
import { hasLoadedFilterFacets } from '../lib/products/has-loaded-filter-facets';

export interface ColorOption {
  value: string;
  label: string;
  count: number;
  imageUrl?: string | null;
  colors?: string[] | null;
}

export interface SizeOption {
  value: string;
  count: number;
}

export interface BrandOption {
  id: string;
  name: string;
  count: number;
}

export interface PriceRangeOption {
  min: number;
  max: number;
  stepSize?: number | null;
  stepSizePerCurrency?: Record<string, number> | null;
}

export interface ProductsFiltersData {
  colors: ColorOption[];
  sizes: SizeOption[];
  brands: BrandOption[];
  attributes: CatalogAttributeGroup[];
  categoryIds: string[];
  priceRange: PriceRangeOption;
}

export interface CatalogAttributeGroup {
  key: string;
  name: string;
  values: Array<{ value: string; label: string; count: number }>;
}

interface ProductsFiltersContextValue {
  data: ProductsFiltersData | null;
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

const ProductsFiltersContext = createContext<ProductsFiltersContextValue | null>(null);

const DEFAULT_FILTERS: ProductsFiltersData = {
  colors: [],
  sizes: [],
  brands: [],
  attributes: [],
  categoryIds: [],
  priceRange: { min: 0, max: 100000, stepSize: null, stepSizePerCurrency: null },
};

const PRODUCTS_FILTERS_CACHE_SCOPE = 'filters-v4';

interface ProductsFiltersProviderProps {
  category?: string;
  categoryScope?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  initialData?: ProductsFiltersData | null;
  children: ReactNode;
}

function buildFiltersCacheKey(input: {
  lang: LanguageCode;
  category?: string;
  categoryScope?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
}): string {
  return buildCatalogClientCacheKey(PRODUCTS_FILTERS_CACHE_SCOPE, {
    lang: input.lang,
    category: input.category,
    categoryScope: input.categoryScope,
    search: input.search,
    minPrice: input.minPrice,
    maxPrice: input.maxPrice,
  });
}

export function ProductsFiltersProvider({
  category,
  categoryScope,
  search,
  minPrice,
  maxPrice,
  initialData = null,
  children,
}: ProductsFiltersProviderProps) {
  const { lang } = useTranslation();
  const cacheKey = buildFiltersCacheKey({ lang, category, categoryScope, search, minPrice, maxPrice });
  const cachedFromStorage = readCatalogClientCache<ProductsFiltersData>(cacheKey);
  const usableInitialData =
    initialData && hasLoadedFilterFacets(initialData) ? initialData : null;
  const usableCachedFilters =
    cachedFromStorage && hasLoadedFilterFacets(cachedFromStorage) ? cachedFromStorage : null;
  const cachedFilters = usableInitialData ?? usableCachedFilters;
  const [data, setData] = useState<ProductsFiltersData | null>(cachedFilters);
  const [loading, setLoading] = useState(!cachedFilters);
  const [error, setError] = useState(false);
  const requestSeqRef = useRef(0);
  const skipInitialFetchRef = useRef(Boolean(usableInitialData));

  useEffect(() => {
    if (usableInitialData) {
      writeCatalogClientCache(cacheKey, usableInitialData);
    }
  }, [cacheKey, usableInitialData]);

  const fetchFilters = useCallback(async () => {
    const requestId = ++requestSeqRef.current;
    const activeCacheKey = buildFiltersCacheKey({
      lang,
      category,
      categoryScope,
      search,
      minPrice,
      maxPrice,
    });
    const cached = readCatalogClientCache<ProductsFiltersData>(activeCacheKey);

    if (cached && hasLoadedFilterFacets(cached)) {
      setData(cached);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const params: Record<string, string> = { lang };
      if (category) params.category = category;
      if (categoryScope) params.categoryScope = categoryScope;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await apiClient.get<ProductsFiltersData>('/api/v1/products/filters', { params });
      if (requestId !== requestSeqRef.current) {
        return;
      }

      const nextData: ProductsFiltersData = {
        colors: res.colors ?? [],
        sizes: res.sizes ?? [],
        brands: res.brands ?? [],
        attributes: res.attributes ?? [],
        categoryIds: res.categoryIds ?? [],
        priceRange: res.priceRange ?? DEFAULT_FILTERS.priceRange,
      };
      if (hasLoadedFilterFacets(nextData)) {
        writeCatalogClientCache(activeCacheKey, nextData);
        setData(nextData);
      }
    } catch {
      if (requestId !== requestSeqRef.current) {
        return;
      }
      setError(true);
    } finally {
      if (requestId === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, [category, categoryScope, search, minPrice, maxPrice, lang]);

  useEffect(() => {
    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return;
    }
    void fetchFilters();
  }, [fetchFilters]);

  const value = useMemo<ProductsFiltersContextValue>(
    () => ({ data, loading, error, refetch: fetchFilters }),
    [data, loading, error, fetchFilters]
  );

  return (
    <ProductsFiltersContext.Provider value={value}>
      {children}
    </ProductsFiltersContext.Provider>
  );
}

export function useProductsFilters(): ProductsFiltersContextValue | null {
  return useContext(ProductsFiltersContext);
}

/** Reads cached sidebar filter options (colors/sizes/brands) for standalone filter components. */
export function readCachedProductsFilters(input: {
  lang?: LanguageCode;
  category?: string;
  categoryScope?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
}): ProductsFiltersData | null {
  const { lang = getStoredLanguage(), ...rest } = input;
  const cached = readCatalogClientCache<ProductsFiltersData>(buildFiltersCacheKey({ lang, ...rest }));
  if (!cached || !hasLoadedFilterFacets(cached)) {
    return null;
  }
  return cached;
}

/** Persists sidebar filter options after a successful API fetch. */
export function writeCachedProductsFilters(
  input: {
    lang?: LanguageCode;
    category?: string;
    categoryScope?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  },
  data: ProductsFiltersData
): void {
  if (!hasLoadedFilterFacets(data)) {
    return;
  }
  const { lang = getStoredLanguage(), ...rest } = input;
  writeCatalogClientCache(buildFiltersCacheKey({ lang, ...rest }), data);
}
