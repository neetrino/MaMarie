'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  FOOTER_ASSETS,
  FOOTER_BRAND_COLUMN_GAP_PX,
  FOOTER_BRAND_COLUMN_WIDTH_PX,
  FOOTER_DESCRIPTION_LINE_HEIGHT_PX,
  FOOTER_LOGO_CROP_HEIGHT_PERCENT,
  FOOTER_LOGO_CROP_LEFT_PERCENT,
  FOOTER_LOGO_CROP_TOP_PERCENT,
  FOOTER_LOGO_CROP_WIDTH_PERCENT,
  FOOTER_LOGO_HEIGHT_PX,
  FOOTER_LOGO_WIDTH_PX,
  FOOTER_SOCIAL_GAP_PX,
  FOOTER_SOCIAL_LINKS,
  FOOTER_SOCIAL_MARGIN_TOP_PX,
  FOOTER_TEXT_COLOR,
  FOOTER_TEXT_SIZE_PX,
} from '../../constants/footer';
import { useTranslation } from '../../lib/i18n-client';

function FooterBrandLogo() {
  return (
    <Link
      href="/"
      className="relative block shrink-0 overflow-hidden"
      aria-label="MAMARIE"
      style={{ width: FOOTER_LOGO_WIDTH_PX, height: FOOTER_LOGO_HEIGHT_PX }}
    >
      <div
        className="pointer-events-none absolute max-w-none"
          style={{
            height: `${FOOTER_LOGO_CROP_HEIGHT_PERCENT}%`,
            width: `${FOOTER_LOGO_CROP_WIDTH_PERCENT}%`,
            left: `${FOOTER_LOGO_CROP_LEFT_PERCENT}%`,
            top: `${FOOTER_LOGO_CROP_TOP_PERCENT}%`,
          }}
        >
          <Image
            src={FOOTER_ASSETS.logoInline}
            alt=""
            fill
            loading="lazy"
            sizes={`${FOOTER_LOGO_WIDTH_PX}px`}
            className="object-cover"
          />
      </div>
    </Link>
  );
}

export function FooterBrandColumn() {
  const { t } = useTranslation();

  return (
    <div
      className="flex shrink-0 flex-col items-start"
      style={{
        width: FOOTER_BRAND_COLUMN_WIDTH_PX,
        gap: FOOTER_BRAND_COLUMN_GAP_PX,
      }}
    >
      <FooterBrandLogo />

      <p
        className="whitespace-pre-line font-normal"
        style={{
          color: FOOTER_TEXT_COLOR,
          fontSize: FOOTER_TEXT_SIZE_PX,
          lineHeight: `${FOOTER_DESCRIPTION_LINE_HEIGHT_PX}px`,
        }}
      >
        {t('common.footer.description')}
      </p>

      <div className="flex items-center" style={{ gap: FOOTER_SOCIAL_GAP_PX, marginTop: FOOTER_SOCIAL_MARGIN_TOP_PX }}>
        {FOOTER_SOCIAL_LINKS.map((social) => (
          <Link
            key={social.labelKey}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(social.labelKey)}
            className="relative block shrink-0 transition-opacity hover:opacity-80"
            style={{ width: social.widthPx, height: social.heightPx }}
          >
            <Image src={social.iconSrc} alt="" fill loading="lazy" sizes={`${social.widthPx}px`} />
          </Link>
        ))}
      </div>
    </div>
  );
}
