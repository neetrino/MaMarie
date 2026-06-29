'use client';

import Link from 'next/link';
import {
  SALE_BANNER_BG,
  SALE_BANNER_CONTENT_LEFT_PX,
  SALE_BANNER_CONTENT_WIDTH_PX,
  SALE_BANNER_CTA_HEIGHT_PX,
  SALE_BANNER_CTA_INSET_SHADOW,
  SALE_BANNER_CTA_TEXT_COLOR,
  SALE_BANNER_CTA_TEXT_LINE_HEIGHT_PX,
  SALE_BANNER_CTA_TEXT_SIZE_PX,
  SALE_BANNER_CTA_WIDTH_PX,
  SALE_BANNER_HEIGHT_PX,
  SALE_BANNER_MAX_WIDTH_PX,
  SALE_BANNER_OFFSET_TOP_PX,
  SALE_BANNER_RADIUS_PX,
  SALE_BANNER_SUBTITLE_LINE_HEIGHT_PX,
  SALE_BANNER_SUBTITLE_LINE_HEIGHT_HY_PX,
  SALE_BANNER_SUBTITLE_MAX_WIDTH_PX,
  SALE_BANNER_SUBTITLE_SIZE_PX,
  SALE_BANNER_SUBTITLE_SIZE_HY_PX,
  SALE_BANNER_SUBTITLE_GAP_PX,
  SALE_BANNER_TITLE_LINE_HEIGHT_PX,
  SALE_BANNER_TITLE_LINE_HEIGHT_HY_PX,
  SALE_BANNER_TITLE_SIZE_PX,
  SALE_BANNER_TITLE_SIZE_HY_PX,
  SALE_BANNER_TITLE_SUBTITLE_GAP_PX,
  SALE_HEADING_COLOR,
  SALE_HEADING_MIN_HEIGHT_PX,
  SALE_HEADING_PADDING_Y_PX,
  SALE_SECTION_ASSETS,
  SALE_TITLE_LINE_HEIGHT_PX,
} from '../../constants/sale-section';
import { useTranslation } from '../../lib/i18n-client';
import { HomeSectionHeadingRow } from './HomeSectionHeading';
import { SaleBannerVisuals } from './SaleBannerVisuals';

function saleBannerPct(valuePx: number, basePx: number): string {
  return `${(valuePx / basePx) * 100}%`;
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

  return (
    <>
      <HomeSectionHeadingRow
        id="sale-section-heading"
        title={t('home.sale.title')}
        seeAllHref="/products"
        seeAllLabel={t('common.search.seeAll')}
        color={SALE_HEADING_COLOR}
        chevronSrc={SALE_SECTION_ASSETS.chevronRight}
        titleLineHeightPx={SALE_TITLE_LINE_HEIGHT_PX}
        minHeightPx={SALE_HEADING_MIN_HEIGHT_PX}
        headingPaddingYPx={SALE_HEADING_PADDING_Y_PX}
      />

      <section
        aria-labelledby="sale-banner-heading"
        className="relative w-full overflow-hidden"
        style={{
          marginTop: SALE_BANNER_OFFSET_TOP_PX,
          height: SALE_BANNER_HEIGHT_PX,
          borderRadius: SALE_BANNER_RADIUS_PX,
          backgroundColor: SALE_BANNER_BG,
        }}
      >
        <SaleBannerVisuals />

        <div
          className="absolute inset-y-0 z-10 flex max-w-full flex-col justify-center"
          style={{
            left: `clamp(24px, ${saleBannerPct(SALE_BANNER_CONTENT_LEFT_PX, SALE_BANNER_MAX_WIDTH_PX)}, ${SALE_BANNER_CONTENT_LEFT_PX}px)`,
            width: `min(${SALE_BANNER_CONTENT_WIDTH_PX}px, calc(100% - 48px))`,
            gap: SALE_BANNER_SUBTITLE_GAP_PX,
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
            className="whitespace-pre-line font-normal text-white"
            style={{
              maxWidth: SALE_BANNER_SUBTITLE_MAX_WIDTH_PX,
              fontSize: subtitleFontSizePx,
              lineHeight: `${subtitleLineHeightPx}px`,
              marginTop: SALE_BANNER_TITLE_SUBTITLE_GAP_PX - SALE_BANNER_SUBTITLE_GAP_PX,
            }}
          >
            {t('home.sale.banner.subtitle')}
          </p>

          <Link
            href="/products"
            className="inline-flex w-fit items-center justify-center rounded-full bg-white font-bold transition-opacity hover:opacity-90"
            style={{
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
