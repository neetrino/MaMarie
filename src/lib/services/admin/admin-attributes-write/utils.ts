import {
  resolveDisplayLabel,
  resolveDisplayName,
} from '@/lib/admin/attribute-locale-helpers';

/**
 * Parse colors data from various formats to string array
 */
export function parseColors(colorsData: unknown): string[] {
  if (!colorsData) {
    return [];
  }

  if (Array.isArray(colorsData)) {
    return colorsData.filter((item): item is string => typeof item === 'string');
  }

  if (typeof colorsData === 'string') {
    try {
      const parsed = JSON.parse(colorsData);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [];
    } catch {
      return [];
    }
  }

  if (typeof colorsData === 'object') {
    return Array.isArray(colorsData)
      ? colorsData.filter((item): item is string => typeof item === 'string')
      : [];
  }

  return [];
}

/**
 * Format attribute value for response
 */
export function formatAttributeValue(
  val: {
    id: string;
    value: string;
    translations?: Array<{ locale: string; label: string }>;
    colors?: unknown;
    imageUrl?: string | null;
  },
  locale?: string,
): {
  id: string;
  value: string;
  label: string;
  colors: string[];
  imageUrl: string | null;
  translations: Array<{ locale: string; label: string }>;
} {
  const translations = Array.isArray(val.translations) ? val.translations : [];
  const localeMatch = locale
    ? translations.find((row) => row.locale === locale)
    : undefined;

  return {
    id: val.id,
    value: val.value,
    label: localeMatch?.label || resolveDisplayLabel(translations, val.value),
    colors: parseColors(val.colors),
    imageUrl: val.imageUrl || null,
    translations,
  };
}

/**
 * Format attribute for response
 */
export function formatAttribute(
  attribute: {
    id: string;
    key: string;
    type: string;
    filterable: boolean;
    translations?: Array<{ locale: string; name: string }>;
    values?: Array<{
      id: string;
      value: string;
      translations?: Array<{ locale: string; label: string }>;
      colors?: unknown;
      imageUrl?: string | null;
    }>;
  },
  locale?: string,
): {
  id: string;
  key: string;
  name: string;
  type: string;
  filterable: boolean;
  translations: Array<{ locale: string; name: string }>;
  values: Array<{
    id: string;
    value: string;
    label: string;
    colors: string[];
    imageUrl: string | null;
    translations: Array<{ locale: string; label: string }>;
  }>;
} {
  const translations = Array.isArray(attribute.translations) ? attribute.translations : [];
  const localeMatch = locale
    ? translations.find((row) => row.locale === locale)
    : undefined;
  const values = attribute.values || [];

  return {
    id: attribute.id,
    key: attribute.key,
    name: localeMatch?.name || resolveDisplayName(translations, attribute.key),
    type: attribute.type,
    filterable: attribute.filterable,
    translations,
    values: values.map((val) => formatAttributeValue(val, locale)),
  };
}
