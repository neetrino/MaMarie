'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { BRAND_ASSETS } from '../../constants/brand';
import {
  HEADER_MOBILE_ACTION_BUTTON_SIZE_PX,
  HEADER_MOBILE_ACTIONS_GAP_PX,
  HEADER_MOBILE_MENU_ICON_SIZE_PX,
  HEADER_MOBILE_PILL_CONTENT_INSET_PX,
  HEADER_PILL_APPEAR_DURATION_MS,
  MOBILE_NAV_MENU_BUTTON_ANIMATION_MS,
} from '../../constants/header';
import { useTranslation } from '../../lib/i18n-client';
import { HeaderLocaleCurrencyPill } from './HeaderLocaleCurrencyPill';

const menuButtonIconTransitionStyle = {
  transitionDuration: `${MOBILE_NAV_MENU_BUTTON_ANIMATION_MS}ms`,
} as const;

interface HeaderMobileActionsProps {
  showPill?: boolean;
  menuOpen: boolean;
  menuId: string;
  onMenuToggle: () => void;
}

/** Mobile/tablet header actions — locale pill (`AMD/AM`) + menu. */
export function HeaderMobileActions({
  showPill = false,
  menuOpen,
  menuId,
  onMenuToggle,
}: HeaderMobileActionsProps) {
  const { t } = useTranslation();

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
      <HeaderLocaleCurrencyPill className="z-30" />

      <button
        type="button"
        onClick={onMenuToggle}
        aria-label={
          menuOpen ? t('common.buttons.close') : t('common.navigation.mainNavigation')
        }
        aria-expanded={menuOpen}
        aria-controls={menuId}
        className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-pink transition-opacity hover:opacity-80 touch-manipulation"
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
          className="pointer-events-none absolute brightness-0 invert transition-[opacity,transform] ease-out"
          style={{
            opacity: menuOpen ? 0 : 1,
            transform: menuOpen ? 'rotate(-90deg) scale(0.82)' : 'rotate(0deg) scale(1)',
            ...menuButtonIconTransitionStyle,
          }}
        />
        <X
          className="pointer-events-none absolute text-white transition-[opacity,transform] ease-out"
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
