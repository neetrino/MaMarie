import { getAttributeLabel, t } from '@/lib/i18n';
import type { LanguageCode } from '@/lib/language';

/**
 * Prefer API/DB translation label; fall back to static attributes.json lookup.
 */
export function resolveAttributeValueDisplayLabel(
  language: LanguageCode,
  attrKey: string,
  value: string,
  label?: string | null,
): string {
  const fromApi = label?.trim();
  if (fromApi) {
    return fromApi;
  }
  return getAttributeLabel(language, attrKey, value);
}

/**
 * Prefer admin AttributeTranslation name; fall back to product.* UI copy.
 */
export function resolveAttributeNameDisplay(
  language: LanguageCode,
  attrKey: string,
  apiName?: string | null,
): string {
  const fromApi = apiName?.trim();
  if (fromApi && fromApi.toLowerCase() !== attrKey.toLowerCase()) {
    return fromApi;
  }

  if (attrKey === 'color') {
    return t(language, 'product.color');
  }
  if (attrKey === 'size') {
    return t(language, 'product.size');
  }

  if (fromApi) {
    return fromApi;
  }

  return attrKey.charAt(0).toUpperCase() + attrKey.slice(1);
}
