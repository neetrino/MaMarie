import type { ProductWithRelations } from './products-find-query/types';

export interface ProductColorOption {
  value: string;
  imageUrl?: string | null;
  colors?: string[] | null;
}

export interface ProductSizeOption {
  value: string;
  label: string;
  inStock: boolean;
}

type Variant = ProductWithRelations['variants'][number];
type VariantOption = Variant['options'][number];

interface ProductAttributeColorValue {
  translations?: Array<{ locale: string; label?: string }>;
  value?: string;
  imageUrl?: string | null;
  colors?: string[] | null;
}

interface ProductAttributeWithColor {
  attribute?: {
    key?: string;
    values?: ProductAttributeColorValue[];
  } | null;
}

const SIZE_LETTER_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

function isAttributeOption(opt: VariantOption, attributeKey: 'color' | 'size'): boolean {
  const legacyOption = opt as VariantOption & { key?: string; attribute?: string };

  if ('attributeValue' in opt && opt.attributeValue) {
    return opt.attributeValue.attribute?.key === attributeKey;
  }

  return (
    legacyOption.attributeKey === attributeKey ||
    legacyOption.key === attributeKey ||
    legacyOption.attribute === attributeKey
  );
}

function isColorOption(opt: VariantOption): boolean {
  return isAttributeOption(opt, 'color');
}

function isSizeOption(opt: VariantOption): boolean {
  return isAttributeOption(opt, 'size');
}

function resolveOptionLabel(
  option: VariantOption,
  lang: string,
  fallback = ''
): string {
  if ('attributeValue' in option && option.attributeValue) {
    const translation =
      option.attributeValue.translations?.find((t) => t.locale === lang) ||
      option.attributeValue.translations?.[0];
    return translation?.label || option.attributeValue.value || fallback;
  }
  return option.value || fallback;
}

function resolveOptionValue(option: VariantOption, lang: string): string {
  if ('attributeValue' in option && option.attributeValue) {
    const translation =
      option.attributeValue.translations?.find((t) => t.locale === lang) ||
      option.attributeValue.translations?.[0];
    return translation?.label || option.attributeValue.value || '';
  }
  return option.value || '';
}

function readVariantDirectAttribute(
  variant: Variant,
  attributeKey: 'color' | 'size'
): string {
  const legacyVariant = variant as Variant & { color?: string; size?: string };
  const directValue = attributeKey === 'color' ? legacyVariant.color : legacyVariant.size;
  return typeof directValue === 'string' ? directValue.trim() : '';
}

function readSizeFromSku(sku: string | null | undefined): string {
  if (!sku) {
    return '';
  }

  const skuParts = sku.split('-');
  if (skuParts.length < 3) {
    return '';
  }

  return skuParts[2]?.trim() ?? '';
}

function readJsonAttributeValues(
  attributes: Variant['attributes'],
  key: 'color' | 'size'
): string[] {
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return [];
  }
  if (!(key in attributes)) {
    return [];
  }
  const attr = (attributes as Record<string, unknown>)[key];
  const items = Array.isArray(attr) ? attr : attr ? [attr] : [];
  return items
    .map((item) => {
      if (item && typeof item === 'object' && 'value' in item) {
        const value = (item as { value?: unknown }).value;
        return typeof value === 'string' ? value.trim() : '';
      }
      return typeof item === 'string' ? item.trim() : '';
    })
    .filter(Boolean);
}

/**
 * Collects unique color options from product variants and product attributes.
 */
