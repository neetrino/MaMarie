import { unstable_cache } from 'next/cache';

const CATALOG_FILTERS_REVALIDATE_SECONDS = 60;

export interface CatalogFiltersSnapshot {
  colors: Array<{
    value: string;
    label: string;
    count: number;
    imageUrl?: string | null;
    colors?: string[] | null;
  }>;
  sizes: Array<{ value: string; count: number }>;
  brands: Array<{ id: string; name: string; count: number }>;
  priceRange: {
    min: number;
    max: number;
    stepSize: number | null;
    stepSizePerCurrency: Record<string, number> | null;
  };
}

async function loadCatalogFilters(
  lang: string,
  category: string,
  search: string,
  minPrice: number | null,
  maxPrice: number | null
): Promise<CatalogFiltersSnapshot> {
  const { productsService } = await import('./products.service');
  const result = await productsService.getFilters({
    lang,
    category: category || undefined,
    search: search || undefined,
    minPrice: minPrice ?? undefined,
    maxPrice: maxPrice ?? undefined,
  });

  return {
    colors: result.colors ?? [],
    sizes: result.sizes ?? [],
    brands: result.brands ?? [],
    priceRange: result.priceRange ?? {
      min: 0,
      max: 100000,
      stepSize: null,
      stepSizePerCurrency: null,
    },
  };
}

const getCatalogFiltersCachedInner = unstable_cache(
  loadCatalogFilters,
  ['products-catalog-filters-v1'],
  { revalidate: CATALOG_FILTERS_REVALIDATE_SECONDS }
);

/** SSR + edge cache for catalog sidebar filters. */
export async function getCatalogFiltersCached(input: {
  lang: string;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<CatalogFiltersSnapshot> {
  return getCatalogFiltersCachedInner(
    input.lang,
    input.category ?? '',
    input.search ?? '',
    input.minPrice ?? null,
    input.maxPrice ?? null
  );
}
