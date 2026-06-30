import { stableSearchParamsKey } from '@/lib/cache/storefront-cache';
import {
  parseProductsCatalogParams,
  serializeProductsCatalogParams,
} from '@/lib/products-catalog-params';

/** Normalized Redis/cache key for `/api/v1/products` list responses. */
export function buildProductsListCacheKey(searchParams: URLSearchParams): string {
  const normalized = serializeProductsCatalogParams(parseProductsCatalogParams(searchParams));

  const lang = searchParams.get('lang');
  if (lang) {
    normalized.set('lang', lang);
  }

  const ids = searchParams.get('ids');
  if (ids) {
    normalized.set('ids', ids);
  }

  const filter = searchParams.get('filter') || searchParams.get('filters');
  if (filter) {
    normalized.set('filter', filter);
  }

  return stableSearchParamsKey(normalized);
}
