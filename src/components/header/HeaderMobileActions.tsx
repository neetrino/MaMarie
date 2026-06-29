'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { BRAND_ASSETS } from '../../constants/brand';
import {
  HEADER_MOBILE_ACTION_BUTTON_SIZE_PX,
  HEADER_MOBILE_ACTIONS_GAP_PX,
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
  children,
}: {
  label: string;
  onClick: () => void;
  showPill?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={false}
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

  const handleLanguageChange = (langCode: LanguageCode) => {
    if (langCode === lang) {
      setLanguageOpen(false);
      return;
    }
    setStoredLanguage(langCode);
    setLanguageOpen(false);
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
      <MobileIconButton
        label={t('common.navigation.language')}
        showPill={showPill}
        onClick={() => {
          if (menuOpen) {
            onMenuToggle();
          }
          setLanguageOpen((open) => !open);
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

      <button
        type="button"
        onClick={() => {
          onMenuToggle();
          setLanguageOpen(false);
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
          className="absolute transition-[opacity,transform] ease-out"
          style={{
            opacity: menuOpen ? 0 : 1,
            transform: menuOpen ? 'rotate(-90deg) scale(0.82)' : 'rotate(0deg) scale(1)',
            ...menuButtonIconTransitionStyle,
          }}
        />
        <X
          className="absolute text-brand-brown transition-[opacity,transform] ease-out"
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
