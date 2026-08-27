import {
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  PRODUCT_CONTENT_LOCALES,
  pickProductContentTranslation,
  type ProductContentLocale,
} from '@/constants/product-content-locales';

export type AttributeLocaleTextMap = Record<ProductContentLocale, string>;

export function emptyAttributeLocaleTextMap(): AttributeLocaleTextMap {
  return { en: '', hy: '', ru: '' };
}

export function attributeLocaleTextMapFromRows(
  rows: Array<{ locale: string; text: string }> | undefined,
): AttributeLocaleTextMap {
  const map = emptyAttributeLocaleTextMap();
  if (!rows) {
    return map;
  }

  for (const row of rows) {
    if ((PRODUCT_CONTENT_LOCALES as readonly string[]).includes(row.locale)) {
      map[row.locale as ProductContentLocale] = row.text;
    }
  }

  return map;
}

export function pickPrimaryAttributeText(map: AttributeLocaleTextMap): string {
  const primary = map[PRIMARY_PRODUCT_CONTENT_LOCALE]?.trim();
  if (primary) {
    return primary;
  }

  for (const locale of PRODUCT_CONTENT_LOCALES) {
    const value = map[locale]?.trim();
    if (value) {
      return value;
    }
  }

  return '';
}

export function toAttributeTranslationRows(
  map: AttributeLocaleTextMap,
): Array<{ locale: ProductContentLocale; text: string }> {
  return PRODUCT_CONTENT_LOCALES.map((locale) => ({
    locale,
    text: map[locale].trim(),
  })).filter((row) => row.text.length > 0);
}

export function resolveDisplayLabel(
  translations: Array<{ locale: string; label: string }> | undefined,
  fallback: string,
): string {
  const picked = pickProductContentTranslation(translations ?? [], PRIMARY_PRODUCT_CONTENT_LOCALE);
  return picked?.label?.trim() || fallback;
}

export function resolveDisplayName(
  translations: Array<{ locale: string; name: string }> | undefined,
  fallback: string,
): string {
  const picked = pickProductContentTranslation(translations ?? [], PRIMARY_PRODUCT_CONTENT_LOCALE);
  return picked?.name?.trim() || fallback;
}

export function slugifyAttributeKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function slugifyAttributeValue(raw: string): string {
  const ascii = raw
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  if (ascii.length > 0) {
    return ascii;
  }

  // Non-Latin labels (hy/ru): stable slug from unicode code points
  return `v-${Array.from(raw.trim().toLowerCase())
    .map((ch) => ch.codePointAt(0)?.toString(36) ?? '')
    .join('')
    .slice(0, 48)}`;
}

export function resolveAttributeKeyFromNames(map: AttributeLocaleTextMap): string {
  const fromEnglish = slugifyAttributeKey(map.en);
  if (fromEnglish) {
    return fromEnglish;
  }

  const fromPrimary = slugifyAttributeKey(pickPrimaryAttributeText(map));
  if (fromPrimary) {
    return fromPrimary;
  }

  return `attr-${Date.now().toString(36)}`;
}
