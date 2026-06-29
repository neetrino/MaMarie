'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HEADER_NAV_FONT_SIZE_PX,
  HEADER_NAV_LETTER_SPACING_PX,
  HEADER_NAV_LINE_HEIGHT_PX,
  HEADER_NAV_LINK_GAP_PX,
} from '../../constants/brand';
import {
  getNavLinkTranslationKey,
  isNavLinkActive,
  type NavLinkItem,
} from '../../constants/nav-links';
import { useTranslation } from '../../lib/i18n-client';

const navLinkTypographyStyle = {
  fontSize: HEADER_NAV_FONT_SIZE_PX,
  lineHeight: `${HEADER_NAV_LINE_HEIGHT_PX}px`,
  letterSpacing: `${HEADER_NAV_LETTER_SPACING_PX}px`,
} as const;

interface HeaderNavLinksProps {
  navLinks: readonly NavLinkItem[];
}

export function HeaderNavLinks({ navLinks }: HeaderNavLinksProps) {
  const pathname = usePathname() ?? '';
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('common.navigation.mainNavigation')}
      className="flex items-center"
      style={{ gap: HEADER_NAV_LINK_GAP_PX }}
    >
      {navLinks.map(({ href, labelKey }) => {
        const active = isNavLinkActive(labelKey, pathname);

        return (
          <Link
            key={labelKey}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`relative inline-block whitespace-nowrap text-left transition-colors ${
              active
                ? 'font-bold text-brand-pink'
                : 'font-normal text-brand-brown hover:text-brand-pink'
            }`}
            style={navLinkTypographyStyle}
          >
            {t(getNavLinkTranslationKey(labelKey))}
          </Link>
        );
      })}
    </nav>
  );
}
