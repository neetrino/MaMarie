import { withServerReadCache } from '@/lib/cache/server-read-cache';
import { Prisma } from '@white-shop/db';
import { db } from '@white-shop/db';
import { adminService } from './admin.service';
import { aggregateCatalogFilters } from './products-filters-aggregate';
import { buildStorefrontFiltersCacheKey } from './products-filters-cache-key';
import { buildWhereClause } from './products-find-query/query-builder';
import { fetchStorefrontCatalogFilterProducts } from './products-find-query/storefront-catalog-filters-batcher';
import { logger } from '../utils/logger';

const FILTERS_PRODUCTS_LIMIT = 500;
const FILTERS_PROCESS_CACHE_TTL_MS = 60_000;

const EMPTY_FILTERS = {
  colors: [] as Array<{ value: string; label: string; count: number; imageUrl?: string | null; colors?: string[] | null }>,
  sizes: [] as Array<{ value: string; count: number }>,
  brands: [] as Array<{ id: string; name: string; count: number }>,
  priceRange: { min: 0, max: 100000, stepSize: null as number | null, stepSizePerCurrency: null as Record<string, number> | null },
};

class ProductsFiltersService {
  async getFilters(filters: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    lang?: string;
  }) {
    return withServerReadCache(
      buildStorefrontFiltersCacheKey(filters),
      FILTERS_PROCESS_CACHE_TTL_MS,
      () => this.fetchFiltersUncached(filters)
    );
  }

  private async fetchFiltersUncached(filters: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    lang?: string;
  }) {
    try {
      const lang = filters.lang || 'en';
      const { where } = await buildWhereClause({
        category: filters.category,
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        lang,
        page: 1,
        limit: FILTERS_PRODUCTS_LIMIT,
      });

      if (where === null) {
        return EMPTY_FILTERS;
      }

      const [products, priceSettings] = await Promise.all([
        fetchStorefrontCatalogFilterProducts(where, FILTERS_PRODUCTS_LIMIT),
        this.loadPriceFilterSettings(),
      ]);
      const aggregated = aggregateCatalogFilters(products, lang);

      return {
        colors: aggregated.colors,
        sizes: aggregated.sizes,
        brands: aggregated.brands,
        priceRange: {
          min: aggregated.priceMin,
          max: aggregated.priceMax,
          stepSize: priceSettings.stepSize,
          stepSizePerCurrency: priceSettings.stepSizePerCurrency,
        },
      };
    } catch (error) {
      logger.error('Products filters aggregation failed', { error, filters });
      return EMPTY_FILTERS;
    }
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

  /**
   * Get price range
   */
  async getPriceRange(filters: { category?: string; lang?: string }) {
    const where: Prisma.ProductWhereInput = {
      published: true,
      deletedAt: null,
    };

    if (filters.category) {
      const categoryDoc = await db.category.findFirst({
        where: {
          translations: {
            some: {
              slug: filters.category,
              locale: filters.lang || 'en',
            },
          },
        },
      });

      if (categoryDoc) {
        where.OR = [
          { primaryCategoryId: categoryDoc.id },
          { categoryIds: { has: categoryDoc.id } },
        ];
      }
    }

    const products = await db.product.findMany({
      where,
      include: {
        variants: {
          where: {
            published: true,
          },
        },
      },
    });

    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach((product: { variants: Array<{ price: number }> }) => {
      if (product.variants.length > 0) {
        const prices = product.variants.map((v: { price: number }) => v.price);
        const productMin = Math.min(...prices);
        const productMax = Math.max(...prices);
        if (productMin < minPrice) minPrice = productMin;
        if (productMax > maxPrice) maxPrice = productMax;
      }
    });

    minPrice = minPrice === Infinity ? 0 : Math.floor(minPrice / 1000) * 1000;
    maxPrice = maxPrice === 0 ? 100000 : Math.ceil(maxPrice / 1000) * 1000;

    const priceSettings = await this.loadPriceFilterSettings();

    return {
      min: minPrice,
      max: maxPrice,
      stepSize: priceSettings.stepSize,
      stepSizePerCurrency: priceSettings.stepSizePerCurrency,
    };
  }
}

export const productsFiltersService = new ProductsFiltersService();
