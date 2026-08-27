import {
  attributeLocaleTextMapFromRows,
  emptyAttributeLocaleTextMap,
  pickPrimaryAttributeText,
  toAttributeTranslationRows,
  type AttributeLocaleTextMap,
} from '@/lib/admin/attribute-locale-helpers';
import { toSlug } from '@/lib/utils/slug';

export type BrandLocaleNameMap = AttributeLocaleTextMap;

export const emptyBrandLocaleNameMap = emptyAttributeLocaleTextMap;
export const brandLocaleNameMapFromRows = attributeLocaleTextMapFromRows;
export const pickPrimaryBrandName = pickPrimaryAttributeText;

export function toBrandTranslationRows(
  map: BrandLocaleNameMap,
): Array<{ locale: string; name: string }> {
  return toAttributeTranslationRows(map).map((row) => ({
    locale: row.locale,
    name: row.text,
  }));
}

/** Prefer English (already Latin) for slug; otherwise primary filled name. */
export function resolveBrandSlugSource(map: BrandLocaleNameMap): string {
  const english = map.en.trim();
  if (english) {
    return english;
  }
  return pickPrimaryBrandName(map);
}

export function resolveBrandSlug(
  map: BrandLocaleNameMap,
  currentSlug: string,
  slugIsManual: boolean,
): string {
  if (slugIsManual) {
    return currentSlug;
  }
  return toSlug(resolveBrandSlugSource(map));
}
