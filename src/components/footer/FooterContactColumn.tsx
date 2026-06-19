'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  FOOTER_ASSETS,
  FOOTER_CONTACT_COLUMN_WIDTH_PX,
  FOOTER_CONTACT_ICON_LOCATION_SIZE_PX,
  FOOTER_CONTACT_ICON_MAIL_SIZE_PX,
  FOOTER_CONTACT_ICON_PHONE_SIZE_PX,
  FOOTER_CONTACT_ROW_GAP_PX,
  FOOTER_EMAIL_HREF,
  FOOTER_HEADING_COLOR,
  FOOTER_HEADING_LETTER_SPACING_PX,
  FOOTER_LINKS_COLUMN_GAP_PX,
  FOOTER_LINKS_ITEM_GAP_PX,
  FOOTER_PHONE_HREF,
  FOOTER_TEXT_COLOR,
  FOOTER_TEXT_LINE_HEIGHT_PX,
  FOOTER_TEXT_SIZE_PX,
} from '../../constants/footer';
import { useTranslation } from '../../lib/i18n-client';

interface FooterContactRowProps {
  iconSrc: string;
  iconSizePx: number;
  href?: string;
  label: string;
  fontWeight?: 'normal' | 'medium';
}

function FooterContactRow({
  iconSrc,
  iconSizePx,
  href,
  label,
  fontWeight = 'normal',
}: FooterContactRowProps) {
  const textClassName = fontWeight === 'medium' ? 'font-medium' : 'font-normal';
  const body = (
    <>
      <span
        className="relative block shrink-0"
        style={{ width: iconSizePx, height: iconSizePx }}
        aria-hidden
      >
        <Image src={iconSrc} alt="" fill sizes={`${iconSizePx}px`} />
      </span>
      <span
        className={textClassName}
        style={{
          color: FOOTER_TEXT_COLOR,
          fontSize: FOOTER_TEXT_SIZE_PX,
          lineHeight: `${FOOTER_TEXT_LINE_HEIGHT_PX}px`,
        }}
      >
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center transition-opacity hover:opacity-80"
        style={{ gap: FOOTER_CONTACT_ROW_GAP_PX }}
      >
        {body}
      </Link>
    );
  }

  return (
    <div className="flex items-start" style={{ gap: FOOTER_CONTACT_ROW_GAP_PX }}>
      {body}
    </div>
  );
}

export function FooterContactColumn() {
  const { t } = useTranslation();

  return (
    <div
      className="flex shrink-0 flex-col items-start"
      style={{ width: FOOTER_CONTACT_COLUMN_WIDTH_PX, gap: FOOTER_LINKS_COLUMN_GAP_PX }}
    >
      <p
        className="font-bold uppercase"
        style={{
          color: FOOTER_HEADING_COLOR,
          fontSize: FOOTER_TEXT_SIZE_PX,
          lineHeight: `${FOOTER_TEXT_LINE_HEIGHT_PX}px`,
          letterSpacing: `${FOOTER_HEADING_LETTER_SPACING_PX}px`,
        }}
      >
        {t('common.footer.contactsTitle')}
      </p>

      <div className="flex flex-col items-start" style={{ gap: FOOTER_LINKS_ITEM_GAP_PX }}>
        <FooterContactRow
          iconSrc={FOOTER_ASSETS.iconPhone}
          iconSizePx={FOOTER_CONTACT_ICON_PHONE_SIZE_PX}
          href={FOOTER_PHONE_HREF}
          label={t('common.footer.phone')}
          fontWeight="medium"
        />
        <FooterContactRow
          iconSrc={FOOTER_ASSETS.iconMail}
          iconSizePx={FOOTER_CONTACT_ICON_MAIL_SIZE_PX}
          href={FOOTER_EMAIL_HREF}
          label={t('common.footer.email')}
        />
        <FooterContactRow
          iconSrc={FOOTER_ASSETS.iconLocation}
          iconSizePx={FOOTER_CONTACT_ICON_LOCATION_SIZE_PX}
          label={t('common.footer.address')}
        />
      </div>
    </div>
  );
}
