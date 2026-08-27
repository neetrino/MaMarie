import {
  FALLBACK_PRODUCT_CONTENT_LOCALE,
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  type ProductContentLocale,
} from '@/constants/product-content-locales';

type CategoryTranslationRow = { locale: string; title: string };
type BrandTranslationRow = { locale: string; name: string };
type AttributeTranslationRow = { locale: string; name: string };
type AttributeValueTranslationRow = { locale: string; label: string };

/**
 * Admin reference labels: honor the selected content locale strictly.
 * English tab must not fall back to Armenian copy.
 */
function pickAdminReferenceLocaleTranslation<T extends { locale: string }>(
  rows: T[],
  locale: ProductContentLocale,
): T | undefined {
  const direct = rows.find((row) => row.locale === locale);
  if (direct) {
    return direct;
  }

  if (locale === PRIMARY_PRODUCT_CONTENT_LOCALE) {
    return rows.find((row) => row.locale === FALLBACK_PRODUCT_CONTENT_LOCALE);
  }

  if (locale === 'ru') {
    return (
      rows.find((row) => row.locale === PRIMARY_PRODUCT_CONTENT_LOCALE) ??
      rows.find((row) => row.locale === FALLBACK_PRODUCT_CONTENT_LOCALE)
    );
  }

  return undefined;
}

function humanizeSlug(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function resolveCategoryTitleForLocale(
  entity: { title: string; slug?: string; translations?: CategoryTranslationRow[] },
  locale: ProductContentLocale,
): string {
  const row = pickAdminReferenceLocaleTranslation(entity.translations ?? [], locale);
  if (row?.title?.trim()) {
    return row.title.trim();
  }

  if (locale === FALLBACK_PRODUCT_CONTENT_LOCALE) {
    return humanizeSlug(entity.slug ?? '') || entity.title;
  }

  if (locale === PRIMARY_PRODUCT_CONTENT_LOCALE) {
    return entity.title;
  }

  return entity.title;
}

export function resolveBrandNameForLocale(
  entity: { name: string; slug?: string; translations?: BrandTranslationRow[] },
  locale: ProductContentLocale,
): string {
  const row = pickAdminReferenceLocaleTranslation(entity.translations ?? [], locale);
  if (row?.name?.trim()) {
    return row.name.trim();
  }

  if (locale === FALLBACK_PRODUCT_CONTENT_LOCALE) {
    return humanizeSlug(entity.slug ?? '') || entity.name;
  }

  if (locale === PRIMARY_PRODUCT_CONTENT_LOCALE) {
    return entity.name;
  }

  return entity.name;
}

export function resolveAttributeNameForLocale(
  entity: { name: string; key?: string; translations?: AttributeTranslationRow[] },
  locale: ProductContentLocale,
): string {
  const row = pickAdminReferenceLocaleTranslation(entity.translations ?? [], locale);
  if (row?.name?.trim()) {
    return row.name.trim();
  }

  if (locale === FALLBACK_PRODUCT_CONTENT_LOCALE) {
    return humanizeSlug(entity.key ?? '') || entity.name;
  }

  if (locale === PRIMARY_PRODUCT_CONTENT_LOCALE) {
    return entity.name;
  }

  return entity.name;
}

export function resolveAttributeValueLabelForLocale(
  entity: { label: string; value: string; translations?: AttributeValueTranslationRow[] },
  locale: ProductContentLocale,
): string {
  const row = pickAdminReferenceLocaleTranslation(entity.translations ?? [], locale);
  if (row?.label?.trim()) {
    return row.label.trim();
  }

  if (locale === FALLBACK_PRODUCT_CONTENT_LOCALE) {
    return humanizeSlug(entity.value) || entity.label;
  }

  if (locale === PRIMARY_PRODUCT_CONTENT_LOCALE) {
    return entity.label;
  }

  return humanizeSlug(entity.value) || entity.label;
}

export function localizeCategoriesForDisplay<
  T extends { title: string; slug?: string; translations?: CategoryTranslationRow[] },
>(categories: T[], locale: ProductContentLocale): T[] {
  return categories.map((category) => ({
    ...category,
    title: resolveCategoryTitleForLocale(category, locale),
  }));
}

export function localizeBrandsForDisplay<
  T extends { name: string; slug?: string; translations?: BrandTranslationRow[] },
>(brands: T[], locale: ProductContentLocale): T[] {
  return brands.map((brand) => ({
    ...brand,
    name: resolveBrandNameForLocale(brand, locale),
  }));
}

export function localizeAttributesForDisplay<
  T extends {
    name: string;
    key?: string;
    translations?: AttributeTranslationRow[];
    values: Array<{ label: string; value: string; translations?: AttributeValueTranslationRow[] }>;
  },
>(attributes: T[], locale: ProductContentLocale): T[] {
  return attributes.map((attribute) => ({
    ...attribute,
    name: resolveAttributeNameForLocale(attribute, locale),
    values: attribute.values.map((value) => ({
      ...value,
      label: resolveAttributeValueLabelForLocale(value, locale),
    })),
  }));
}
