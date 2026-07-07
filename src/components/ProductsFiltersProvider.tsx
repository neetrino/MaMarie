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
import { getStoredLanguage } from '../lib/language';
import {
  buildCatalogClientCacheKey,
  readCatalogClientCache,
  writeCatalogClientCache,
} from '../lib/products-catalog-client-cache';

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
  priceRange: PriceRangeOption;
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
  priceRange: { min: 0, max: 100000, stepSize: null, stepSizePerCurrency: null },
};

const PRODUCTS_FILTERS_CACHE_SCOPE = 'filters';

interface ProductsFiltersProviderProps {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  initialData?: ProductsFiltersData | null;
  children: ReactNode;
}

function buildFiltersCacheKey(input: {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
}): string {
  return buildCatalogClientCacheKey(PRODUCTS_FILTERS_CACHE_SCOPE, {
    lang: getStoredLanguage(),
    category: input.category,
    search: input.search,
    minPrice: input.minPrice,
    maxPrice: input.maxPrice,
  });
}

export function ProductsFiltersProvider({
  category,
  search,
  minPrice,
  maxPrice,
  initialData = null,
  children,
}: ProductsFiltersProviderProps) {
  const cacheKey = buildFiltersCacheKey({ category, search, minPrice, maxPrice });
  const cachedFilters = initialData ?? readCatalogClientCache<ProductsFiltersData>(cacheKey);
  const [data, setData] = useState<ProductsFiltersData | null>(cachedFilters);
  const [loading, setLoading] = useState(!cachedFilters);
  const [error, setError] = useState(false);
  const requestSeqRef = useRef(0);
  const skipInitialFetchRef = useRef(Boolean(initialData));

  useEffect(() => {
    if (initialData) {
      writeCatalogClientCache(cacheKey, initialData);
    }
  }, [cacheKey, initialData]);

  const fetchFilters = useCallback(async () => {
    const requestId = ++requestSeqRef.current;
    const activeCacheKey = buildFiltersCacheKey({ category, search, minPrice, maxPrice });
    const cached = readCatalogClientCache<ProductsFiltersData>(activeCacheKey);

    if (cached) {
      setData(cached);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const lang = getStoredLanguage();
      const params: Record<string, string> = { lang };
      if (category) params.category = category;
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
        priceRange: res.priceRange ?? DEFAULT_FILTERS.priceRange,
      };
      writeCatalogClientCache(activeCacheKey, nextData);
      setData(nextData);
    } catch {
      if (requestId !== requestSeqRef.current) {
        return;
      }
      setError(true);
      setData(DEFAULT_FILTERS);
    } finally {
      if (requestId === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, [category, search, minPrice, maxPrice]);

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
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
}): ProductsFiltersData | null {
  return readCatalogClientCache<ProductsFiltersData>(buildFiltersCacheKey(input));
}

/** Persists sidebar filter options after a successful API fetch. */
export function writeCachedProductsFilters(
  input: {
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  },
  data: ProductsFiltersData
): void {
  writeCatalogClientCache(buildFiltersCacheKey(input), data);
}
