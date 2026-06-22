'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  SALE_BANNER_CONTENT_LEFT_PX,
  SALE_BANNER_CONTENT_TOP_PX,
  SALE_BANNER_CONTENT_WIDTH_PX,
  SALE_BANNER_CTA_HEIGHT_PX,
  SALE_BANNER_CTA_INSET_SHADOW,
  SALE_BANNER_CTA_OFFSET_TOP_PX,
  SALE_BANNER_CTA_OFFSET_TOP_HY_PX,
  SALE_BANNER_CTA_TEXT_COLOR,
  SALE_BANNER_CTA_TEXT_LINE_HEIGHT_PX,
  SALE_BANNER_CTA_TEXT_SIZE_PX,
  SALE_BANNER_CTA_WIDTH_PX,
  SALE_BANNER_GRADIENT,
  SALE_BANNER_HEIGHT_PX,
  SALE_BANNER_IMAGE_CROP_HEIGHT_PERCENT,
  SALE_BANNER_IMAGE_CROP_TOP_PERCENT,
  SALE_BANNER_IMAGE_HEIGHT_PX,
  SALE_BANNER_IMAGE_LEFT_PX,
  SALE_BANNER_IMAGE_TOP_PX,
  SALE_BANNER_IMAGE_WIDTH_PX,
  SALE_BANNER_MAX_WIDTH_PX,
  SALE_BANNER_OFFSET_TOP_PX,
  SALE_BANNER_RADIUS_PX,
  SALE_BANNER_SUBTITLE_LINE_HEIGHT_PX,
  SALE_BANNER_SUBTITLE_LINE_HEIGHT_HY_PX,
  SALE_BANNER_SUBTITLE_MAX_WIDTH_PX,
  SALE_BANNER_SUBTITLE_OFFSET_TOP_PX,
  SALE_BANNER_SUBTITLE_OFFSET_TOP_HY_PX,
  SALE_BANNER_SUBTITLE_SIZE_PX,
  SALE_BANNER_SUBTITLE_SIZE_HY_PX,
  SALE_BANNER_TITLE_LINE_HEIGHT_PX,
  SALE_BANNER_TITLE_LINE_HEIGHT_HY_PX,
  SALE_BANNER_TITLE_SIZE_PX,
  SALE_BANNER_TITLE_SIZE_HY_PX,
  SALE_HEADING_COLOR,
  SALE_SECTION_ASSETS,
} from '../../constants/sale-section';
import { useTranslation } from '../../lib/i18n-client';
import { HomeSectionHeadingRow } from './HomeSectionHeading';

function saleBannerPct(valuePx: number, basePx: number): string {
  return `${(valuePx / basePx) * 100}%`;
}

function SaleBannerImage() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute hidden md:block"
      style={{
        left: saleBannerPct(SALE_BANNER_IMAGE_LEFT_PX, SALE_BANNER_MAX_WIDTH_PX),
        top: saleBannerPct(SALE_BANNER_IMAGE_TOP_PX, SALE_BANNER_HEIGHT_PX),
        width: saleBannerPct(SALE_BANNER_IMAGE_WIDTH_PX, SALE_BANNER_MAX_WIDTH_PX),
        height: saleBannerPct(SALE_BANNER_IMAGE_HEIGHT_PX, SALE_BANNER_HEIGHT_PX),
      }}
    >
      <div
        className="absolute relative max-w-none overflow-hidden"
        style={{
          height: `${SALE_BANNER_IMAGE_CROP_HEIGHT_PERCENT}%`,
          width: '100%',
          top: `${SALE_BANNER_IMAGE_CROP_TOP_PERCENT}%`,
        }}
      >
        <Image
          src={SALE_SECTION_ASSETS.bannerDresses}
          alt=""
          fill
          sizes="(min-width: 768px) 760px, 0px"
          className="object-cover"
          priority={false}
        />
      </div>
    </div>
  );
}

