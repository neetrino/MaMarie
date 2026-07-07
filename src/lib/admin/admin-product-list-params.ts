/** Default server sort for admin product lists (must match query-builder fallback). */
export const DEFAULT_ADMIN_PRODUCT_SORT = 'createdAt-desc';

const DEFAULT_ADMIN_PRODUCT_LIMIT = 20;

export interface AdminProductListInput {
  page: number;
  limit?: number;
  search?: string;
  category?: string;
  sku?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

/**
 * Canonical query params for admin product list API + client cache keys.
 * Ensures pages with/without explicit sort share the same cache entry.
 */
export function buildAdminProductListParams(
  input: AdminProductListInput
): Record<string, string> {
  const params: Record<string, string> = {
    page: input.page.toString(),
    limit: (input.limit ?? DEFAULT_ADMIN_PRODUCT_LIMIT).toString(),
    sort: input.sort?.trim() || DEFAULT_ADMIN_PRODUCT_SORT,
  };

  const search = input.search?.trim();
  if (search) {
    params.search = search;
  }

  const category = input.category?.trim();
  if (category) {
    params.category = category;
  }

  const sku = input.sku?.trim();
  if (sku) {
    params.sku = sku;
  }

  const minPrice = input.minPrice?.trim();
  if (minPrice) {
    params.minPrice = minPrice;
  }

  const maxPrice = input.maxPrice?.trim();
  if (maxPrice) {
    params.maxPrice = maxPrice;
  }

  return params;
}
