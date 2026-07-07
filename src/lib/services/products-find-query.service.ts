import { withServerReadCache } from "@/lib/cache/server-read-cache";
import { buildWhereClause } from "./products-find-query/query-builder";
import { buildStorefrontFindQueryCacheKey } from "./products-find-query/cache-key";
import { executeProductQuery } from "./products-find-query/query-executor";
import { db } from "@white-shop/db";
import type { ProductFilters, ProductWithRelations } from "./products-find-query/types";

const STOREFRONT_FIND_QUERY_CACHE_TTL_MS = 60_000;

/**
 * Service for building and executing product find queries
 */
class ProductsFindQueryService {
  /**
   * Build where clause and fetch products from database
   */
  async buildQueryAndFetch(filters: ProductFilters): Promise<{
    products: ProductWithRelations[];
    bestsellerProductIds: string[];
    total?: number;
  }> {
    return withServerReadCache(
      buildStorefrontFindQueryCacheKey(filters),
      STOREFRONT_FIND_QUERY_CACHE_TTL_MS,
      () => this.fetchProductsUncached(filters)
    );
  }

  private async fetchProductsUncached(filters: ProductFilters): Promise<{
    products: ProductWithRelations[];
    bestsellerProductIds: string[];
    total?: number;
  }> {
    const { limit = 12, page = 1 } = filters;

    const { where, bestsellerProductIds } = await buildWhereClause(filters);

    if (where === null) {
      return {
        products: [],
        bestsellerProductIds: [],
        total: 0,
      };
    }

    const skip = (page - 1) * limit;
    const products = await executeProductQuery(where, limit, skip);

    let total: number;
    if (products.length < limit) {
      total = skip + products.length;
    } else {
      total = await db.product.count({ where });
    }

    return {
      products,
      bestsellerProductIds,
      total,
    };
  }
}

export const productsFindQueryService = new ProductsFindQueryService();
export type { ProductFilters, ProductWithRelations };
