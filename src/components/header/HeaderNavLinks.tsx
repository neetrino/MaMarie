'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HEADER_NAV_ITEMS,
  HEADER_NAV_FONT_SIZE_PX,
  HEADER_NAV_LETTER_SPACING_PX,
  HEADER_NAV_LINE_HEIGHT_PX,
  HEADER_NAV_LINK_GAP_PX,
  type HeaderNavKey,
  getHeaderNavTranslationKey,
} from '../../constants/brand';
import { useTranslation } from '../../lib/i18n-client';

const navLinkTypographyStyle = {
  fontSize: HEADER_NAV_FONT_SIZE_PX,
  lineHeight: `${HEADER_NAV_LINE_HEIGHT_PX}px`,
  letterSpacing: `${HEADER_NAV_LETTER_SPACING_PX}px`,
} as const;

function resolveNavActive(labelKey: HeaderNavKey, pathname: string): boolean {
  if (labelKey === 'home') return pathname === '/';
  if (labelKey === 'catalog') return pathname.startsWith('/products');
  if (labelKey === 'about') return pathname.startsWith('/about');
  if (labelKey === 'partners') return pathname.startsWith('/about');
  if (labelKey === 'contact') return pathname.startsWith('/contact');
  return false;
}

export function HeaderNavLinks() {
  const pathname = usePathname() ?? '';
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('common.navigation.mainNavigation')}
      className="flex items-center"
      style={{ gap: HEADER_NAV_LINK_GAP_PX }}
    >
      {HEADER_NAV_ITEMS.map(({ href, labelKey }) => {
        const active = resolveNavActive(labelKey, pathname);

        return (
          <Link
            key={labelKey}
            href={href}
            className={`relative inline-block whitespace-nowrap text-left transition-colors ${
              active
                ? 'font-bold text-brand-pink'
                : 'font-normal text-brand-brown hover:text-brand-pink'
            }`}
            style={navLinkTypographyStyle}
          >
            {t(getHeaderNavTranslationKey(labelKey))}
          </Link>
        );
      })}
    </nav>
  );
}
