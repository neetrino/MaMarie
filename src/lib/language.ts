// Language utilities
export const LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  hy: { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  ka: { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

const LANGUAGE_STORAGE_KEY = 'shop_language';

/** MAMARIE default storefront language. */
export const DEFAULT_LANGUAGE: LanguageCode = 'hy';

export function getStoredLanguage(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && stored in LANGUAGES) {
      return stored as LanguageCode;
    }
  } catch {
    // Ignore errors
  }
  return DEFAULT_LANGUAGE;
}

/** Scroll Y captured before a client-side language switch; consumed once after re-render. */
let pendingLanguageScrollY: number | null = null;

export function takePendingLanguageScrollY(): number | null {
  const scrollY = pendingLanguageScrollY;
  pendingLanguageScrollY = null;
  return scrollY;
}

/** Persists locale and updates UI via `language-updated` without a full page reload. */
export function setStoredLanguage(language: LanguageCode): void {
  if (typeof window === 'undefined') return;
  try {
    pendingLanguageScrollY = window.scrollY;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    window.dispatchEvent(new Event('language-updated'));
  } catch (error) {
    console.error('Failed to save language:', error);
  }
}

