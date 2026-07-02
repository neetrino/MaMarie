'use client';

import {
  MOBILE_ORDER_ACCENT_COLOR,
  MOBILE_ORDER_ASSETS,
  MOBILE_ORDER_RECEIPT_SECTION_ID,
  MOBILE_ORDER_HEADLINE_COLOR,
  MOBILE_ORDER_HEADLINE_FONT_SIZE_PX,
  MOBILE_ORDER_HEADLINE_LINE_GAP_PX,
  MOBILE_ORDER_HEADLINE_LINE_HEIGHT,
  MOBILE_ORDER_HEADLINE_TO_BUTTON_GAP_PX,
  MOBILE_ORDER_HEADLINE_TO_SUBTITLE_GAP_PX,
  MOBILE_ORDER_PLACED_HEADLINE_FONT_SIZE_PX,
  MOBILE_ORDER_PLACED_HEADLINE_MAX_WIDTH_PX,
  MOBILE_ORDER_HERO_BLOCK_GAP_PX,
  MOBILE_ORDER_HERO_ILLUSTRATION_HEIGHT_PX,
  MOBILE_ORDER_HERO_ILLUSTRATION_OFFSET_LEFT_PERCENT,
  MOBILE_ORDER_HERO_ILLUSTRATION_OFFSET_TOP_PERCENT,
  MOBILE_ORDER_HERO_ILLUSTRATION_SCALE_HEIGHT,
  MOBILE_ORDER_HERO_ILLUSTRATION_SCALE_WIDTH,
  MOBILE_ORDER_HERO_ILLUSTRATION_WIDTH_PX,
  MOBILE_ORDER_SUBTITLE_COLOR,
  MOBILE_ORDER_SUBTITLE_FONT_SIZE_PX,
  MOBILE_ORDER_SUBTITLE_LINE_HEIGHT,
} from '../../../../constants/mobile-orders';
import { useTranslation } from '../../../../lib/i18n-client';
import type { Order } from '../types';
import { resolveMobileOrderHeroCopy } from '../utils/resolve-mobile-order-hero-copy';
import { OrderMoreButton } from './OrderMoreButton';

interface OrderReadyHeroProps {
  order: Order;
}

export function OrderReadyHero({ order }: OrderReadyHeroProps) {
  const { t } = useTranslation();
  const copy = resolveMobileOrderHeroCopy(order, t);

  const handleMoreClick = () => {
    document.getElementById(MOBILE_ORDER_RECEIPT_SECTION_ID)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const headlineFontSizePx =
    copy.variant === 'placed'
      ? MOBILE_ORDER_PLACED_HEADLINE_FONT_SIZE_PX
      : MOBILE_ORDER_HEADLINE_FONT_SIZE_PX;

  return (
    <div
      className="mx-auto flex w-full max-w-[328px] flex-col items-center"
      style={{ gap: MOBILE_ORDER_HERO_BLOCK_GAP_PX }}
    >
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: MOBILE_ORDER_HERO_ILLUSTRATION_WIDTH_PX,
          height: MOBILE_ORDER_HERO_ILLUSTRATION_HEIGHT_PX,
        }}
        aria-hidden
      >
        <img
          alt=""
          src={MOBILE_ORDER_ASSETS.readyBasket}
          decoding="async"
          draggable={false}
          className="absolute max-w-none object-contain"
          style={{
            width: `${MOBILE_ORDER_HERO_ILLUSTRATION_SCALE_WIDTH * 100}%`,
            height: `${MOBILE_ORDER_HERO_ILLUSTRATION_SCALE_HEIGHT * 100}%`,
            left: `${MOBILE_ORDER_HERO_ILLUSTRATION_OFFSET_LEFT_PERCENT}%`,
            top: `${MOBILE_ORDER_HERO_ILLUSTRATION_OFFSET_TOP_PERCENT}%`,
          }}
        />
      </div>

      <div
        className="flex w-full flex-col items-center"
        style={{ gap: MOBILE_ORDER_HEADLINE_TO_BUTTON_GAP_PX }}
      >
        <div className="flex w-full flex-col items-center text-center">
          <div
            className="flex flex-col font-bold"
            style={{
              fontSize: headlineFontSizePx,
              lineHeight: MOBILE_ORDER_HEADLINE_LINE_HEIGHT,
              maxWidth:
                copy.variant === 'placed' ? MOBILE_ORDER_PLACED_HEADLINE_MAX_WIDTH_PX : undefined,
              gap: MOBILE_ORDER_HEADLINE_LINE_GAP_PX,
            }}
          >
            {copy.variant === 'ready' ? (
              <>
                <p style={{ color: MOBILE_ORDER_ACCENT_COLOR }}>{copy.accent}</p>
                <p style={{ color: MOBILE_ORDER_HEADLINE_COLOR }}>{copy.titleLines[0]}</p>
              </>
            ) : (
              <>
                <p className="whitespace-nowrap" style={{ color: MOBILE_ORDER_HEADLINE_COLOR }}>
                  {copy.titleLines[0]}
                </p>
                <p className="whitespace-nowrap" style={{ color: MOBILE_ORDER_HEADLINE_COLOR }}>
                  {copy.titleLines[1]}
                </p>
              </>
            )}
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
            {copy.subtitle}
          </p>
        </div>

        <OrderMoreButton
          label={t('orders.mobile.more')}
          labelFontSizePx={headlineFontSizePx}
          onClick={handleMoreClick}
        />
      </div>
    </div>
  );
}
