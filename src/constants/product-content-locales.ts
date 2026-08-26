import { HEADER_LANGUAGES } from './header-languages';

export const PRODUCT_CONTENT_LOCALES = ['en', 'hy', 'ru'] as const;

export type ProductContentLocale = (typeof PRODUCT_CONTENT_LOCALES)[number];

export const DEFAULT_PRODUCT_CONTENT_LOCALE: ProductContentLocale = 'hy';
export const PRIMARY_PRODUCT_CONTENT_LOCALE: ProductContentLocale = 'hy';
export const FALLBACK_PRODUCT_CONTENT_LOCALE: ProductContentLocale = 'en';

export const PRODUCT_CONTENT_LOCALE_TABS: ReadonlyArray<{
  code: ProductContentLocale;
  label: string;
}> = HEADER_LANGUAGES.filter((item): item is { code: ProductContentLocale; label: string } =>
  PRODUCT_CONTENT_LOCALES.includes(item.code as ProductContentLocale),
);

export function isProductContentLocale(value: string): value is ProductContentLocale {
  return (PRODUCT_CONTENT_LOCALES as readonly string[]).includes(value);
}

export function productContentLocaleLabel(locale: ProductContentLocale): string {
  const tab = PRODUCT_CONTENT_LOCALE_TABS.find((item) => item.code === locale);
  return tab?.label ?? locale.toUpperCase();
}

/**
 * Product copy fallback: requested locale → Armenian → English → first row.
 */
export function pickProductContentTranslation<T extends { locale: string }>(
  rows: T[],
  lang: string,
): T | undefined {
  if (rows.length === 0) {
    return undefined;
  }

  const requested = rows.find((row) => row.locale === lang);
  if (requested) {
    return requested;
  }

  const armenian = rows.find((row) => row.locale === DEFAULT_PRODUCT_CONTENT_LOCALE);
  if (armenian) {
    return armenian;
  }

  const english = rows.find((row) => row.locale === FALLBACK_PRODUCT_CONTENT_LOCALE);
  if (english) {
    return english;
  }

  return rows[0];
}
