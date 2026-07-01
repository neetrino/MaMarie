'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { BRAND_ASSETS } from '../../constants/brand';
import {
  HEADER_MOBILE_ACTION_BUTTON_SIZE_PX,
  HEADER_MOBILE_ACTIONS_GAP_PX,
  HEADER_MOBILE_LANGUAGE_DROPDOWN_ANIMATION_MS,
  HEADER_MOBILE_LANGUAGE_DROPDOWN_GAP_PX,
  HEADER_MOBILE_LANGUAGE_DROPDOWN_MIN_WIDTH_PX,
  HEADER_MOBILE_LANGUAGE_ICON_SIZE_PX,
  HEADER_MOBILE_MENU_ICON_SIZE_PX,
  HEADER_MOBILE_PILL_CONTENT_INSET_PX,
  HEADER_PILL_APPEAR_DURATION_MS,
  MOBILE_NAV_MENU_BUTTON_ANIMATION_MS,
} from '../../constants/header';
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
  showPill,
  ariaExpanded,
  children,
}: {
  label: string;
  onClick: () => void;
  showPill?: boolean;
  ariaExpanded?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={ariaExpanded ?? false}
      className={`flex shrink-0 items-center justify-center rounded-full transition-[opacity,background-color] hover:opacity-80 touch-manipulation ${
        showPill ? 'bg-transparent' : 'bg-white'
      }`}
      style={{
        width: HEADER_MOBILE_ACTION_BUTTON_SIZE_PX,
        height: HEADER_MOBILE_ACTION_BUTTON_SIZE_PX,
      }}
    >
      {children}
    </button>
  );
}

const menuButtonIconTransitionStyle = {
  transitionDuration: `${MOBILE_NAV_MENU_BUTTON_ANIMATION_MS}ms`,
} as const;

interface HeaderMobileActionsProps {
  showPill?: boolean;
  menuOpen: boolean;
  menuId: string;
  onMenuToggle: () => void;
}

/** Figma `74:729` — language globe and hamburger menu buttons. */
export function HeaderMobileActions({
  showPill = false,
  menuOpen,
  menuId,
  onMenuToggle,
}: HeaderMobileActionsProps) {
  const { t, lang } = useTranslation();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] = useState(false);
  const [isLanguageDropdownExpanded, setIsLanguageDropdownExpanded] = useState(false);
  const languageContainerRef = useRef<HTMLDivElement>(null);
  const languageCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLanguageCloseTimer = useCallback(() => {
    if (languageCloseTimerRef.current) {
      clearTimeout(languageCloseTimerRef.current);
      languageCloseTimerRef.current = null;
    }
  }, []);

  const openLanguageDropdown = useCallback(() => {
    clearLanguageCloseTimer();
    setLanguageOpen(true);
    setIsLanguageDropdownVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsLanguageDropdownExpanded(true);
      });
    });
  }, [clearLanguageCloseTimer]);

  const closeLanguageDropdown = useCallback(() => {
    clearLanguageCloseTimer();
    setLanguageOpen(false);
    setIsLanguageDropdownExpanded(false);
    languageCloseTimerRef.current = setTimeout(() => {
      setIsLanguageDropdownVisible(false);
      languageCloseTimerRef.current = null;
    }, HEADER_MOBILE_LANGUAGE_DROPDOWN_ANIMATION_MS);
  }, [clearLanguageCloseTimer]);

  const toggleLanguageDropdown = useCallback(() => {
    if (languageOpen) {
      closeLanguageDropdown();
      return;
    }
    openLanguageDropdown();
  }, [closeLanguageDropdown, languageOpen, openLanguageDropdown]);

  useEffect(() => {
    if (!languageOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!languageContainerRef.current?.contains(event.target as Node)) {
        closeLanguageDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeLanguageDropdown, languageOpen]);

  useEffect(() => {
    return () => {
      clearLanguageCloseTimer();
    };
  }, [clearLanguageCloseTimer]);

  const handleLanguageChange = (langCode: LanguageCode) => {
    if (langCode === lang) {
      closeLanguageDropdown();
      return;
    }
    setStoredLanguage(langCode);
    closeLanguageDropdown();
  };

  return (
    <div
      className="relative flex items-center transition-transform ease-out"
      style={{
        gap: HEADER_MOBILE_ACTIONS_GAP_PX,
        transform: showPill
          ? `translateX(-${HEADER_MOBILE_PILL_CONTENT_INSET_PX}px)`
          : 'translateX(0)',
        transitionDuration: `${HEADER_PILL_APPEAR_DURATION_MS}ms`,
      }}
    >
      <div ref={languageContainerRef} className="relative shrink-0">
        <MobileIconButton
          label={t('common.navigation.language')}
          showPill={showPill}
          ariaExpanded={languageOpen}
          onClick={() => {
            if (menuOpen) {
              onMenuToggle();
            }
            toggleLanguageDropdown();
          }}
        >
          <Image
            src={BRAND_ASSETS.iconLanguageMobile}
            alt=""
            width={HEADER_MOBILE_LANGUAGE_ICON_SIZE_PX}
            height={HEADER_MOBILE_LANGUAGE_ICON_SIZE_PX}
            aria-hidden
          />
        </MobileIconButton>

        {isLanguageDropdownVisible ? (
          <div
            role="menu"
            className={`absolute right-0 z-50 origin-top overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-lg transition-all ease-out ${
              isLanguageDropdownExpanded
                ? 'pointer-events-auto translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-2 opacity-0'
            }`}
            style={{
              top: `calc(100% + ${HEADER_MOBILE_LANGUAGE_DROPDOWN_GAP_PX}px)`,
              minWidth: HEADER_MOBILE_LANGUAGE_DROPDOWN_MIN_WIDTH_PX,
              transitionDuration: `${HEADER_MOBILE_LANGUAGE_DROPDOWN_ANIMATION_MS}ms`,
            }}
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
      </div>

      <button
        type="button"
        onClick={() => {
          onMenuToggle();
          closeLanguageDropdown();
        }}
        aria-label={
          menuOpen ? t('common.buttons.close') : t('common.navigation.mainNavigation')
        }
        aria-expanded={menuOpen}
        aria-controls={menuId}
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-[opacity,background-color] hover:opacity-80 touch-manipulation ${
          showPill ? 'bg-transparent' : 'bg-white'
        }`}
        style={{
          width: HEADER_MOBILE_ACTION_BUTTON_SIZE_PX,
          height: HEADER_MOBILE_ACTION_BUTTON_SIZE_PX,
        }}
      >
        <Image
          src={BRAND_ASSETS.iconMenuMobile}
          alt=""
          width={HEADER_MOBILE_MENU_ICON_SIZE_PX}
          height={HEADER_MOBILE_MENU_ICON_SIZE_PX}
          aria-hidden
          className="pointer-events-none absolute transition-[opacity,transform] ease-out"
          style={{
            opacity: menuOpen ? 0 : 1,
            transform: menuOpen ? 'rotate(-90deg) scale(0.82)' : 'rotate(0deg) scale(1)',
            ...menuButtonIconTransitionStyle,
          }}
        />
        <X
          className="pointer-events-none absolute text-brand-brown transition-[opacity,transform] ease-out"
          aria-hidden
          style={{
            width: HEADER_MOBILE_MENU_ICON_SIZE_PX,
            height: HEADER_MOBILE_MENU_ICON_SIZE_PX,
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.82)',
            ...menuButtonIconTransitionStyle,
          }}
        />
      </button>
    </div>
  );
}
