'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from 'react';
import { BRAND_ASSETS } from '../../constants/brand';
import {
  HEADER_LOGIN_ICON_SIZE_PX,
  HEADER_LOGIN_PILL_HEIGHT_PX,
  HEADER_LOGIN_PILL_WIDTH_PX,
  HEADER_PROFILE_MENU_DROPDOWN_ANIMATION_MS,
  HEADER_PROFILE_MENU_DROPDOWN_GAP_PX,
  HEADER_PROFILE_MENU_HOVER_CLOSE_DELAY_MS,
} from '../../constants/header';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';

type Translate = ReturnType<typeof useTranslation>['t'];

const profileMenuItemBaseClassName =
  'flex items-center whitespace-nowrap rounded-[18px] px-3 py-2 text-left text-sm font-medium leading-[15px] text-brand-muted transition-colors';

const profileMenuProfileItemClassName = `${profileMenuItemBaseClassName} hover:bg-[#5cb176] hover:text-white`;

const profileMenuAdminItemClassName = `${profileMenuItemBaseClassName} hover:bg-[#5281e1] hover:text-white`;

const profileMenuLogoutItemClassName = `${profileMenuItemBaseClassName} hover:bg-brand-pink hover:text-brand-on-pink`;

function AccountPillIcon() {
  return (
    <Image
      src={BRAND_ASSETS.iconLogin}
      alt=""
      width={HEADER_LOGIN_ICON_SIZE_PX}
      height={HEADER_LOGIN_ICON_SIZE_PX}
      aria-hidden
    />
  );
}

function AccountPillLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center justify-center rounded-[22px] bg-brand-yellow transition-opacity hover:opacity-90"
      style={{
        width: HEADER_LOGIN_PILL_WIDTH_PX,
        height: HEADER_LOGIN_PILL_HEIGHT_PX,
      }}
      aria-label={label}
    >
      <AccountPillIcon />
    </Link>
  );
}

function AccountPillButton({
  label,
  menuId,
  menuOpen,
  disabled = false,
  onClick,
}: {
  label: string;
  menuId?: string;
  menuOpen?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center rounded-[22px] bg-brand-yellow transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
      style={{
        width: HEADER_LOGIN_PILL_WIDTH_PX,
        height: HEADER_LOGIN_PILL_HEIGHT_PX,
      }}
      aria-label={label}
      aria-controls={menuId}
      aria-expanded={menuOpen}
      aria-haspopup="menu"
      disabled={disabled}
    >
      <AccountPillIcon />
    </button>
  );
}

function HeaderProfileMenu({
  id,
  isAdmin,
  isExpanded,
  t,
  onClose,
  onLogout,
}: {
  id: string;
  isAdmin: boolean;
  isExpanded: boolean;
  t: Translate;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div
      id={id}
      role="menu"
      className={`absolute right-0 z-50 flex w-max origin-top flex-col gap-1 rounded-[22px] bg-brand-yellow p-1.5 transition-all ease-out ${
        isExpanded
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0'
      }`}
      style={{
        top: `calc(100% + ${HEADER_PROFILE_MENU_DROPDOWN_GAP_PX}px)`,
        transitionDuration: `${HEADER_PROFILE_MENU_DROPDOWN_ANIMATION_MS}ms`,
      }}
    >
      <Link
        href="/profile"
        role="menuitem"
        className={profileMenuProfileItemClassName}
        onClick={onClose}
      >
        {t('common.navigation.profile')}
      </Link>
      {isAdmin ? (
        <Link
          href="/supersudo"
          role="menuitem"
          className={profileMenuAdminItemClassName}
          onClick={onClose}
        >
          {t('common.navigation.admin')}
        </Link>
      ) : null}
      <button type="button" role="menuitem" className={profileMenuLogoutItemClassName} onClick={onLogout}>
        {t('common.navigation.logout')}
      </button>
    </div>
  );
}

/** Figma `51:335` — yellow login pill beside currency selector. */
export function HeaderLoginPill() {
  const { isLoggedIn, isAdmin, isLoading, logout } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname() ?? '';
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);

  const label = isLoggedIn
    ? t('common.navigation.profile')
    : t('common.navigation.login');
  const loginHref = `/login?redirect=${encodeURIComponent(pathname || '/')}`;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setMenuOpen(false);
    setIsMenuExpanded(false);
    closeTimerRef.current = setTimeout(() => {
      setIsMenuVisible(false);
      closeTimerRef.current = null;
    }, HEADER_PROFILE_MENU_DROPDOWN_ANIMATION_MS);
  }, [clearCloseTimer]);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setMenuOpen(true);
    setIsMenuVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsMenuExpanded(true);
      });
    });
  }, [clearCloseTimer]);

  const scheduleCloseMenu = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      closeMenu();
    }, HEADER_PROFILE_MENU_HOVER_CLOSE_DELAY_MS);
  }, [clearCloseTimer, closeMenu]);

  const handleContainerMouseEnter = useCallback(() => {
    if (!supportsHover) {
      return;
    }
    openMenu();
  }, [openMenu, supportsHover]);

  const handleContainerMouseLeave = useCallback(() => {
    if (!supportsHover) {
      return;
    }
    scheduleCloseMenu();
  }, [scheduleCloseMenu, supportsHover]);

  const handleContainerFocus = useCallback(() => {
    openMenu();
  }, [openMenu]);

  const handleContainerBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (containerRef.current?.contains(event.relatedTarget as Node)) {
        return;
      }
      scheduleCloseMenu();
    },
    [scheduleCloseMenu],
  );

  const handlePillClick = useCallback(() => {
    if (!supportsHover) {
      if (menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }
  }, [closeMenu, menuOpen, openMenu, supportsHover]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateSupportsHover = () => {
      setSupportsHover(mediaQuery.matches);
    };

    updateSupportsHover();
    mediaQuery.addEventListener('change', updateSupportsHover);

    return () => {
      mediaQuery.removeEventListener('change', updateSupportsHover);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [closeMenu, menuOpen]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  if (isLoading) {
    return <AccountPillButton label={label} disabled />;
  }

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  if (!isLoggedIn) {
    return <AccountPillLink href={loginHref} label={label} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
      onFocusCapture={handleContainerFocus}
      onBlurCapture={handleContainerBlur}
    >
      <AccountPillButton
        label={label}
        menuId={menuId}
        menuOpen={menuOpen}
        onClick={handlePillClick}
      />

      {isMenuVisible ? (
        <>
          <div
            aria-hidden
            className="absolute inset-x-0 top-full"
            style={{ height: HEADER_PROFILE_MENU_DROPDOWN_GAP_PX }}
          />
          <HeaderProfileMenu
            id={menuId}
            isAdmin={isAdmin}
            isExpanded={isMenuExpanded}
            t={t}
            onClose={closeMenu}
            onLogout={handleLogout}
          />
        </>
      ) : null}
    </div>
  );
}
