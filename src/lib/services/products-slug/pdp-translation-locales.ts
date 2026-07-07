import { DEFAULT_LANGUAGE, LANGUAGES } from "@/lib/language";

/**
 * Preferred locales for PDP translation joins.
 * Includes all storefront languages so transform `find(lang) || [0]` fallback is preserved.
 */
export function pdpTranslationLocaleFilter(lang: string): { in: string[] } {
  const locales = new Set<string>([lang, DEFAULT_LANGUAGE, ...Object.keys(LANGUAGES)]);
  return { in: [...locales] };
}
