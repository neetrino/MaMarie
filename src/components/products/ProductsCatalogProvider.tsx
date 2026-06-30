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
import type {
  ProductsCatalogMeta,
  ProductsCatalogProduct,
  ProductsCatalogResponse,
} from '../../app/products/products-catalog-types';
import {
  PRODUCTS_CATALOG_CLIENT_POOL_LIMIT,
  PRODUCTS_CATALOG_SEARCH_DEBOUNCE_MS,
} from '../../constants/products-catalog';
import { apiClient } from '../../lib/api-client';
import { RequestAbortedError } from '../../lib/api-client/types';
import {
  buildCatalogClientCacheKey,
  readCatalogClientCache,
  writeCatalogClientCache,
} from '../../lib/products-catalog-client-cache';
import {
  canPreviewCatalogClientSide,
  haveSameProductOrder,
  previewCatalogProductsClientSide,
} from '../../lib/products-catalog-client-filter';
import { getStoredLanguage } from '../../lib/language';
import {
  normalizeProductsCatalogParams,
  parseProductsCatalogParams,
  productsCatalogParamsKey,
  serializeProductsCatalogParams,
  syncProductsCatalogUrl,
  type ProductsCatalogHistoryMode,
  type ProductsCatalogParams,
} from '../../lib/products-catalog-params';

interface UpdateParamsOptions {
  resetPage?: boolean;
  append?: boolean;
}

interface ProductsCatalogContextValue {
  params: ProductsCatalogParams;
  products: ProductsCatalogProduct[];
  meta: ProductsCatalogMeta;
  isFetching: boolean;
  isOptimistic: boolean;
  isServerOnlyFetch: boolean;
  gridRevision: number;
  selectedColors: string[];
  selectedSizes: string[];
  selectedBrands: string[];
  selectedClothingTypes: string[];
  sortBy: string;
  updateParams: (patch: Partial<ProductsCatalogParams>, options?: UpdateParamsOptions) => void;
  clearFilters: () => void;
  buildPaginationUrl: (page: number) => string;
}

const ProductsCatalogContext = createContext<ProductsCatalogContextValue | null>(null);
const PRODUCT_DATA_PARAM_KEYS: ReadonlyArray<keyof ProductsCatalogParams> = [
  'page',
  'limit',
  'search',
  'category',
  'minPrice',
  'maxPrice',
  'colors',
  'sizes',
  'brand',
  'clothingTypes',
];

interface ProductsCatalogProviderProps {
  initialParams: ProductsCatalogParams;
  initialProducts: ProductsCatalogProduct[];
  initialMeta: ProductsCatalogMeta;
  children: ReactNode;
}

function mergeParams(
  current: ProductsCatalogParams,
  patch: Partial<ProductsCatalogParams>,
  resetPage: boolean
): ProductsCatalogParams {
  const next: ProductsCatalogParams = { ...current };
  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      delete next[key as keyof ProductsCatalogParams];
    } else {
      next[key as keyof ProductsCatalogParams] = value as never;
    }
  });
  if (resetPage) {
    next.page = 1;
  }
  return normalizeProductsCatalogParams(next);
}

function hasProductDataParamsChanged(
  current: ProductsCatalogParams,
  next: ProductsCatalogParams
): boolean {
  return PRODUCT_DATA_PARAM_KEYS.some((key) => current[key] !== next[key]);
}

function hasOnlySearchChanged(
  current: ProductsCatalogParams,
  next: ProductsCatalogParams
): boolean {
  if (current.search === next.search) {
    return false;
  }
  return PRODUCT_DATA_PARAM_KEYS.every((key) => {
    if (key === 'search') {
      return true;
    }
    return current[key] === next[key];
  });
}

function mergeCatalogPool(
  existing: ProductsCatalogProduct[],
  incoming: ProductsCatalogProduct[]
): ProductsCatalogProduct[] {
  const byId = new Map<string, ProductsCatalogProduct>();
  existing.forEach((product) => byId.set(product.id, product));
  incoming.forEach((product) => byId.set(product.id, product));
  return Array.from(byId.values());
}