export function collectProductColors(
  product: ProductWithRelations,
  lang: string
): ProductColorOption[] {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const colorMap = new Map<string, ProductColorOption>();

  variants.forEach((variant) => {
    const options = Array.isArray(variant.options) ? variant.options : [];
    const colorOptions = options.filter(isColorOption);

    colorOptions.forEach((colorOption) => {
      const colorValue = resolveOptionValue(colorOption, lang);
      if (!colorValue) {
        return;
      }

      let imageUrl: string | null | undefined = null;
      let colorsHex: string[] | null | undefined = null;

      if ('attributeValue' in colorOption && colorOption.attributeValue) {
        imageUrl = colorOption.attributeValue.imageUrl || null;
        const colorsValue = colorOption.attributeValue.colors;
        colorsHex =
          Array.isArray(colorsValue) &&
          colorsValue.every((color): color is string => typeof color === 'string')
            ? colorsValue
            : null;
      }

      const normalizedValue = colorValue.trim().toLowerCase();
      if (!colorMap.has(normalizedValue) || (imageUrl && !colorMap.get(normalizedValue)?.imageUrl)) {
        colorMap.set(normalizedValue, {
          value: colorValue.trim(),
          imageUrl: imageUrl || null,
          colors: colorsHex || null,
        });
      }
    });

    if (colorOptions.length === 0) {
      readJsonAttributeValues(variant.attributes, 'color').forEach((colorValue) => {
        const normalizedValue = colorValue.toLowerCase();
        if (!colorMap.has(normalizedValue)) {
          colorMap.set(normalizedValue, { value: colorValue, imageUrl: null, colors: null });
        }
      });
    }
  });

  const productAttrs: ProductAttributeWithColor[] =
    product && 'productAttributes' in product && Array.isArray(product.productAttributes)
      ? (product.productAttributes as ProductAttributeWithColor[])
      : [];

  productAttrs.forEach((productAttr) => {
    const attr = productAttr.attribute;
    if (!attr || typeof attr !== 'object' || !('key' in attr) || attr.key !== 'color') {
      return;
    }
    if (!('values' in attr) || !Array.isArray(attr.values)) {
      return;
    }

    attr.values.forEach((attrValue) => {
      const translation =
        attrValue.translations?.find((t) => t.locale === lang) || attrValue.translations?.[0];
      const colorValue = translation?.label || attrValue.value || '';
      if (!colorValue) {
        return;
      }

      const normalizedValue = colorValue.trim().toLowerCase();
      if (!colorMap.has(normalizedValue)) {
        return;
      }

      const existing = colorMap.get(normalizedValue);
      if (attrValue.imageUrl || attrValue.colors) {
        colorMap.set(normalizedValue, {
          value: colorValue.trim(),
          imageUrl: attrValue.imageUrl || existing?.imageUrl || null,
          colors: attrValue.colors || existing?.colors || null,
        });
      }
    });
  });

  return Array.from(colorMap.values());
}

function upsertSize(
  sizeMap: Map<string, ProductSizeOption>,
  value: string,
  label: string,
  stock: number
): void {
  const trimmedValue = value.trim();
  const trimmedLabel = label.trim() || trimmedValue;
  if (!trimmedValue) {
    return;
  }

  const key = trimmedValue.toLowerCase();
  const existing = sizeMap.get(key);
  const inStock = stock > 0;

  if (!existing) {
    sizeMap.set(key, { value: trimmedValue, label: trimmedLabel, inStock });
    return;
  }

  sizeMap.set(key, {
    value: existing.value,
    label: existing.label || trimmedLabel,
    inStock: existing.inStock || inStock,
  });
}

function sortSizes(sizes: ProductSizeOption[]): ProductSizeOption[] {
  return [...sizes].sort((a, b) => {
    const aNum = Number(a.value);
    const bNum = Number(b.value);
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
      return aNum - bNum;
    }

    const aIndex = SIZE_LETTER_ORDER.indexOf(a.value.toUpperCase() as (typeof SIZE_LETTER_ORDER)[number]);
    const bIndex = SIZE_LETTER_ORDER.indexOf(b.value.toUpperCase() as (typeof SIZE_LETTER_ORDER)[number]);
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) {
      return -1;
    }
    if (bIndex !== -1) {
      return 1;
    }
    return a.label.localeCompare(b.label);
  });
}

/**
 * Collects unique size options from product variants with stock availability.
 */
export function collectProductSizes(
  product: ProductWithRelations,
  lang: string
): ProductSizeOption[] {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const sizeMap = new Map<string, ProductSizeOption>();

  variants.forEach((variant) => {
    const stock = variant.stock ?? 0;
    const options = Array.isArray(variant.options) ? variant.options : [];
    const sizeOptions = options.filter(isSizeOption);

    sizeOptions.forEach((sizeOption) => {
      const value =
        ('attributeValue' in sizeOption && sizeOption.attributeValue?.value) ||
        sizeOption.value ||
        '';
      const label = resolveOptionLabel(sizeOption, lang, value);
      upsertSize(sizeMap, value, label, stock);
    });

    if (sizeOptions.length === 0) {
      const directSize = readVariantDirectAttribute(variant, 'size');
      if (directSize) {
        upsertSize(sizeMap, directSize, directSize, stock);
      }

      const skuSize = readSizeFromSku(variant.sku);
      if (skuSize) {
        upsertSize(sizeMap, skuSize, skuSize, stock);
      }

      readJsonAttributeValues(variant.attributes, 'size').forEach((sizeValue) => {
        upsertSize(sizeMap, sizeValue, sizeValue, stock);
      });
    }
  });

  return sortSizes(Array.from(sizeMap.values()));
}
