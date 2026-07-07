'use client';

import Image from 'next/image';
import { StorefrontCatalogLink } from '../storefront/StorefrontCatalogLink';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  CART_EMPTY_ASSETS,
  CART_EMPTY_CONTENT_LIFT_PX,
  CART_EMPTY_CTA_ARROW_SIZE_PX,
  CART_EMPTY_CTA_FONT_SIZE_PX,
  CART_EMPTY_CTA_HEIGHT_PX,
  CART_EMPTY_CTA_ICON_SIZE_PX,
  CART_EMPTY_ILLUSTRATION_HEIGHT_PX,
  CART_EMPTY_ILLUSTRATION_WIDTH_PX,
  CART_EMPTY_SUBTITLE_COLOR,
  CART_EMPTY_SUBTITLE_FONT_SIZE_PX,
  CART_EMPTY_SUBTITLE_TO_CTA_GAP_PX,
  CART_EMPTY_TITLE_FONT_SIZE_PX,
  CART_EMPTY_TITLE_TO_SUBTITLE_GAP_PX,
} from '../../constants/cart-empty-state';

interface CartEmptyStateProps {
  t: (key: string) => string;
  onCtaClick?: () => void;
}

/** Figma `66:476` — empty cart illustration, copy, and CTA. */
export function CartEmptyState({ t, onCtaClick }: CartEmptyStateProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [ctaWidthPx, setCtaWidthPx] = useState<number>();

  const emptyTitle = t('common.cart.empty');

  useLayoutEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) {
      return;
    }

    const syncCtaWidth = () => {
      setCtaWidthPx(titleElement.offsetWidth);
    };

    syncCtaWidth();

    const observer = new ResizeObserver(syncCtaWidth);
    observer.observe(titleElement);

    return () => {
      observer.disconnect();
    };
  }, [emptyTitle]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <div
        className="flex w-full flex-col items-center"
        style={{ transform: `translateY(-${CART_EMPTY_CONTENT_LIFT_PX}px)` }}
      >
        <div className="w-full max-w-[313px]">
          <Image
            src={CART_EMPTY_ASSETS.illustration}
            alt=""
            width={CART_EMPTY_ILLUSTRATION_WIDTH_PX}
            height={CART_EMPTY_ILLUSTRATION_HEIGHT_PX}
            aria-hidden
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        <div className="mt-4 flex w-full flex-col items-center">
          <h3
            ref={titleRef}
            className="whitespace-nowrap font-bold leading-[1.2] text-[#1c1b1b]"
            style={{ fontSize: CART_EMPTY_TITLE_FONT_SIZE_PX }}
          >
            {emptyTitle}
          </h3>

          <p
            className="mx-auto max-w-[328px] text-center leading-[1.5] tracking-[0.07px]"
            style={{
              color: CART_EMPTY_SUBTITLE_COLOR,
              fontSize: CART_EMPTY_SUBTITLE_FONT_SIZE_PX,
              marginTop: CART_EMPTY_TITLE_TO_SUBTITLE_GAP_PX,
            }}
          >
            {t('common.cart.emptyDescription')}
          </p>
        </div>
      </div>

      <StorefrontCatalogLink
        href="/products"
        onClick={onCtaClick}
        className="flex items-center justify-between rounded-full bg-brand-pink py-[5px] pl-6 pr-[9px] text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{
          minHeight: CART_EMPTY_CTA_HEIGHT_PX,
          marginTop: CART_EMPTY_SUBTITLE_TO_CTA_GAP_PX,
          fontSize: CART_EMPTY_CTA_FONT_SIZE_PX,
          width: ctaWidthPx,
        }}
      >
        <span className="flex-1 text-center">{t('common.cart.emptyCta')}</span>
        <span
          className="flex shrink-0 items-center justify-center rounded-full bg-white"
          style={{
            width: CART_EMPTY_CTA_ICON_SIZE_PX,
            height: CART_EMPTY_CTA_ICON_SIZE_PX,
          }}
        >
          <Image
            src={CART_EMPTY_ASSETS.ctaArrow}
            alt=""
            width={CART_EMPTY_CTA_ARROW_SIZE_PX}
            height={CART_EMPTY_CTA_ARROW_SIZE_PX}
            aria-hidden
          />
        </span>
      </StorefrontCatalogLink>
    </div>
  );
}