export function SaleSectionBlock() {
  const { t, lang } = useTranslation();
  const isArmenian = lang === 'hy';
  const subtitleFontSizePx = isArmenian
    ? SALE_BANNER_SUBTITLE_SIZE_HY_PX
    : SALE_BANNER_SUBTITLE_SIZE_PX;
  const subtitleLineHeightPx = isArmenian
    ? SALE_BANNER_SUBTITLE_LINE_HEIGHT_HY_PX
    : SALE_BANNER_SUBTITLE_LINE_HEIGHT_PX;
  const titleFontSizePx = isArmenian ? SALE_BANNER_TITLE_SIZE_HY_PX : SALE_BANNER_TITLE_SIZE_PX;
  const titleLineHeightPx = isArmenian
    ? SALE_BANNER_TITLE_LINE_HEIGHT_HY_PX
    : SALE_BANNER_TITLE_LINE_HEIGHT_PX;
  const subtitleOffsetTopPx = isArmenian
    ? SALE_BANNER_SUBTITLE_OFFSET_TOP_HY_PX
    : SALE_BANNER_SUBTITLE_OFFSET_TOP_PX;
  const ctaOffsetTopPx = isArmenian
    ? SALE_BANNER_CTA_OFFSET_TOP_HY_PX
    : SALE_BANNER_CTA_OFFSET_TOP_PX;

  return (
    <>
      <HomeSectionHeadingRow
        id="sale-section-heading"
        title={t('home.sale.title')}
        seeAllHref="/products"
        seeAllLabel={t('common.search.seeAll')}
        color={SALE_HEADING_COLOR}
        chevronSrc={SALE_SECTION_ASSETS.chevronRight}
      />

      <section
        aria-labelledby="sale-banner-heading"
        className="relative w-full overflow-hidden"
        style={{
          marginTop: SALE_BANNER_OFFSET_TOP_PX,
          minHeight: SALE_BANNER_HEIGHT_PX,
          borderRadius: SALE_BANNER_RADIUS_PX,
          background: SALE_BANNER_GRADIENT,
        }}
      >
        <SaleBannerImage />

        <div
          className="absolute z-10 max-w-full"
          style={{
            left: `clamp(24px, ${saleBannerPct(SALE_BANNER_CONTENT_LEFT_PX, SALE_BANNER_MAX_WIDTH_PX)}, ${SALE_BANNER_CONTENT_LEFT_PX}px)`,
            top: `clamp(32px, ${saleBannerPct(SALE_BANNER_CONTENT_TOP_PX, SALE_BANNER_HEIGHT_PX)}, ${SALE_BANNER_CONTENT_TOP_PX}px)`,
            width: `min(${SALE_BANNER_CONTENT_WIDTH_PX}px, calc(100% - 48px))`,
            minHeight: ctaOffsetTopPx + SALE_BANNER_CTA_HEIGHT_PX,
          }}
        >
          <h3
            id="sale-banner-heading"
            className="font-bold text-white"
            style={{
              fontSize: titleFontSizePx,
              lineHeight: `${titleLineHeightPx}px`,
              marginTop: -11,
            }}
          >
            {t('home.sale.banner.title')}
          </h3>

          <p
            className="absolute whitespace-pre-line font-normal text-white"
            style={{
              left: 0,
              top: subtitleOffsetTopPx,
              maxWidth: SALE_BANNER_SUBTITLE_MAX_WIDTH_PX,
              fontSize: subtitleFontSizePx,
              lineHeight: `${subtitleLineHeightPx}px`,
            }}
          >
            {t('home.sale.banner.subtitle')}
          </p>

          <Link
            href="/products"
            className="absolute inline-flex items-center justify-center rounded-full bg-white font-bold transition-opacity hover:opacity-90"
            style={{
              left: 0,
              top: ctaOffsetTopPx,
              width: SALE_BANNER_CTA_WIDTH_PX,
              maxWidth: '100%',
              height: SALE_BANNER_CTA_HEIGHT_PX,
              color: SALE_BANNER_CTA_TEXT_COLOR,
              fontSize: SALE_BANNER_CTA_TEXT_SIZE_PX,
              lineHeight: `${SALE_BANNER_CTA_TEXT_LINE_HEIGHT_PX}px`,
              boxShadow: SALE_BANNER_CTA_INSET_SHADOW,
            }}
          >
            {t('home.sale.banner.cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
