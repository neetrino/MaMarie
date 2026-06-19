'use client';

import { useEffect, useMemo, useState } from 'react';
import { getStoredLanguage, setStoredLanguage, type LanguageCode } from '../../lib/language';

const HEADER_LANGUAGES: ReadonlyArray<{ code: LanguageCode; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'hy', label: 'AM' },
  { code: 'ru', label: 'RU' },
];

/** Matches currency chevron / dropdown animation timing. */
const LANGUAGE_SLIDE_ANIMATION_MS = 300;

export function HeaderLanguagePill() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(getStoredLanguage());

  const activeIndex = useMemo(
    () => HEADER_LANGUAGES.findIndex(({ code }) => code === currentLang),
    [currentLang],
  );

  useEffect(() => {
    const handleLanguageUpdate = () => {
      setCurrentLang(getStoredLanguage());
    };

    window.addEventListener('language-updated', handleLanguageUpdate);
    return () => {
      window.removeEventListener('language-updated', handleLanguageUpdate);
    };
  }, []);

  const handleLanguageChange = (langCode: LanguageCode) => {
    if (langCode === currentLang) return;

    setCurrentLang(langCode);
    setStoredLanguage(langCode, { skipReload: true });

    window.setTimeout(() => {
      window.location.reload();
    }, LANGUAGE_SLIDE_ANIMATION_MS);
  };

  return (
    <div
      className="relative grid h-[41px] grid-cols-3 items-center rounded-[22px] bg-brand-yellow p-1"
      role="group"
      aria-label="Language"
    >
      <span
        aria-hidden
        className="absolute bottom-1 top-1 left-1 rounded-[18px] bg-brand-pink transition-transform ease-in-out"
        style={{
          width: 'calc((100% - 8px) / 3)',
          transform: `translateX(calc(${activeIndex} * 100%))`,
          transitionDuration: `${LANGUAGE_SLIDE_ANIMATION_MS}ms`,
        }}
      />

      {HEADER_LANGUAGES.map(({ code, label }) => {
        const isActive = code === currentLang;

        return (
          <button
            key={code}
            type="button"
            onClick={() => handleLanguageChange(code)}
            className={`relative z-10 min-w-[34px] rounded-[18px] px-2.5 py-1.5 text-sm font-medium leading-[15px] transition-colors duration-300 ${
              isActive ? 'text-brand-on-pink' : 'text-brand-muted hover:text-brand-brown'
            }`}
            style={{ transitionDuration: `${LANGUAGE_SLIDE_ANIMATION_MS}ms` }}
            aria-pressed={isActive}
            aria-label={`Switch to ${label}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
