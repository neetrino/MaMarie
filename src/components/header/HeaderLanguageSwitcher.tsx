'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  HEADER_LANGUAGES,
  HEADER_LANGUAGE_SWITCHER_HEIGHT_PX,
  HEADER_LANGUAGE_SWITCHER_SLIDE_ANIMATION_MS,
  HEADER_LANGUAGE_SWITCHER_WIDTH_PX,
  resolveHeaderLanguageTabIndex,
} from '../../constants/header-languages';
import { setStoredLanguage, type LanguageCode } from '../../lib/language';
import { useTranslation } from '../../lib/i18n-client';

/** Desktop header pill + mobile dropdown — yellow track with sliding pink segment. */
export function HeaderLanguageSwitcher() {
  const { t, lang } = useTranslation();
  const [slideAnimationEnabled, setSlideAnimationEnabled] = useState(false);

  const activeIndex = useMemo(
    () => resolveHeaderLanguageTabIndex(lang),
    [lang],
  );

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
    setStoredLanguage(langCode);
  };

  return (
    <div
      className="relative grid grid-cols-3 items-center rounded-[22px] bg-brand-yellow p-1"
      style={{
        height: HEADER_LANGUAGE_SWITCHER_HEIGHT_PX,
        width: HEADER_LANGUAGE_SWITCHER_WIDTH_PX,
      }}
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
          transitionDuration: slideAnimationEnabled
            ? `${HEADER_LANGUAGE_SWITCHER_SLIDE_ANIMATION_MS}ms`
            : '0ms',
        }}
      />

      {HEADER_LANGUAGES.map(({ code, label }) => {
        const isActive = code === lang;

        return (
          <button
            key={code}
            type="button"
            onClick={() => handleLanguageChange(code)}
            className={`relative z-10 flex w-full items-center justify-center rounded-[18px] px-1 py-1.5 text-sm font-medium leading-[15px] transition-colors ${
              isActive ? 'text-brand-on-pink' : 'text-brand-muted hover:text-brand-brown'
            }`}
            style={{
              transitionDuration: slideAnimationEnabled
                ? `${HEADER_LANGUAGE_SWITCHER_SLIDE_ANIMATION_MS}ms`
                : '0ms',
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
