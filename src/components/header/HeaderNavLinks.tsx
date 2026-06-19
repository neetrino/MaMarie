'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
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

function resolveNavActive(
  labelKey: HeaderNavKey,
  pathname: string,
  hasCategoryFilter: boolean,
): boolean {
  if (labelKey === 'home') return pathname === '/';
  if (labelKey === 'shop') {
    return pathname.startsWith('/products') && !hasCategoryFilter;
  }
  if (labelKey === 'categories') {
    return pathname.startsWith('/products') && hasCategoryFilter;
  }
  if (labelKey === 'about') return pathname.startsWith('/about');
  if (labelKey === 'partners') return pathname.startsWith('/about');
  if (labelKey === 'contact') return pathname.startsWith('/contact');
  return false;
}

export function HeaderNavLinks() {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const hasCategoryFilter = Boolean(searchParams?.get('category'));

  return (
    <nav
      aria-label={t('common.navigation.mainNavigation')}
      className="flex items-center"
      style={{ gap: HEADER_NAV_LINK_GAP_PX }}
    >
      {HEADER_NAV_ITEMS.map(({ href, labelKey }) => {
        const active = resolveNavActive(labelKey, pathname, hasCategoryFilter);

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
