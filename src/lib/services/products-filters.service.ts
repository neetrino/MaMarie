import { withServerReadCache, invalidateServerReadCache } from '@/lib/cache/server-read-cache';
import { DEFAULT_LANGUAGE } from '@/lib/language';
import { hasLoadedFilterFacets } from '@/lib/products/has-loaded-filter-facets';
import { adminService } from './admin.service';
import { loadCatalogFilterFacets } from './products-filters-facets';
import { buildStorefrontFiltersCacheKey } from './products-filters-cache-key';
import { buildWhereClause } from './products-find-query/query-builder';
import { logger } from '../utils/logger';

const FILTERS_PROCESS_CACHE_TTL_MS = 60_000;

const EMPTY_FILTERS = {
  colors: [] as Array<{ value: string; label: string; count: number; imageUrl?: string | null; colors?: string[] | null }>,
  sizes: [] as Array<{ value: string; count: number }>,
  brands: [] as Array<{ id: string; name: string; count: number }>,
  attributes: [] as Array<{
    key: string;
    name: string;
    values: Array<{ value: string; label: string; count: number }>;
  }>,
  categoryIds: [] as string[],
  priceRange: { min: 0, max: 100000, stepSize: null as number | null, stepSizePerCurrency: null as Record<string, number> | null },
};

type StorefrontFiltersInput = {
  category?: string;
  categoryScope?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  lang?: string;
};

class ProductsFiltersService {
  async getFilters(filters: StorefrontFiltersInput) {
    const cacheKey = buildStorefrontFiltersCacheKey({
      ...filters,
      lang: filters.lang || DEFAULT_LANGUAGE,
    });
    try {
      const result = await withServerReadCache(
        cacheKey,
        FILTERS_PROCESS_CACHE_TTL_MS,
        () => this.fetchFiltersUncached(filters)
      );
      if (!hasLoadedFilterFacets(result)) {
        invalidateServerReadCache(cacheKey);
      }
      return result;
    } catch (error) {
      invalidateServerReadCache(cacheKey);
      logger.error('Products filters aggregation failed', { error, filters });
      throw error;
    }
  }

  private async fetchFiltersUncached(filters: StorefrontFiltersInput) {
    const lang = filters.lang || DEFAULT_LANGUAGE;
    const shared = {
      search: filters.search,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      lang,
      page: 1,
      limit: 1,
    };
    const [{ where }, { where: whereWithoutCategory }] = await Promise.all([
      buildWhereClause({
        ...shared,
        category: filters.category,
        categoryScope: filters.categoryScope,
      }),
      buildWhereClause(shared),
    ]);

    if (where === null) {
      return EMPTY_FILTERS;
    }

    const [aggregated, priceSettings] = await Promise.all([
      loadCatalogFilterFacets(where, lang, whereWithoutCategory ?? where),
      this.loadPriceFilterSettings(),
    ]);

    return {
      colors: aggregated.colors,
      sizes: aggregated.sizes,
      brands: aggregated.brands,
      attributes: aggregated.attributes,
      categoryIds: aggregated.categoryIds,
      priceRange: {
        min: aggregated.priceMin,
        max: aggregated.priceMax,
        stepSize: priceSettings.stepSize,
        stepSizePerCurrency: priceSettings.stepSizePerCurrency,
      },
    };
  }

  private async loadPriceFilterSettings(): Promise<{
    stepSize: number | null;
    stepSizePerCurrency: Record<string, number> | null;
  }> {
    try {
      const settings = await adminService.getPriceFilterSettings();
      const stepSizePerCurrency = settings.stepSizePerCurrency
        ? {
            USD: settings.stepSizePerCurrency.USD ?? undefined,
            AMD: settings.stepSizePerCurrency.AMD ?? undefined,
            RUB: settings.stepSizePerCurrency.RUB ?? undefined,
            GEL: settings.stepSizePerCurrency.GEL ?? undefined,
          }
        : null;

      return {
        stepSize: settings.stepSize ?? null,
        stepSizePerCurrency: stepSizePerCurrency as Record<string, number> | null,
      };
    } catch (error) {
      logger.error('Failed to load price filter settings', { error });
      return { stepSize: null, stepSizePerCurrency: null };
    }
  }

  async getPriceRange(filters: { category?: string; lang?: string }) {
    const result = await this.getFilters({
      category: filters.category,
      lang: filters.lang,
    });
    return result.priceRange;
  }
}

export const productsFiltersService = new ProductsFiltersService();
