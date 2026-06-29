'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { Languages, Menu, X } from 'lucide-react';
import {
  getHeaderNavTranslationKey,
  HEADER_NAV_ITEMS,
} from '../../constants/brand';
import {
  setStoredLanguage,
  type LanguageCode,
} from '../../lib/language';
import { useTranslation } from '../../lib/i18n-client';

const HEADER_LANGUAGES: ReadonlyArray<{ code: LanguageCode; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'hy', label: 'AM' },
  { code: 'ru', label: 'RU' },
];

function MobileIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-brown transition-opacity hover:opacity-80"
    >
      {children}
    </button>
  );
}

export function HeaderMobileActions() {
  const { t, lang } = useTranslation();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const handleLanguageChange = (langCode: LanguageCode) => {
    if (langCode === lang) {
      setLanguageOpen(false);
      return;
    }
    setStoredLanguage(langCode);
    setLanguageOpen(false);
  };

  return (
    <>
      <div className="relative flex items-center gap-2.5">
        <MobileIconButton
          label={t('common.navigation.language')}
          onClick={() => {
            setLanguageOpen((open) => !open);
            setMenuOpen(false);
          }}
        >
          <Languages className="h-6 w-6" />
        </MobileIconButton>

        {languageOpen ? (
          <div
            role="menu"
            className="absolute right-11 top-12 z-50 min-w-[120px] rounded-2xl border border-gray-200 bg-white p-2 shadow-lg"
          >
            {HEADER_LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                role="menuitem"
                onClick={() => handleLanguageChange(code)}
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-medium ${
                  code === lang ? 'bg-brand-pink text-white' : 'text-brand-brown hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        <MobileIconButton
          label={t('common.navigation.catalog')}
          onClick={() => {
            setMenuOpen(true);
            setLanguageOpen(false);
          }}
        >
          <Menu className="h-[22px] w-[22px]" />
        </MobileIconButton>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label={t('products.mobileFilters.close')}
            className="absolute inset-0 bg-black/30"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <p className="text-base font-semibold text-brand-brown">MAMARIE</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-brand-brown"
                aria-label={t('products.mobileFilters.close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {HEADER_NAV_ITEMS.map(({ href, labelKey }) => (
                <Link
                  key={labelKey}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium text-brand-brown hover:bg-gray-50"
                >
                  {t(getHeaderNavTranslationKey(labelKey))}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
