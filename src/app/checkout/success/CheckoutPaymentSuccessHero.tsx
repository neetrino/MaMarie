'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MOBILE_ORDER_ACCENT_COLOR,
  MOBILE_ORDER_ASSETS,
  MOBILE_ORDER_HEADLINE_COLOR,
  MOBILE_ORDER_HEADLINE_LINE_GAP_PX,
  MOBILE_ORDER_HEADLINE_LINE_HEIGHT,
  MOBILE_ORDER_HEADLINE_TO_BUTTON_GAP_PX,
  MOBILE_ORDER_HEADLINE_TO_SUBTITLE_GAP_PX,
  MOBILE_ORDER_HERO_BLOCK_GAP_PX,
  MOBILE_ORDER_HERO_ILLUSTRATION_HEIGHT_PX,
  MOBILE_ORDER_HERO_ILLUSTRATION_OFFSET_LEFT_PERCENT,
  MOBILE_ORDER_HERO_ILLUSTRATION_OFFSET_TOP_PERCENT,
  MOBILE_ORDER_HERO_ILLUSTRATION_SCALE_HEIGHT,
  MOBILE_ORDER_HERO_ILLUSTRATION_SCALE_WIDTH,
  MOBILE_ORDER_HERO_ILLUSTRATION_WIDTH_PX,
  MOBILE_ORDER_PLACED_HEADLINE_FONT_SIZE_PX,
  MOBILE_ORDER_PLACED_HEADLINE_MAX_WIDTH_PX,
  MOBILE_ORDER_SUBTITLE_COLOR,
  MOBILE_ORDER_SUBTITLE_FONT_SIZE_PX,
  MOBILE_ORDER_SUBTITLE_LINE_HEIGHT,
} from '../../../constants/mobile-orders';
import { useTranslation } from '../../../lib/i18n-client';
import { OrderMoreButton } from '../../orders/[number]/components/OrderMoreButton';

const ORDER_HERO_IMAGE_QUALITY = 90;

interface CheckoutPaymentSuccessHeroProps {
  orderNumber: string | null;
}

function CheckoutPaymentSuccessIllustration() {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: MOBILE_ORDER_HERO_ILLUSTRATION_WIDTH_PX,
        height: MOBILE_ORDER_HERO_ILLUSTRATION_HEIGHT_PX,
      }}
      aria-hidden
    >
      <div
        className="absolute"
        style={{
          width: `${MOBILE_ORDER_HERO_ILLUSTRATION_SCALE_WIDTH * 100}%`,
          height: `${MOBILE_ORDER_HERO_ILLUSTRATION_SCALE_HEIGHT * 100}%`,
          left: `${MOBILE_ORDER_HERO_ILLUSTRATION_OFFSET_LEFT_PERCENT}%`,
          top: `${MOBILE_ORDER_HERO_ILLUSTRATION_OFFSET_TOP_PERCENT}%`,
        }}
      >
        <Image
          src={MOBILE_ORDER_ASSETS.readyBasket}
          alt=""
          fill
          priority
          quality={ORDER_HERO_IMAGE_QUALITY}
          sizes={`${MOBILE_ORDER_HERO_ILLUSTRATION_WIDTH_PX}px`}
          className="object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}

function CheckoutPaymentSuccessCopy({ t }: { t: (key: string) => string }) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <div
        className="flex flex-col font-bold"
        style={{
          fontSize: MOBILE_ORDER_PLACED_HEADLINE_FONT_SIZE_PX,
          lineHeight: MOBILE_ORDER_HEADLINE_LINE_HEIGHT,
          maxWidth: MOBILE_ORDER_PLACED_HEADLINE_MAX_WIDTH_PX,
          gap: MOBILE_ORDER_HEADLINE_LINE_GAP_PX,
        }}
      >
        <p style={{ color: MOBILE_ORDER_ACCENT_COLOR }}>{t('checkout.paymentSuccess.accent')}</p>
        <h1
          className="flex flex-col font-bold"
          style={{
            gap: MOBILE_ORDER_HEADLINE_LINE_GAP_PX,
            fontSize: 'inherit',
            lineHeight: 'inherit',
          }}
        >
          <span className="whitespace-nowrap" style={{ color: MOBILE_ORDER_HEADLINE_COLOR }}>
            {t('checkout.paymentSuccess.titleLine1')}
          </span>
          <span className="whitespace-nowrap" style={{ color: MOBILE_ORDER_HEADLINE_COLOR }}>
            {t('checkout.paymentSuccess.titleLine2')}
          </span>
        </h1>
      </div>
      <p
        className="w-full text-center"
        style={{
          marginTop: MOBILE_ORDER_HEADLINE_TO_SUBTITLE_GAP_PX,
          fontSize: MOBILE_ORDER_SUBTITLE_FONT_SIZE_PX,
          lineHeight: MOBILE_ORDER_SUBTITLE_LINE_HEIGHT,
          color: MOBILE_ORDER_SUBTITLE_COLOR,
          letterSpacing: '0.07px',
        }}
      >
        {t('checkout.paymentSuccess.body')}
      </p>
    </div>
  );
}

/** Payment success — same illustration, type, and pink CTA as order confirmation. */
export function CheckoutPaymentSuccessHero({ orderNumber }: CheckoutPaymentSuccessHeroProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const ctaHref = orderNumber ? `/orders/${encodeURIComponent(orderNumber)}` : '/';
  const ctaLabel = orderNumber ? t('checkout.viewOrder') : t('checkout.home');

  return (
    <div
      className="mx-auto flex w-full flex-col items-center"
      style={{
        gap: MOBILE_ORDER_HERO_BLOCK_GAP_PX,
        maxWidth: MOBILE_ORDER_PLACED_HEADLINE_MAX_WIDTH_PX,
      }}
    >
      <CheckoutPaymentSuccessIllustration />
      <div
        className="flex w-full flex-col items-center"
        style={{ gap: MOBILE_ORDER_HEADLINE_TO_BUTTON_GAP_PX }}
      >
        <CheckoutPaymentSuccessCopy t={t} />
        <OrderMoreButton
          label={ctaLabel}
          labelFontSizePx={MOBILE_ORDER_PLACED_HEADLINE_FONT_SIZE_PX}
          onClick={() => router.push(ctaHref)}
        />
      </div>
    </div>
  );
}
