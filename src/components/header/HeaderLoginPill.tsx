'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { BRAND_ASSETS } from '../../constants/brand';
import {
  HEADER_LOGIN_ICON_SIZE_PX,
  HEADER_LOGIN_PILL_HEIGHT_PX,
  HEADER_LOGIN_PILL_WIDTH_PX,
} from '../../constants/header';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';

type Translate = ReturnType<typeof useTranslation>['t'];

const menuLinkClassName =
  'block px-4 py-2.5 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-pink/35';

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
      className="flex items-center justify-center rounded-[22px] bg-brand-yellow transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
      style={{
        width: HEADER_LOGIN_PILL_WIDTH_PX,
        height: HEADER_LOGIN_PILL_HEIGHT_PX,
      }}
      aria-label={label}
      aria-controls={menuId}
      aria-expanded={menuOpen}
      disabled={disabled}
      onClick={onClick}
    >
      <AccountPillIcon />
    </button>
  );
}

function HeaderMenuLink({
  href,
  label,
  onClose,
}: {
  href: string;
  label: string;
  onClose: () => void;
}) {
  return (
    <Link href={href} role="menuitem" className={menuLinkClassName} onClick={onClose}>
      {label}
    </Link>
  );
}

function HeaderProfileMenu({
  id,
  isAdmin,
  t,
  onClose,
  onLogout,
}: {
  id: string;
  isAdmin: boolean;
  t: Translate;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 cursor-default bg-transparent"
        aria-label={t('common.buttons.close')}
        onClick={onClose}
      />
      <div
        id={id}
        role="menu"
        className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-[0_12px_32px_rgba(87,66,59,0.16)]"
      >
        <HeaderMenuLink href="/profile" label={t('common.navigation.profile')} onClose={onClose} />
        {isAdmin ? (
          <HeaderMenuLink href="/supersudo" label={t('common.navigation.admin')} onClose={onClose} />
        ) : null}
        <button
          type="button"
          role="menuitem"
          className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          onClick={onLogout}
        >
          {t('common.navigation.logout')}
        </button>
      </div>
    </>
  );
}

function useCloseOnEscape(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
}

/** Figma `51:335` — yellow login pill beside currency selector. */
export function HeaderLoginPill() {
  const { isLoggedIn, isAdmin, isLoading, logout } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname() ?? '';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  const label = isLoggedIn
    ? t('common.navigation.profile')
    : t('common.navigation.login');
  const loginHref = `/login?redirect=${encodeURIComponent(pathname || '/')}`;
  const closeMenu = () => setMenuOpen(false);

  useCloseOnEscape(menuOpen, closeMenu);

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
    <div className="relative shrink-0">
      <AccountPillButton
        label={label}
        menuId={menuId}
        menuOpen={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      />

      {menuOpen ? <HeaderProfileMenu id={menuId} isAdmin={isAdmin} t={t} onClose={closeMenu} onLogout={handleLogout} /> : null}
    </div>
  );
}
