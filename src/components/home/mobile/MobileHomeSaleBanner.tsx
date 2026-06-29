'use client';

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

  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        maxWidth: MOBILE_HOME_SALE_BANNER_MAX_WIDTH_PX,
        height: MOBILE_HOME_SALE_BANNER_HEIGHT_PX,
        borderRadius: MOBILE_HOME_SALE_BANNER_RADIUS_PX,
        backgroundColor: MOBILE_HOME_SALE_BANNER_BG,
      }}
    >
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

      <Link
        href="/products"
        className="absolute flex items-center justify-between rounded-full bg-white pl-5 pr-2.5 text-sm font-medium text-brand-brown"
        style={{
          left: MOBILE_HOME_SALE_CTA_LEFT_PX,
          top: MOBILE_HOME_SALE_CTA_TOP_PX,
          width: MOBILE_HOME_SALE_CTA_WIDTH_PX,
          height: MOBILE_HOME_SALE_CTA_HEIGHT_PX,
        }}
      >
        <span>{t('home.mobile.heroSale.cta')}</span>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: MOBILE_HOME_SALE_CTA_CHEVRON_BG }}
        >
          <Image
            src={MOBILE_HOME_ASSETS.saleBannerArrow}
            alt=""
            width={20}
            height={20}
            className="rotate-90"
          />
        </span>
      </Link>

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
  );
}
