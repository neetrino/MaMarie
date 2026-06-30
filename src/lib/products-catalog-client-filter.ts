import type {
  ProductsCatalogMeta,
  ProductsCatalogProduct,
} from '../app/products/products-catalog-types';
import {
  parseSelectedList,
  type ProductsCatalogParams,
} from './products-catalog-params';

function parsePrice(value?: string): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }
  const parsed = Number.parseFloat(value.trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function productMatchesFilters(
  product: ProductsCatalogProduct,
  params: ProductsCatalogParams
): boolean {
  const search = params.search?.trim().toLowerCase();
  if (search && !product.title.toLowerCase().includes(search)) {
    return false;
  }

  const minPrice = parsePrice(params.minPrice);
  const maxPrice = parsePrice(params.maxPrice);
  if (minPrice != null && product.price < minPrice) {
    return false;
  }
  if (maxPrice != null && product.price > maxPrice) {
    return false;
  }

  const colorList = parseSelectedList(params.colors).map((value) => value.toLowerCase());
  if (colorList.length > 0) {
    const productColors = product.colors ?? [];
    const hasColor = productColors.some((color) =>
      colorList.includes(color.value.trim().toLowerCase())
    );
    if (!hasColor) {
      return false;
    }
  }

  const sizeList = parseSelectedList(params.sizes).map((value) => value.toUpperCase());
  if (sizeList.length > 0) {
    const productSizes = product.sizes ?? [];
    const hasSize = productSizes.some((size) => {
      const normalizedValue = size.value.trim().toUpperCase();
      const normalizedLabel = size.label.trim().toUpperCase();
      return sizeList.includes(normalizedValue) || sizeList.includes(normalizedLabel);
    });
    if (!hasSize) {
      return false;
    }
  }

  const brandList = parseSelectedList(params.brand);
  if (brandList.length > 0) {
    if (!product.brand?.id || !brandList.includes(product.brand.id)) {
      return false;
    }
  }

  return true;
}

/** Whether the active params can be previewed from a client-side product pool. */
export function canPreviewCatalogClientSide(params: ProductsCatalogParams): boolean {
  return !usesServerOnlyCatalogFilters(params);
}

/** Filters that require a server round-trip (no reliable client pool preview). */
export function usesServerOnlyCatalogFilters(params: ProductsCatalogParams): boolean {
  return Boolean(params.clothingTypes);
}

/** Filters and paginates catalog products locally for instant filter preview. */
export function previewCatalogProductsClientSide(
  pool: ProductsCatalogProduct[],
  params: ProductsCatalogParams
): { products: ProductsCatalogProduct[]; meta: ProductsCatalogMeta } {
  const limit = params.limit;
  const page = params.page;
  const filtered = pool.filter((product) => productMatchesFilters(product, params));
  const start = (page - 1) * limit;
  const products = filtered.slice(start, start + limit);

  return {
    products,
    meta: {
      total: 0,
      page,
      limit,
      totalPages: 0,
    },
  };
}

export function haveSameProductOrder(
  left: ProductsCatalogProduct[],
  right: ProductsCatalogProduct[]
): boolean {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((product, index) => product.id === right[index]?.id);
}
