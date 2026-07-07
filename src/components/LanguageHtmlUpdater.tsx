'use client';

import { useEffect } from 'react';
import { getStoredLanguage, syncShopLanguageCookieFromStorage } from '../lib/language';

/**
 * Component that updates the html lang attribute based on stored language
 * This ensures proper language attribute for SEO and accessibility
 */
export function LanguageHtmlUpdater() {
  useEffect(() => {
    const updateHtmlLang = () => {
      const lang = getStoredLanguage();
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    };

    // Sync SSR cookie so catalog pages use the same locale as localStorage.
    syncShopLanguageCookieFromStorage();

    // Update on mount
    updateHtmlLang();

    // Update when language changes
    const handleLanguageUpdate = () => {
      updateHtmlLang();
    };

    window.addEventListener('language-updated', handleLanguageUpdate);
    return () => {
      window.removeEventListener('language-updated', handleLanguageUpdate);
    };
  }, []);

  return null;
}






