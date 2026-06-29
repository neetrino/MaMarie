'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  FOOTER_ASSETS,
  FOOTER_CONTACT_COLUMN_WIDTH_PX,
  FOOTER_CONTACT_HEADING_TO_ROWS_GAP_PX,
  FOOTER_CONTACT_ICON_LOCATION_SIZE_PX,
  FOOTER_CONTACT_ICON_MAIL_SIZE_PX,
  FOOTER_CONTACT_ICON_PHONE_SIZE_PX,
  FOOTER_CONTACT_ITEMS_GAP_PX,
  FOOTER_CONTACT_ROW_GAP_PX,
  FOOTER_EMAIL_HREF,
  FOOTER_HEADING_COLOR,
  FOOTER_HEADING_LETTER_SPACING_PX,
  FOOTER_PAYMENT_MARGIN_TOP_PX,
  FOOTER_PHONE_HREF,
  FOOTER_TEXT_COLOR,
  FOOTER_TEXT_LINE_HEIGHT_PX,
  FOOTER_TEXT_SIZE_PX,
} from '../../constants/footer';
import { useTranslation } from '../../lib/i18n-client';
import { FooterPaymentBadges } from './FooterPaymentBadges';

interface FooterContactRowProps {
  iconSrc: string;
  iconSizePx: number;
  href?: string;
  label: string;
  fontWeight?: 'normal' | 'medium';
  align?: 'center' | 'start';
}

function FooterContactRow({
  iconSrc,
  iconSizePx,
  href,
  label,
  fontWeight = 'normal',
  align = 'center',
}: FooterContactRowProps) {
  const textClassName = fontWeight === 'medium' ? 'font-medium' : 'font-normal';
  const alignClassName = align === 'start' ? 'items-start' : 'items-center';
  const body = (
    <>
      <span
        className="relative flex shrink-0 items-center justify-center"
        style={{ width: iconSizePx, height: iconSizePx }}
        aria-hidden
      >
        <Image
          src={iconSrc}
          alt=""
          fill
          sizes={`${iconSizePx}px`}
          className="object-contain object-center"
        />
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
        className={`flex ${alignClassName} transition-opacity hover:opacity-80`}
        style={{ gap: FOOTER_CONTACT_ROW_GAP_PX }}
      >
        {body}
      </Link>
    );
  }

  return (
    <div className={`flex ${alignClassName}`} style={{ gap: FOOTER_CONTACT_ROW_GAP_PX }}>
      {body}
    </div>
  );
}

export function FooterContactColumn() {
  const { t } = useTranslation();

  return (
    <div className="flex shrink-0 flex-col items-start" style={{ width: FOOTER_CONTACT_COLUMN_WIDTH_PX }}>
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

      <div
        className="flex w-full flex-col items-start"
        style={{
          marginTop: FOOTER_CONTACT_HEADING_TO_ROWS_GAP_PX,
          gap: FOOTER_CONTACT_ITEMS_GAP_PX,
        }}
      >
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
          align="start"
        />
      </div>

      <div style={{ marginTop: FOOTER_PAYMENT_MARGIN_TOP_PX }}>
        <FooterPaymentBadges />
      </div>
    </div>
  );
}
