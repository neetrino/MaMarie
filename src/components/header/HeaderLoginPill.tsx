'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND_ASSETS } from '../../constants/brand';
import {
  HEADER_LOGIN_ICON_SIZE_PX,
  HEADER_LOGIN_PILL_HEIGHT_PX,
  HEADER_LOGIN_PILL_WIDTH_PX,
} from '../../constants/header';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';

/** Figma `51:335` — yellow login pill beside currency selector. */
export function HeaderLoginPill() {
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname() ?? '';

  const href = isLoggedIn
    ? '/profile'
    : `/login?redirect=${encodeURIComponent(pathname || '/')}`;
  const label = isLoggedIn
    ? t('common.navigation.profile')
    : t('common.navigation.login');

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
      <Image
        src={BRAND_ASSETS.iconLogin}
        alt=""
        width={HEADER_LOGIN_ICON_SIZE_PX}
        height={HEADER_LOGIN_ICON_SIZE_PX}
        aria-hidden
      />
    </Link>
  );
}
