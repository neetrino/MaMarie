'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrandChevronDown, BRAND_CHEVRON_LOGIN_INK } from './BrandChevronDown';
import {
  HEADER_LANGUAGES,
  HEADER_LANGUAGE_SWITCHER_SLIDE_ANIMATION_MS,
} from '../../constants/header-languages';
import { HEADER_PROFILE_MENU_DROPDOWN_GAP_PX } from '../../constants/header';
import {
  CURRENCIES,
  setStoredCurrency,
  type CurrencyCode,
} from '../../lib/currency';
import { LANGUAGES, setStoredLanguage, type LanguageCode } from '../../lib/language';
import { useCurrency } from '../hooks/useCurrency';
import { useTranslation } from '../../lib/i18n-client';

const LOCALE_CHEVRON_WIDTH_PX = 18;
const LOCALE_DROPDOWN_ANIMATION_MS = HEADER_LANGUAGE_SWITCHER_SLIDE_ANIMATION_MS;
const LOCALE_DROPDOWN_GAP_PX = HEADER_PROFILE_MENU_DROPDOWN_GAP_PX;

function resolveLanguageLabel(lang: LanguageCode): string {
  return HEADER_LANGUAGES.find(({ code }) => code === lang)?.label ?? 'AM';
}

interface HeaderLocaleCurrencyPillProps {
  className?: string;
}

/**
 * Combined locale control — pill `AMD/AM`; dropdown splits currency + language.
 */
export function HeaderLocaleCurrencyPill({ className = '' }: HeaderLocaleCurrencyPillProps) {
  const { t, lang } = useTranslation();
  const currency = useCurrency();
  const languageLabel = useMemo(() => resolveLanguageLabel(lang), [lang]);

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openDropdown = useCallback(() => {
    clearCloseTimer();
    setIsOpen(true);
    setIsDropdownVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDropdownExpanded(true);
      });
    });
  }, [clearCloseTimer]);

  const closeDropdown = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
    setIsDropdownExpanded(false);
    closeTimerRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
      closeTimerRef.current = null;
    }, LOCALE_DROPDOWN_ANIMATION_MS);
  }, [clearCloseTimer]);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
      return;
    }
    openDropdown();
  }, [closeDropdown, isOpen, openDropdown]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown, isOpen]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  const handleCurrencySelect = (code: CurrencyCode) => {
    if (code !== currency) {
      setStoredCurrency(code);
    }
    closeDropdown();
  };

  const handleLanguageSelect = (code: LanguageCode) => {
    if (code !== lang) {
      setStoredLanguage(code);
    }
    closeDropdown();
  };

  return (
    <div ref={containerRef} className={`relative inline-block shrink-0 ${className}`.trim()}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex h-[41px] items-center justify-center gap-1 rounded-[22px] bg-brand-yellow px-3.5 text-[#4B5563] transition-opacity hover:opacity-90"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`${currency}/${languageLabel}`}
      >
        <span className="flex items-center whitespace-nowrap text-[15px] font-bold leading-none">
          <span>{currency}</span>
          <span className="inline-block w-[2px]" aria-hidden />
          <span>/</span>
          <span className="inline-block w-[2px]" aria-hidden />
          <span>{languageLabel}</span>
        </span>
        <BrandChevronDown
          isOpen={isOpen}
          bold
          inkColor={BRAND_CHEVRON_LOGIN_INK}
          style={{ width: LOCALE_CHEVRON_WIDTH_PX }}
          className="shrink-0 self-center"
        />
      </button>

      {isDropdownVisible ? (
        <div
          role="dialog"
          aria-label={`${t('common.navigation.currency')} / ${t('common.navigation.language')}`}
          className={`absolute right-0 z-50 origin-top overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-lg transition-all ease-out ${
            isDropdownExpanded
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
          style={{
            top: `calc(100% + ${LOCALE_DROPDOWN_GAP_PX}px)`,
            transitionDuration: `${LOCALE_DROPDOWN_ANIMATION_MS}ms`,
          }}
        >
          <div className="flex w-max">
            <div className="w-max border-r border-gray-100">
              <p className="whitespace-nowrap px-3 pb-1 text-center text-[11px] font-semibold uppercase tracking-wide text-brand-muted">
                {t('common.navigation.currency')}
              </p>
              <ul role="listbox" aria-label={t('common.navigation.currency')} className="px-1.5">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                  const isActive = code === currency;
                  return (
                    <li key={code} role="option" aria-selected={isActive}>
                      <button
                        type="button"
                        onClick={() => handleCurrencySelect(code)}
                        className={`flex w-full justify-center whitespace-nowrap rounded-lg px-2.5 py-1.5 text-center text-sm transition-colors ${
                          isActive
                            ? 'bg-brand-pink/10 font-semibold text-brand-brown'
                            : 'text-brand-muted hover:bg-gray-50'
                        }`}
                      >
                        {code}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="w-max">
              <p className="whitespace-nowrap px-3 pb-1 text-center text-[11px] font-semibold uppercase tracking-wide text-brand-muted">
                {t('common.navigation.language')}
              </p>
              <ul role="listbox" aria-label={t('common.navigation.language')} className="px-1.5">
                {HEADER_LANGUAGES.map(({ code, label }) => {
                  const isActive = code === lang;
                  const fullName = LANGUAGES[code].nativeName;
                  return (
                    <li key={code} role="option" aria-selected={isActive}>
                      <button
                        type="button"
                        onClick={() => handleLanguageSelect(code)}
                        className={`flex w-full justify-center whitespace-nowrap rounded-lg px-2.5 py-1.5 text-center text-sm transition-colors ${
                          isActive
                            ? 'bg-brand-pink/10 font-semibold text-brand-brown'
                            : 'text-brand-muted hover:bg-gray-50'
                        }`}
                        aria-label={`${label}: ${fullName}`}
                      >
                        {fullName}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
