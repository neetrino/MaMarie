'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MOBILE_HOME_ASSETS,
  MOBILE_HOME_SALE_BANNER_BG,
  MOBILE_HOME_SALE_BANNER_HEIGHT_PX,
  MOBILE_HOME_SALE_BANNER_MAX_WIDTH_PX,
  MOBILE_HOME_SALE_BANNER_RADIUS_PX,
  MOBILE_HOME_SALE_CTA_CHEVRON_BG,
  MOBILE_HOME_SALE_CTA_HEIGHT_PX,
  MOBILE_HOME_SALE_CTA_LEFT_PX,
  MOBILE_HOME_SALE_CTA_TABLET_ARROW_SIZE_PX,
  MOBILE_HOME_SALE_CTA_TABLET_BOTTOM_PX,
  MOBILE_HOME_SALE_CTA_TABLET_CHEVRON_SIZE_PX,
  MOBILE_HOME_SALE_CTA_TABLET_HEIGHT_PX,
  MOBILE_HOME_SALE_CTA_TABLET_LEFT_PX,
  MOBILE_HOME_SALE_CTA_TABLET_WIDTH_PX,
  MOBILE_HOME_SALE_CTA_TOP_PX,
  MOBILE_HOME_SALE_CTA_WIDTH_PX,
  MOBILE_HOME_SALE_DISCOUNT_LEFT_PX,
  MOBILE_HOME_SALE_DISCOUNT_TOP_PX,
  MOBILE_HOME_SALE_IMAGE_CENTER_OFFSET_PX,
  MOBILE_HOME_SALE_IMAGE_HEIGHT_PX,
  MOBILE_HOME_SALE_IMAGE_RADIUS_PX,
  MOBILE_HOME_SALE_IMAGE_TOP_PX,
  MOBILE_HOME_SALE_IMAGE_WIDTH_PX,
  MOBILE_HOME_SALE_LABEL_LEFT_PX,
  MOBILE_HOME_SALE_LABEL_TOP_PX,
  MOBILE_HOME_SALE_TITLE_COLOR,
} from '../../../constants/mobile-home';
import { useTranslation } from '../../../lib/i18n-client';

/**
 * Mobile hero sale banner — Figma node `74:767` (`01`).
 */
export function MobileHomeSaleBanner() {
  const { t } = useTranslation();

  const bannerStyle = {
    '--mobile-home-sale-banner-max-width': `${MOBILE_HOME_SALE_BANNER_MAX_WIDTH_PX}px`,
    '--mobile-home-sale-banner-height': `${MOBILE_HOME_SALE_BANNER_HEIGHT_PX}px`,
    '--mobile-home-sale-cta-left': `${MOBILE_HOME_SALE_CTA_LEFT_PX}px`,
    '--mobile-home-sale-cta-top': `${MOBILE_HOME_SALE_CTA_TOP_PX}px`,
    '--mobile-home-sale-cta-width': `${MOBILE_HOME_SALE_CTA_WIDTH_PX}px`,
    '--mobile-home-sale-cta-height': `${MOBILE_HOME_SALE_CTA_HEIGHT_PX}px`,
    '--mobile-home-sale-cta-tablet-width': `${MOBILE_HOME_SALE_CTA_TABLET_WIDTH_PX}px`,
    '--mobile-home-sale-cta-tablet-height': `${MOBILE_HOME_SALE_CTA_TABLET_HEIGHT_PX}px`,
    '--mobile-home-sale-cta-tablet-left': `${MOBILE_HOME_SALE_CTA_TABLET_LEFT_PX}px`,
    '--mobile-home-sale-cta-tablet-bottom': `${MOBILE_HOME_SALE_CTA_TABLET_BOTTOM_PX}px`,
    '--mobile-home-sale-cta-chevron-size': `${MOBILE_HOME_SALE_CTA_TABLET_CHEVRON_SIZE_PX}px`,
    '--mobile-home-sale-cta-arrow-size': `${MOBILE_HOME_SALE_CTA_TABLET_ARROW_SIZE_PX}px`,
    borderRadius: MOBILE_HOME_SALE_BANNER_RADIUS_PX,
    backgroundColor: MOBILE_HOME_SALE_BANNER_BG,
  } as CSSProperties;

  return (
    <div
      className="mobile-home-sale-banner relative mx-auto w-full overflow-hidden"
      style={bannerStyle}
    >
      <div className="mobile-home-sale-banner__canvas absolute inset-0">
        <p
          className="mobile-home-sale-label absolute whitespace-nowrap"
          style={{
            left: MOBILE_HOME_SALE_LABEL_LEFT_PX,
            top: MOBILE_HOME_SALE_LABEL_TOP_PX,
            color: MOBILE_HOME_SALE_TITLE_COLOR,
          }}
        >
          {t('home.mobile.heroSale.label')}
        </p>

        <p
          className="mobile-home-sale-discount absolute whitespace-nowrap"
          style={{
            left: MOBILE_HOME_SALE_DISCOUNT_LEFT_PX,
            top: MOBILE_HOME_SALE_DISCOUNT_TOP_PX,
            color: MOBILE_HOME_SALE_TITLE_COLOR,
          }}
        >
          {t('home.mobile.heroSale.discount')}
        </p>

        <div
          className="pointer-events-none absolute -translate-x-1/2 overflow-hidden"
          style={{
            left: `calc(50% + ${MOBILE_HOME_SALE_IMAGE_CENTER_OFFSET_PX}px)`,
            top: MOBILE_HOME_SALE_IMAGE_TOP_PX,
            width: MOBILE_HOME_SALE_IMAGE_WIDTH_PX,
            height: MOBILE_HOME_SALE_IMAGE_HEIGHT_PX,
            borderRadius: MOBILE_HOME_SALE_IMAGE_RADIUS_PX,
          }}
        >
          <Image
            src={MOBILE_HOME_ASSETS.saleBannerGirl}
            alt=""
            width={MOBILE_HOME_SALE_IMAGE_WIDTH_PX}
            height={MOBILE_HOME_SALE_IMAGE_HEIGHT_PX}
            className="absolute max-w-none"
            style={{
              width: '100%',
              height: '145.31%',
              left: '5.14%',
              top: '-35.8%',
            }}
            priority
          />
        </div>
      </div>

      <Link
        href="/products"
        className="mobile-home-sale-cta absolute flex items-center rounded-full bg-white pr-2.5 text-sm font-medium text-brand-brown"
      >
        <span className="mobile-home-sale-cta__label flex min-w-0 flex-1 items-center justify-center">
          {t('home.mobile.heroSale.cta')}
        </span>
        <span
          className="mobile-home-sale-cta__chevron flex shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: MOBILE_HOME_SALE_CTA_CHEVRON_BG }}
        >
          <Image
            src={MOBILE_HOME_ASSETS.saleBannerArrow}
            alt=""
            width={20}
            height={20}
            className="mobile-home-sale-cta__arrow rotate-90"
          />
        </span>
      </Link>
    </div>
  );
}
