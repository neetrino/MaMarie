import { parseCatalogAttrsParam } from '@/lib/products-catalog-attrs';
import { parseSelectedList } from '@/lib/products-catalog-params';
import type { ProductFilters } from '@/lib/services/products-find-query/types';
import type { ProductWithRelations } from '@/lib/services/products-find-query/types';
import {
  selectDefaultVariant,
} from './select-default-variant';

type Variant = ProductWithRelations['variants'][number];
type VariantOption = Variant['options'][number];

export interface CatalogPresentationFilters {
  colors: string[];
  sizes: string[];
  attrs: Record<string, string[]>;
  minPrice?: number;
  maxPrice?: number;
  lang: string;
}

/**
 * Returns active catalog attribute/price filters that should drive card variant selection.
 * Returns null when no variant-scoped filters are active (cards use Main variant).
 */
export function parseCatalogPresentationFilters(
  filters?: Pick<ProductFilters, 'colors' | 'sizes' | 'attrs' | 'minPrice' | 'maxPrice' | 'lang'>
): CatalogPresentationFilters | null {
  const colors = parseSelectedList(filters?.colors).map((value) => value.toLowerCase());
  const sizes = parseSelectedList(filters?.sizes).map((value) => value.toUpperCase());
  const attrs = parseCatalogAttrsParam(filters?.attrs);
  const hasAttrs = Object.keys(attrs).length > 0;
  const hasPrice = filters?.minPrice != null || filters?.maxPrice != null;

  if (colors.length === 0 && sizes.length === 0 && !hasAttrs && !hasPrice) {
    return null;
  }

  return {
    colors,
    sizes,
    attrs,
    minPrice: filters?.minPrice,
    maxPrice: filters?.maxPrice,
    lang: filters?.lang ?? 'en',
  };
}

function normalizeMatchValue(value: string): string {
  return value.trim().toLowerCase();
}

function getColorValue(option: VariantOption, lang: string): string | null {
  if ('attributeValue' in option && option.attributeValue?.attribute?.key === 'color') {
    const slug = (option.attributeValue.value || '').trim().toLowerCase();
    if (slug) {
      return slug;
    }
    const translation =
      option.attributeValue.translations?.find((t) => t.locale === lang) ||
      option.attributeValue.translations?.[0];
    return (translation?.label || '').trim().toLowerCase() || null;
  }

  const legacy = option as VariantOption & { key?: string; attribute?: string };
  if (legacy.attributeKey === 'color' || legacy.key === 'color' || legacy.attribute === 'color') {
    return (option.value || '').trim().toLowerCase() || null;
  }

  return null;
}

function getSizeValue(option: VariantOption, lang: string): string | null {
  if ('attributeValue' in option && option.attributeValue?.attribute?.key === 'size') {
    const translation =
      option.attributeValue.translations?.find((t) => t.locale === lang) ||
      option.attributeValue.translations?.[0];
    return (translation?.label || option.attributeValue.value || '').trim().toUpperCase() || null;
  }

  const legacy = option as VariantOption & { key?: string; attribute?: string };
  if (legacy.attributeKey === 'size' || legacy.key === 'size' || legacy.attribute === 'size') {
    return (option.value || '').trim().toUpperCase() || null;
  }

  return null;
}

function getOptionAttributeKey(option: VariantOption): string | null {
  if ('attributeValue' in option && option.attributeValue?.attribute?.key) {
    return option.attributeValue.attribute.key;
  }

  const legacy = option as VariantOption & { key?: string; attribute?: string };
  return legacy.attributeKey || legacy.key || legacy.attribute || null;
}

function getAttributeMatchValues(option: VariantOption, lang: string): string[] {
  if ('attributeValue' in option && option.attributeValue) {
    const values: string[] = [];
    const slug = option.attributeValue.value?.trim();
    if (slug) {
      values.push(normalizeMatchValue(slug));
    }
    option.attributeValue.translations?.forEach((translation) => {
      if (translation.label?.trim()) {
        values.push(normalizeMatchValue(translation.label));
      }
    });
    return values;
  }

  if (option.value?.trim()) {
    return [normalizeMatchValue(option.value)];
  }

  return [];
}

function variantMatchesPrice(variant: Variant, filters: CatalogPresentationFilters): boolean {
  if (filters.minPrice != null && variant.price < filters.minPrice) {
    return false;
  }
  if (filters.maxPrice != null && variant.price > filters.maxPrice) {
    return false;
  }
  return true;
}

/**
 * Returns true when a variant satisfies all active catalog presentation filters.
 */
export function variantMatchesPresentationFilters(
  variant: Variant,
  filters: CatalogPresentationFilters
): boolean {
  if (variant.published === false) {
    return false;
  }

  if (!variantMatchesPrice(variant, filters)) {
    return false;
  }

  const options = Array.isArray(variant.options) ? variant.options : [];
  const needsOptions =
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    Object.keys(filters.attrs).length > 0;

  if (needsOptions && options.length === 0) {
    return false;
  }

  if (filters.colors.length > 0) {
    const colorMatched = options.some((option) => {
      const colorValue = getColorValue(option, filters.lang);
      return colorValue != null && filters.colors.includes(colorValue);
    });
    if (!colorMatched) {
      return false;
    }
  }

  if (filters.sizes.length > 0) {
    const sizeMatched = options.some((option) => {
      const sizeValue = getSizeValue(option, filters.lang);
      return sizeValue != null && filters.sizes.includes(sizeValue);
    });
    if (!sizeMatched) {
      return false;
    }
  }

  for (const [attrKey, filterValues] of Object.entries(filters.attrs)) {
    const normalizedFilterValues = filterValues.map(normalizeMatchValue);
    const attrMatched = options.some((option) => {
      const optionKey = getOptionAttributeKey(option);
      if (optionKey !== attrKey) {
        return false;
      }
      const optionValues = getAttributeMatchValues(option, filters.lang);
      return optionValues.some((value) => normalizedFilterValues.includes(value));
    });
    if (!attrMatched) {
      return false;
    }
  }

  return true;
}

/**
 * Picks the variant to display on catalog cards.
 * Uses the filtered match when filters are active; otherwise Main variant.
 */
export function selectCatalogPresentationVariant(
  variants: ProductWithRelations['variants'] | null | undefined,
  filters: CatalogPresentationFilters | null
): ProductWithRelations['variants'][number] | null {
  if (!Array.isArray(variants) || variants.length === 0) {
    return null;
  }

  if (!filters) {
    return selectDefaultVariant(variants);
  }

  const matching = variants.filter((variant) =>
    variantMatchesPresentationFilters(variant, filters)
  );

  if (matching.length === 0) {
    return selectDefaultVariant(variants);
  }

  return selectDefaultVariant(matching);
}
