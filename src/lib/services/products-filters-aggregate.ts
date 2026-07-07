import {
  collectProductColors,
  collectProductSizes,
} from './product-variant-attributes';
import type { ProductWithRelations } from './products-find-query/types';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export interface CatalogFilterColorOption {
  value: string;
  label: string;
  count: number;
  imageUrl?: string | null;
  colors?: string[] | null;
}

export interface CatalogFilterSizeOption {
  value: string;
  count: number;
}

export interface CatalogFilterBrandOption {
  id: string;
  name: string;
  count: number;
}

export interface CatalogFilterAggregation {
  colors: CatalogFilterColorOption[];
  sizes: CatalogFilterSizeOption[];
  brands: CatalogFilterBrandOption[];
  priceMin: number;
  priceMax: number;
}

function upsertColor(
  colorMap: Map<string, CatalogFilterColorOption>,
  color: { value: string; imageUrl?: string | null; colors?: string[] | null }
): void {
  const label = color.value.trim();
  if (!label) {
    return;
  }
  const key = label.toLowerCase();
  const existing = colorMap.get(key);
  colorMap.set(key, {
    value: key,
    label: existing?.label ?? label,
    count: (existing?.count ?? 0) + 1,
    imageUrl: color.imageUrl ?? existing?.imageUrl ?? null,
    colors: color.colors ?? existing?.colors ?? null,
  });
}

function upsertSize(sizeMap: Map<string, number>, value: string): void {
  const normalized = value.trim().toUpperCase();
  if (!normalized) {
    return;
  }
  sizeMap.set(normalized, (sizeMap.get(normalized) ?? 0) + 1);
}

/** Aggregates sidebar filter options from lightweight catalog products. */
export function aggregateCatalogFilters(
  products: ProductWithRelations[],
  lang: string
): CatalogFilterAggregation {
  const colorMap = new Map<string, CatalogFilterColorOption>();
  const sizeMap = new Map<string, number>();
  const brandMap = new Map<string, CatalogFilterBrandOption>();
  let rangeMin = Infinity;
  let rangeMax = 0;

  for (const product of products) {
    const brand = product.brand;
    if (brand?.id) {
      const translations = Array.isArray(brand.translations) ? brand.translations : [];
      const name =
        translations.find((row) => row.locale === lang)?.name ??
        translations[0]?.name ??
        '';
      if (name) {
        const existing = brandMap.get(brand.id);
        brandMap.set(brand.id, {
          id: brand.id,
          name,
          count: (existing?.count ?? 0) + 1,
        });
      }
    }

    const variants = Array.isArray(product.variants) ? product.variants : [];
    for (const variant of variants) {
      if (typeof variant.price === 'number') {
        rangeMin = Math.min(rangeMin, variant.price);
        rangeMax = Math.max(rangeMax, variant.price);
      }
    }

    collectProductColors(product, lang).forEach((color) => upsertColor(colorMap, color));
    collectProductSizes(product, lang).forEach((size) => upsertSize(sizeMap, size.value));
  }

  const colors = Array.from(colorMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  const sizes = Array.from(sizeMap.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => {
      const aIndex = SIZE_ORDER.indexOf(a.value as (typeof SIZE_ORDER)[number]);
      const bIndex = SIZE_ORDER.indexOf(b.value as (typeof SIZE_ORDER)[number]);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) {
        return -1;
      }
      if (bIndex !== -1) {
        return 1;
      }
      return a.value.localeCompare(b.value);
    });
  const brands = Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  return {
    colors,
    sizes,
    brands,
    priceMin: rangeMin === Infinity ? 0 : Math.floor(rangeMin / 1000) * 1000,
    priceMax: rangeMax === 0 ? 100000 : Math.ceil(rangeMax / 1000) * 1000,
  };
}
