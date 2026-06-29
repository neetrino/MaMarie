'use client';

import Link from 'next/link';
import {
  FOOTER_HEADING_COLOR,
  FOOTER_HEADING_LETTER_SPACING_PX,
  FOOTER_LINKS_COLUMN_GAP_PX,
  FOOTER_LINKS_ITEM_GAP_PX,
  FOOTER_LINK_LETTER_SPACING_PX,
  FOOTER_TEXT_COLOR,
  FOOTER_TEXT_LINE_HEIGHT_PX,
  FOOTER_TEXT_SIZE_PX,
  type FooterNavLink,
} from '../../constants/footer';
import { useTranslation } from '../../lib/i18n-client';

interface FooterLinksColumnProps {
  titleKey: string;
  links: FooterNavLink[];
  widthPx: number;
}

export function FooterLinksColumn({ titleKey, links, widthPx }: FooterLinksColumnProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex shrink-0 flex-col items-start"
      style={{ width: widthPx, gap: FOOTER_LINKS_COLUMN_GAP_PX }}
    >
      <p
        className="w-full font-bold uppercase"
        style={{
          color: FOOTER_HEADING_COLOR,
          fontSize: FOOTER_TEXT_SIZE_PX,
          lineHeight: `${FOOTER_TEXT_LINE_HEIGHT_PX}px`,
          letterSpacing: `${FOOTER_HEADING_LETTER_SPACING_PX}px`,
        }}
      >
        {t(titleKey)}
      </p>

      <nav
        aria-label={t(titleKey)}
        className="flex w-full flex-col items-start"
        style={{ gap: FOOTER_LINKS_ITEM_GAP_PX }}
      >
        {links.map((link) => (
          <Link
            key={link.labelKey}
            href={link.href}
            className="font-normal transition-opacity hover:opacity-80"
            style={{
              color: FOOTER_TEXT_COLOR,
              fontSize: FOOTER_TEXT_SIZE_PX,
              lineHeight: `${FOOTER_TEXT_LINE_HEIGHT_PX}px`,
              letterSpacing: `${FOOTER_LINK_LETTER_SPACING_PX}px`,
            }}
          >
            {t(link.labelKey)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
