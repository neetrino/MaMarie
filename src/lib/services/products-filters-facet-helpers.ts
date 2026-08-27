import { Prisma } from '@white-shop/db';
import {
  FALLBACK_PRODUCT_CONTENT_LOCALE,
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  pickProductContentTranslation,
} from '@/constants/product-content-locales';
import type { CatalogFilterSizeOption } from './products-filters-aggregate';

export const COLOR_ATTRIBUTE_KEY = 'color';
export const SIZE_ATTRIBUTE_KEY = 'size';
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

function readTranslationText(row: { name?: string; label?: string } | undefined): string {
  return row?.name?.trim() || row?.label?.trim() || '';
}

/**
 * Storefront facet label: requested locale → Armenian → English → fallback.
 */
export function pickFacetTranslation(
  rows: Array<{ locale: string; name?: string; label?: string }>,
  lang: string,
  fallback: string
): string {
  const picked = pickProductContentTranslation(rows, lang);
  const fromPicked = readTranslationText(picked);
  if (fromPicked) {
    return fromPicked;
  }

  const armenian = rows.find((row) => row.locale === PRIMARY_PRODUCT_CONTENT_LOCALE);
  const fromArmenian = readTranslationText(armenian);
  if (fromArmenian) {
    return fromArmenian;
  }

  const english = rows.find((row) => row.locale === FALLBACK_PRODUCT_CONTENT_LOCALE);
  const fromEnglish = readTranslationText(english);
  if (fromEnglish) {
    return fromEnglish;
  }

  return fallback;
}

export function readColorHex(colors: Prisma.JsonValue): string[] | null {
  if (!Array.isArray(colors) || !colors.every((item): item is string => typeof item === 'string')) {
    return null;
  }
  return colors;
}

export function sortSizeFacetOptions(sizes: CatalogFilterSizeOption[]): CatalogFilterSizeOption[] {
  return [...sizes].sort((a, b) => {
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
    const aNum = Number(a.value);
    const bNum = Number(b.value);
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.value.localeCompare(b.value);
  });
}
