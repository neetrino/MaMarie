import {
  attributeLocaleTextMapFromRows,
  emptyAttributeLocaleTextMap,
  pickPrimaryAttributeText,
  toAttributeTranslationRows,
  type AttributeLocaleTextMap,
} from '@/lib/admin/attribute-locale-helpers';
import {
  pickProductContentTranslation,
  PRIMARY_PRODUCT_CONTENT_LOCALE,
} from '@/constants/product-content-locales';
import { toSlug } from '@/lib/utils/slug';

export type CategoryLocaleTitleMap = AttributeLocaleTextMap;

export const emptyCategoryLocaleTitleMap = emptyAttributeLocaleTextMap;
export const categoryLocaleTitleMapFromRows = attributeLocaleTextMapFromRows;
export const pickPrimaryCategoryTitle = pickPrimaryAttributeText;

export function resolveDisplayTitle(
  translations: Array<{ locale: string; title: string }> | undefined,
  fallback: string,
): string {
  const picked = pickProductContentTranslation(translations ?? [], PRIMARY_PRODUCT_CONTENT_LOCALE);
  return picked?.title?.trim() || fallback;
}

export function toCategoryTranslationRows(
  map: CategoryLocaleTitleMap,
  sharedSlug: string,
): Array<{ locale: string; title: string; slug: string }> {
  const slug = sharedSlug.trim();
  return toAttributeTranslationRows(map).map((row) => ({
    locale: row.locale,
    title: row.text,
    slug,
  }));
}

/** Prefer English (already Latin) for slug; otherwise primary filled title. */
export function resolveCategorySlugSource(map: CategoryLocaleTitleMap): string {
  const english = map.en.trim();
  if (english) {
    return english;
  }
  return pickPrimaryCategoryTitle(map);
}

export function resolveCategorySlug(
  map: CategoryLocaleTitleMap,
  currentSlug: string,
  slugIsManual: boolean,
): string {
  if (slugIsManual) {
    return currentSlug;
  }
  return toSlug(resolveCategorySlugSource(map));
}
