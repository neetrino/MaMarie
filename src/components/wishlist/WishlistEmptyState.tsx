'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  WISHLIST_EMPTY_ASSETS,
  WISHLIST_EMPTY_CONTENT_MAX_WIDTH_PX,
  WISHLIST_EMPTY_COPY_TO_CTA_GAP_PX,
  WISHLIST_EMPTY_CTA_ARROW_SIZE_PX,
  WISHLIST_EMPTY_CTA_FONT_SIZE_PX,
  WISHLIST_EMPTY_CTA_HEIGHT_PX,
  WISHLIST_EMPTY_CTA_ICON_SIZE_PX,
  WISHLIST_EMPTY_ILLUSTRATION_HEIGHT_PX,
  WISHLIST_EMPTY_ILLUSTRATION_TO_COPY_GAP_PX,
  WISHLIST_EMPTY_ILLUSTRATION_WIDTH_PX,
  WISHLIST_EMPTY_SECTION_PADDING_TOP_PX,
  WISHLIST_EMPTY_SUBTITLE_COLOR,
  WISHLIST_EMPTY_SUBTITLE_FONT_SIZE_PX,
  WISHLIST_EMPTY_TITLE_FONT_SIZE_PX,
  WISHLIST_EMPTY_TITLE_MAX_WIDTH_PX,
  WISHLIST_EMPTY_TITLE_TO_SUBTITLE_GAP_PX,
} from '../../constants/wishlist-empty-state';

interface WishlistEmptyStateProps {
  t: (key: string) => string;
}

/** Figma `66:505` — empty wishlist illustration, copy, and CTA. */
export function WishlistEmptyState({ t }: WishlistEmptyStateProps) {
  return (
    <div
      className="flex justify-center px-6 pb-8"
      style={{ paddingTop: WISHLIST_EMPTY_SECTION_PADDING_TOP_PX }}
    >
      <div
        className="flex w-full flex-col items-center"
        style={{
          maxWidth: WISHLIST_EMPTY_CONTENT_MAX_WIDTH_PX,
          gap: WISHLIST_EMPTY_ILLUSTRATION_TO_COPY_GAP_PX,
        }}
      >
        <div className="w-full">
          <Image
            src={WISHLIST_EMPTY_ASSETS.illustration}
            alt=""
            width={WISHLIST_EMPTY_ILLUSTRATION_WIDTH_PX}
            height={WISHLIST_EMPTY_ILLUSTRATION_HEIGHT_PX}
            aria-hidden
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        <div
          className="flex w-full flex-col items-center"
          style={{ gap: WISHLIST_EMPTY_COPY_TO_CTA_GAP_PX }}
        >
          <div
            className="flex w-full flex-col items-center text-center"
            style={{ gap: WISHLIST_EMPTY_TITLE_TO_SUBTITLE_GAP_PX }}
          >
            <h2
              className="font-bold leading-[1.2] text-[#1c1b1b]"
              style={{
                fontSize: WISHLIST_EMPTY_TITLE_FONT_SIZE_PX,
                maxWidth: WISHLIST_EMPTY_TITLE_MAX_WIDTH_PX,
              }}
            >
              {t('common.wishlist.empty')}
            </h2>

            <p
              className="text-center leading-[1.5] tracking-[0.07px]"
              style={{
                color: WISHLIST_EMPTY_SUBTITLE_COLOR,
                fontSize: WISHLIST_EMPTY_SUBTITLE_FONT_SIZE_PX,
                maxWidth: WISHLIST_EMPTY_CONTENT_MAX_WIDTH_PX,
              }}
            >
              {t('common.wishlist.emptyDescription')}
            </p>
          </div>

          <Link
            href="/products"
            className="flex w-full items-center justify-between rounded-full bg-brand-pink py-[5px] pl-6 pr-[9px] text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              minHeight: WISHLIST_EMPTY_CTA_HEIGHT_PX,
              fontSize: WISHLIST_EMPTY_CTA_FONT_SIZE_PX,
            }}
          >
            <span className="flex-1 text-center">{t('common.wishlist.emptyCta')}</span>
            <span
              className="flex shrink-0 items-center justify-center rounded-full bg-white"
              style={{
                width: WISHLIST_EMPTY_CTA_ICON_SIZE_PX,
                height: WISHLIST_EMPTY_CTA_ICON_SIZE_PX,
              }}
            >
              <Image
                src={WISHLIST_EMPTY_ASSETS.ctaArrow}
                alt=""
                width={WISHLIST_EMPTY_CTA_ARROW_SIZE_PX}
                height={WISHLIST_EMPTY_CTA_ARROW_SIZE_PX}
                aria-hidden
              />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
