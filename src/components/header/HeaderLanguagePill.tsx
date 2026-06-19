'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LANGUAGE,
  setStoredLanguage,
  type LanguageCode,
} from '../../lib/language';
import { useTranslation } from '../../lib/i18n-client';

const HEADER_LANGUAGES: ReadonlyArray<{ code: LanguageCode; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'hy', label: 'AM' },
  { code: 'ru', label: 'RU' },
];

/** Matches currency chevron / dropdown animation timing. */
const LANGUAGE_SLIDE_ANIMATION_MS = 300;

/** AM tab index — used when stored language is not shown in the header switcher. */
const ARMENIAN_TAB_INDEX = HEADER_LANGUAGES.findIndex(({ code }) => code === DEFAULT_LANGUAGE);

function resolveHeaderLanguageTabIndex(lang: LanguageCode): number {
  const index = HEADER_LANGUAGES.findIndex(({ code }) => code === lang);
  return index >= 0 ? index : ARMENIAN_TAB_INDEX;
}

export function HeaderLanguagePill() {
  const { t, lang } = useTranslation();
  const [slideAnimationEnabled, setSlideAnimationEnabled] = useState(false);

  const activeIndex = useMemo(
    () => resolveHeaderLanguageTabIndex(lang),
    [lang],
  );

  // Enable slider animation only after hydration + localStorage sync (avoids mismatch jump).
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setSlideAnimationEnabled(true);
    });
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  const handleLanguageChange = (langCode: LanguageCode) => {
    if (langCode === lang) return;

    setStoredLanguage(langCode, { skipReload: true });

    window.setTimeout(() => {
      window.location.reload();
    }, LANGUAGE_SLIDE_ANIMATION_MS);
  };

  return (
    <div
      className="relative grid h-[41px] grid-cols-3 items-center rounded-[22px] bg-brand-yellow p-1"
      role="group"
      aria-label={t('common.navigation.language')}
    >
      <span
        aria-hidden
        className="absolute bottom-1 top-1 left-1 rounded-[18px] bg-brand-pink ease-in-out"
        style={{
          width: 'calc((100% - 8px) / 3)',
          transform: `translateX(calc(${activeIndex} * 100%))`,
          transitionProperty: 'transform',
          transitionDuration: slideAnimationEnabled ? `${LANGUAGE_SLIDE_ANIMATION_MS}ms` : '0ms',
        }}
      />

      {HEADER_LANGUAGES.map(({ code, label }) => {
        const isActive = code === lang;

        return (
          <button
            key={code}
            type="button"
            onClick={() => handleLanguageChange(code)}
            className={`relative z-10 min-w-[34px] rounded-[18px] px-2.5 py-1.5 text-sm font-medium leading-[15px] transition-colors ${
              isActive ? 'text-brand-on-pink' : 'text-brand-muted hover:text-brand-brown'
            }`}
            style={{
              transitionDuration: slideAnimationEnabled ? `${LANGUAGE_SLIDE_ANIMATION_MS}ms` : '0ms',
            }}
            aria-pressed={isActive}
            aria-label={`${t('common.navigation.language')}: ${label}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
