import { translations } from "../../translations";
import { pickProductContentTranslation } from "@/constants/product-content-locales";

/** Pick product copy: requested locale → hy → en → first row. */
export function pickTranslationByLocale<T extends { locale: string }>(
  rows: T[],
  lang: string,
): T | undefined {
  return pickProductContentTranslation(rows, lang);
}

/**
 * Get "Out of Stock" translation for a given language
 */
export function getOutOfStockLabel(lang: string = "en"): string {
  const langKey = lang as keyof typeof translations;
  const translation = translations[langKey] || translations.en;
  return translation.stock.outOfStock;
}




