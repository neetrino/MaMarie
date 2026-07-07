import { translations } from "../../translations";

/** Pick translation for locale, falling back to the first available row. */
export function pickTranslationByLocale<T extends { locale: string }>(
  rows: T[],
  lang: string,
): T | undefined {
  return rows.find((row) => row.locale === lang) ?? rows[0];
}

/**
 * Get "Out of Stock" translation for a given language
 */
export function getOutOfStockLabel(lang: string = "en"): string {
  const langKey = lang as keyof typeof translations;
  const translation = translations[langKey] || translations.en;
  return translation.stock.outOfStock;
}