function buildCatalogPoolParams(source: ProductsCatalogParams): ProductsCatalogParams {
  return normalizeProductsCatalogParams({
    page: 1,
    limit: PRODUCTS_CATALOG_CLIENT_POOL_LIMIT,
    ...(source.category ? { category: source.category } : {}),
    ...(source.search ? { search: source.search } : {}),
  });
}

function resolveNextProducts(
  current: ProductsCatalogProduct[],
  incoming: ProductsCatalogProduct[],
  append: boolean
): { next: ProductsCatalogProduct[]; changed: boolean } {
  const next = append ? [...current, ...incoming] : incoming;
  if (!append && haveSameProductOrder(current, next)) {
    return { next: current, changed: false };
  }
  return { next, changed: true };
}

async function fetchCatalogProducts(
  params: ProductsCatalogParams,
  signal: AbortSignal
): Promise<ProductsCatalogResponse> {
  const query = serializeProductsCatalogParams(params);
  query.set('lang', getStoredLanguage());
  const requestParams = Object.fromEntries(query.entries());
  return apiClient.get<ProductsCatalogResponse>('/api/v1/products', {
    params: requestParams,
    signal,
  });
}

const PRODUCTS_LIST_CLIENT_CACHE_SCOPE = 'products';

function buildProductsListClientCacheKey(params: ProductsCatalogParams): string {
  return buildCatalogClientCacheKey(PRODUCTS_LIST_CLIENT_CACHE_SCOPE, {
    lang: getStoredLanguage(),
    query: productsCatalogParamsKey(params),
  });
}

function readPersistedCatalogResponse(
  params: ProductsCatalogParams
): ProductsCatalogResponse | null {
  return readCatalogClientCache<ProductsCatalogResponse>(buildProductsListClientCacheKey(params));
}

function persistCatalogResponse(
  params: ProductsCatalogParams,
  response: ProductsCatalogResponse
): void {
  writeCatalogClientCache(buildProductsListClientCacheKey(params), response);
}

export function ProductsCatalogProvider({
  initialParams,
  initialProducts,
  initialMeta,
  children,
}: ProductsCatalogProviderProps) {
  const normalizedInitialParams = useMemo(
    () => normalizeProductsCatalogParams(initialParams),
    [initialParams]
  );
  const abortRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef(0);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const poolRef = useRef<ProductsCatalogProduct[]>(initialProducts);
  const cacheRef = useRef(
    new Map<string, ProductsCatalogResponse>([
      [
        productsCatalogParamsKey(normalizedInitialParams),
        { data: initialProducts, meta: initialMeta },
      ],
    ])
  );
  const paramsRef = useRef<ProductsCatalogParams>(normalizedInitialParams);
  const [params, setParams] = useState<ProductsCatalogParams>(normalizedInitialParams);
  const [products, setProducts] = useState<ProductsCatalogProduct[]>(initialProducts);
  const [meta, setMeta] = useState<ProductsCatalogMeta>(initialMeta);
  const [isFetching, setIsFetching] = useState(false);
  const [isOptimistic, setIsOptimistic] = useState(false);
  const [isServerOnlyFetch, setIsServerOnlyFetch] = useState(false);
  const [gridRevision, setGridRevision] = useState(0);

  const bumpGridRevision = useCallback((append: boolean) => {
    if (!append) {
      setGridRevision((revision) => revision + 1);
    }
  }, []);

  const clearSearchDebounce = useCallback(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
  }, []);

  const applyOptimisticPreview = useCallback((nextParams: ProductsCatalogParams): boolean => {
    if (!canPreviewCatalogClientSide(nextParams) || poolRef.current.length === 0) {
      return false;
    }

    const preview = previewCatalogProductsClientSide(poolRef.current, nextParams);
    setProducts(preview.products);
    setMeta(preview.meta);
    setIsOptimistic(true);
    return true;
  }, []);

  const loadProducts = useCallback(async (nextParams: ProductsCatalogParams, append = false) => {
    const requestId = ++requestSeqRef.current;
    const canonicalParams = normalizeProductsCatalogParams(nextParams);
    const serverOnly = !canPreviewCatalogClientSide(canonicalParams);

    abortRef.current?.abort();

    const cacheKey = productsCatalogParamsKey(canonicalParams);
    let cached = cacheRef.current.get(cacheKey);
    if (!cached) {
      const persisted = readPersistedCatalogResponse(canonicalParams);
      if (persisted) {
        cacheRef.current.set(cacheKey, persisted);
        cached = persisted;
      }
    }
    if (cached) {
      if (requestId !== requestSeqRef.current) {
        return;
      }
      setIsOptimistic(false);
      setIsServerOnlyFetch(false);
      setProducts((current) => {
        const { next, changed } = resolveNextProducts(current, cached.data, append);
        if (!append && changed) {
          bumpGridRevision(false);
        }
        return next;
      });
      setMeta(cached.meta);
      setIsFetching(false);
      return;
    }

    if (!append) {
      const previewApplied = applyOptimisticPreview(canonicalParams);
      setIsServerOnlyFetch(serverOnly && !previewApplied);
    } else {
      setIsServerOnlyFetch(false);
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsFetching(true);

    try {
      const response = await fetchCatalogProducts(canonicalParams, controller.signal);
      if (requestId !== requestSeqRef.current || controller.signal.aborted) {
        return;
      }

      const nextProducts = Array.isArray(response.data) ? response.data : [];
      const catalogResponse: ProductsCatalogResponse = {
        data: nextProducts,
        meta: response.meta ?? initialMeta,
      };
      cacheRef.current.set(cacheKey, catalogResponse);
      persistCatalogResponse(canonicalParams, catalogResponse);
      poolRef.current = mergeCatalogPool(poolRef.current, nextProducts);
      setIsOptimistic(false);
      setIsServerOnlyFetch(false);
      setProducts((current) => {
        const { next, changed } = resolveNextProducts(current, nextProducts, append);
        if (!append && changed) {
          bumpGridRevision(false);
        }
        return next;
      });
      setMeta(response.meta ?? initialMeta);
    } catch (error) {
      if (
        requestId !== requestSeqRef.current ||
        controller.signal.aborted ||
        error instanceof RequestAbortedError
      ) {
        return;
      }
      setIsOptimistic(false);
      setIsServerOnlyFetch(false);
      if (!append) {
        setProducts((current) => {
          if (current.length > 0) {
            return current;
          }
          setMeta({ total: 0, page: 1, limit: canonicalParams.limit, totalPages: 0 });
          bumpGridRevision(false);
          return [];
        });
      }
    } finally {
      if (requestId === requestSeqRef.current && !controller.signal.aborted) {
        setIsFetching(false);
      }
    }
  }, [initialMeta, bumpGridRevision, applyOptimisticPreview]);

  const updateParams = useCallback(
    (patch: Partial<ProductsCatalogParams>, options?: UpdateParamsOptions) => {
      const resetPage = options?.resetPage ?? true;
      const append = options?.append ?? false;
      const current = paramsRef.current;
      const next = mergeParams(current, patch, resetPage);

      if (productsCatalogParamsKey(current) === productsCatalogParamsKey(next)) {
        return;
      }

      paramsRef.current = next;
      const historyMode: ProductsCatalogHistoryMode = hasOnlySearchChanged(current, next)
        ? 'replace'
        : 'push';
      syncProductsCatalogUrl(next, historyMode);
      setParams(next);

      if (!append && !hasProductDataParamsChanged(current, next)) {
        return;
      }

      if (!append && hasOnlySearchChanged(current, next)) {
        applyOptimisticPreview(next);
        clearSearchDebounce();
        const debouncedParams = next;
        searchDebounceRef.current = setTimeout(() => {
          if (productsCatalogParamsKey(paramsRef.current) !== productsCatalogParamsKey(debouncedParams)) {
            return;
          }
          void loadProducts(paramsRef.current, false);
        }, PRODUCTS_CATALOG_SEARCH_DEBOUNCE_MS);
        return;
      }

      clearSearchDebounce();
      void loadProducts(next, append);
    },
    [loadProducts, applyOptimisticPreview, clearSearchDebounce]
  );

  const clearFilters = useCallback(() => {
    clearSearchDebounce();
    const current = paramsRef.current;
    const next = normalizeProductsCatalogParams({
      page: 1,
      limit: current.limit,
      sort: current.sort,
    });

    paramsRef.current = next;
    syncProductsCatalogUrl(next, 'push');
    setParams(next);
    void loadProducts(next);
  }, [loadProducts, clearSearchDebounce]);

  useEffect(() => {
    persistCatalogResponse(normalizedInitialParams, {
      data: initialProducts,
      meta: initialMeta,
    });

    const poolParams = buildCatalogPoolParams(normalizedInitialParams);
    const poolKey = productsCatalogParamsKey(poolParams);
    const cachedPool = cacheRef.current.get(poolKey);
    if (cachedPool) {
      poolRef.current = mergeCatalogPool(poolRef.current, cachedPool.data);
      return;
    }

    const controller = new AbortController();
    void fetchCatalogProducts(poolParams, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }
        const poolProducts = Array.isArray(response.data) ? response.data : [];
        cacheRef.current.set(poolKey, {
          data: poolProducts,
          meta: response.meta ?? initialMeta,
        });
        persistCatalogResponse(poolParams, {
          data: poolProducts,
          meta: response.meta ?? initialMeta,
        });
        poolRef.current = mergeCatalogPool(poolRef.current, poolProducts);
      })
      .catch(() => {
        // Pool prefetch is best-effort; catalog still works via per-filter API calls.
      });

    return () => controller.abort();
  }, [normalizedInitialParams, initialMeta]);

  useEffect(() => {
    const handlePopState = () => {
      clearSearchDebounce();
      const nextParams = normalizeProductsCatalogParams(
        parseProductsCatalogParams(new URLSearchParams(window.location.search))
      );
      if (productsCatalogParamsKey(nextParams) === productsCatalogParamsKey(paramsRef.current)) {
        return;
      }
      paramsRef.current = nextParams;
      setParams(nextParams);
      void loadProducts(nextParams);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [loadProducts, clearSearchDebounce]);

  useEffect(() => {
    return () => {
      clearSearchDebounce();
      abortRef.current?.abort();
    };
  }, [clearSearchDebounce]);

  const buildPaginationUrl = useCallback(
    (page: number) => {
      const query = serializeProductsCatalogParams({ ...params, page });
      return `/products?${query.toString()}`;
    },
    [params]
  );

  const value = useMemo<ProductsCatalogContextValue>(() => {
    const colors = params.colors?.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean) ?? [];
    const sizes = params.sizes?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
    const brands = params.brand?.split(',').map((b) => b.trim()).filter(Boolean) ?? [];
    const clothingTypes =
      params.clothingTypes?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];

    return {
      params,
      products,
      meta,
      isFetching,
      isOptimistic,
      isServerOnlyFetch,
      gridRevision,
      selectedColors: colors,
      selectedSizes: sizes,
      selectedBrands: brands,
      selectedClothingTypes: clothingTypes,
      sortBy: params.sort ?? 'default',
      updateParams,
      clearFilters,
      buildPaginationUrl,
    };
  }, [
    params,
    products,
    meta,
    isFetching,
    isOptimistic,
    isServerOnlyFetch,
    gridRevision,
    updateParams,
    clearFilters,
    buildPaginationUrl,
  ]);

  return (
    <ProductsCatalogContext.Provider value={value}>
      {children}
    </ProductsCatalogContext.Provider>
  );
}

export function useProductsCatalog(): ProductsCatalogContextValue {
  const context = useContext(ProductsCatalogContext);
  if (!context) {
    throw new Error('useProductsCatalog must be used within ProductsCatalogProvider');
  }
  return context;
}

export function useOptionalProductsCatalog(): ProductsCatalogContextValue | null {
  return useContext(ProductsCatalogContext);
}
