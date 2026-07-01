'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import { memo, useLayoutEffect, useRef, useState } from 'react';
import {
  MOBILE_WISHLIST_CARD_ASSETS,
  MOBILE_WISHLIST_CARD_BG,
  MOBILE_WISHLIST_CARD_COMPARE_COLOR,
  MOBILE_WISHLIST_CARD_COMPARE_LINE_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_COMPARE_SIZE_PX,
  MOBILE_WISHLIST_CARD_CONTENT_PADDING_X_PX,
  MOBILE_WISHLIST_CARD_CONTENT_TOP_PX,
  MOBILE_WISHLIST_CARD_CTA_CART_ICON_SIZE_PX,
  MOBILE_WISHLIST_CARD_CTA_FONT_SIZE_PX,
  MOBILE_WISHLIST_CARD_CTA_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_CTA_HORIZONTAL_INSET_PX,
  MOBILE_WISHLIST_CARD_CTA_ICON_SIZE_PX,
  MOBILE_WISHLIST_CARD_CTA_LINE_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_CTA_PADDING_LEFT_PX,
  MOBILE_WISHLIST_CARD_CTA_PADDING_RIGHT_PX,
  MOBILE_WISHLIST_CARD_CTA_TOP_PX,
  MOBILE_WISHLIST_CARD_DESIGN_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_HEART_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_HEART_RIGHT_PX,
  MOBILE_WISHLIST_CARD_HEART_TOP_PX,
  MOBILE_WISHLIST_CARD_HEART_WIDTH_PX,
  MOBILE_WISHLIST_CARD_IMAGE_FRAME_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_IMAGE_FRAME_LEFT_PX,
  MOBILE_WISHLIST_CARD_IMAGE_FRAME_RADIUS_PX,
  MOBILE_WISHLIST_CARD_IMAGE_FRAME_TOP_PX,
  MOBILE_WISHLIST_CARD_IMAGE_FRAME_WIDTH_PX,
  MOBILE_WISHLIST_CARD_IMAGE_INNER_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_IMAGE_INNER_LEFT_PX,
  MOBILE_WISHLIST_CARD_IMAGE_INNER_TOP_PX,
  MOBILE_WISHLIST_CARD_IMAGE_INNER_WIDTH_PX,
  MOBILE_WISHLIST_CARD_PRICE_COLOR,
  MOBILE_WISHLIST_CARD_PRICE_LINE_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_PRICE_SIZE_PX,
  MOBILE_WISHLIST_CARD_RADIUS_PX,
  MOBILE_WISHLIST_CARD_RATING_COLOR,
  MOBILE_WISHLIST_CARD_RATING_LINE_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_RATING_SIZE_PX,
  MOBILE_WISHLIST_CARD_RATING_STAR_SIZE_PX,
  MOBILE_WISHLIST_CARD_RATING_STAR_TEXT_GAP_PX,
  MOBILE_WISHLIST_CARD_SUBTITLE_LINE_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_SUBTITLE_SIZE_PX,
  MOBILE_WISHLIST_CARD_TEXT_DARK,
  MOBILE_WISHLIST_CARD_TEXT_MUTED,
  MOBILE_WISHLIST_CARD_TITLE_LINE_HEIGHT_PX,
  MOBILE_WISHLIST_CARD_TITLE_SIZE_PX,
  MOBILE_WISHLIST_CARD_WIDTH_PX,
} from '../../constants/mobile-wishlist';
import { useAddToCart } from '../hooks/useAddToCart';
import { useCurrency } from '../hooks/useCurrency';
import { useWishlist } from '../hooks/useWishlist';
import { formatPrice } from '../../lib/currency';
import { mobileWishlistCardLayoutPx, resolveMobileWishlistCardHeightPx } from '../../lib/mobile-wishlist-card-layout';
import { formatProductRatingLabel } from '../../lib/product-rating';
import { WishlistIcon } from '../icons/WishlistIcon';
import { resolveComparePrice } from '../home/home-product-card-shared';
import type { HomeProductCardData } from '../home/HomeProductCard';

interface MobileWishlistProductCardProps {
  product: HomeProductCardData;
  layoutWidthPx?: number;
  imagePriority?: boolean;
  addToCartLabel: string;
}

function MobileWishlistProductCardComponent({
  product,
  layoutWidthPx = MOBILE_WISHLIST_CARD_WIDTH_PX,
  imagePriority = false,
  addToCartLabel,
}: MobileWishlistProductCardProps) {
  const currency = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist(product.id);
  const { isAddingToCart, addToCart } = useAddToCart({
    productId: product.id,
    productSlug: product.slug,
    inStock: product.inStock,
    defaultVariantId: product.defaultVariantId ?? undefined,
    price: product.price,
    title: product.title,
    image: product.image,
    originalPrice: product.originalPrice ?? product.compareAtPrice,
  });
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const [measuredWidthPx, setMeasuredWidthPx] = useState(layoutWidthPx);

  useLayoutEffect(() => {
    const node = cardRef.current;
    if (!node) {
      return;
    }

    const updateWidth = () => {
      setMeasuredWidthPx(node.offsetWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const cardWidthPx = measuredWidthPx > 0 ? measuredWidthPx : layoutWidthPx;
  const lp = (value: number) => mobileWishlistCardLayoutPx(value, cardWidthPx);
  const cardHeightPx = resolveMobileWishlistCardHeightPx(cardWidthPx);
  const imageSrc =
    product.image && !imageError ? product.image : MOBILE_WISHLIST_CARD_ASSETS.placeholderImage;
  const comparePrice = resolveComparePrice(product);
  const subtitle = product.subtitle?.trim() || product.title;
  const ratingLabel = formatProductRatingLabel(
    product.averageRating ?? 0,
    product.reviewsCount ?? 0,
  );

  const handleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist();
    event.currentTarget.blur();
  };

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart({ origin: event.currentTarget, imageUrl: product.image });
    event.currentTarget.blur();
  };

  return (
    <article
      ref={cardRef}
      className="relative w-full shrink-0 overflow-hidden"
      style={{
        height: cardHeightPx,
        borderRadius: lp(MOBILE_WISHLIST_CARD_RADIUS_PX),
        backgroundColor: MOBILE_WISHLIST_CARD_BG,
      }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          left: lp(MOBILE_WISHLIST_CARD_IMAGE_FRAME_LEFT_PX),
          top: lp(MOBILE_WISHLIST_CARD_IMAGE_FRAME_TOP_PX),
          width: lp(MOBILE_WISHLIST_CARD_IMAGE_FRAME_WIDTH_PX),
          height: lp(MOBILE_WISHLIST_CARD_IMAGE_FRAME_HEIGHT_PX),
          borderRadius: lp(MOBILE_WISHLIST_CARD_IMAGE_FRAME_RADIUS_PX),
        }}
      >
        <Link
          href={`/products/${product.slug}`}
          className="absolute overflow-hidden"
          style={{
            left: lp(MOBILE_WISHLIST_CARD_IMAGE_INNER_LEFT_PX),
            top: lp(MOBILE_WISHLIST_CARD_IMAGE_INNER_TOP_PX),
            width: lp(MOBILE_WISHLIST_CARD_IMAGE_INNER_WIDTH_PX),
            height: lp(MOBILE_WISHLIST_CARD_IMAGE_INNER_HEIGHT_PX),
          }}
        >
          <div
            className="pointer-events-none absolute max-w-none"
            style={{
              height: '138.41%',
              width: '107.38%',
              left: '-3.69%',
              top: '-26.24%',
            }}
          >
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              priority={imagePriority}
              loading={imagePriority ? 'eager' : 'lazy'}
              sizes={`${lp(MOBILE_WISHLIST_CARD_IMAGE_INNER_WIDTH_PX)}px`}
              className="object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={isInWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute z-10 flex items-center justify-center transition-opacity hover:opacity-80 ${
            isInWishlist ? 'text-brand-pink' : ''
          }`}
          style={{
            top: lp(MOBILE_WISHLIST_CARD_HEART_TOP_PX),
            right: lp(MOBILE_WISHLIST_CARD_HEART_RIGHT_PX),
            width: lp(MOBILE_WISHLIST_CARD_HEART_WIDTH_PX),
            height: lp(MOBILE_WISHLIST_CARD_HEART_HEIGHT_PX),
          }}
        >
          <WishlistIcon
            isActive={isInWishlist}
            size={lp(MOBILE_WISHLIST_CARD_HEART_WIDTH_PX)}
          />
        </button>
      </div>

      <div
        className="absolute inset-x-0"
        style={{
          top: lp(MOBILE_WISHLIST_CARD_CONTENT_TOP_PX),
          paddingLeft: lp(MOBILE_WISHLIST_CARD_CONTENT_PADDING_X_PX),
          paddingRight: lp(MOBILE_WISHLIST_CARD_CONTENT_PADDING_X_PX),
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.slug}`}
              className="block truncate font-medium"
              style={{
                color: MOBILE_WISHLIST_CARD_TEXT_DARK,
                fontSize: lp(MOBILE_WISHLIST_CARD_TITLE_SIZE_PX),
                lineHeight: `${lp(MOBILE_WISHLIST_CARD_TITLE_LINE_HEIGHT_PX)}px`,
              }}
            >
              {product.title}
            </Link>
            <p
              className="truncate font-normal"
              style={{
                color: MOBILE_WISHLIST_CARD_TEXT_MUTED,
                fontSize: lp(MOBILE_WISHLIST_CARD_SUBTITLE_SIZE_PX),
                lineHeight: `${lp(MOBILE_WISHLIST_CARD_SUBTITLE_LINE_HEIGHT_PX)}px`,
              }}
            >
              {subtitle}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p
              className="font-bold whitespace-nowrap"
              style={{
                color: MOBILE_WISHLIST_CARD_PRICE_COLOR,
                fontSize: lp(MOBILE_WISHLIST_CARD_PRICE_SIZE_PX),
                lineHeight: `${lp(MOBILE_WISHLIST_CARD_PRICE_LINE_HEIGHT_PX)}px`,
              }}
            >
              {formatPrice(product.price, currency)}
            </p>
            {comparePrice != null ? (
              <p
                className="font-light line-through whitespace-nowrap"
                style={{
                  color: MOBILE_WISHLIST_CARD_COMPARE_COLOR,
                  fontSize: lp(MOBILE_WISHLIST_CARD_COMPARE_SIZE_PX),
                  lineHeight: `${lp(MOBILE_WISHLIST_CARD_COMPARE_LINE_HEIGHT_PX)}px`,
                }}
              >
                {formatPrice(comparePrice, currency)}
              </p>
            ) : null}
          </div>
        </div>

        <div
          className="flex items-center"
          style={{
            marginTop: lp(4),
            gap: lp(MOBILE_WISHLIST_CARD_RATING_STAR_TEXT_GAP_PX),
            color: MOBILE_WISHLIST_CARD_RATING_COLOR,
            fontSize: lp(MOBILE_WISHLIST_CARD_RATING_SIZE_PX),
            lineHeight: `${lp(MOBILE_WISHLIST_CARD_RATING_LINE_HEIGHT_PX)}px`,
          }}
        >
          <Image
            src={MOBILE_WISHLIST_CARD_ASSETS.star}
            alt=""
            width={lp(MOBILE_WISHLIST_CARD_RATING_STAR_SIZE_PX)}
            height={lp(MOBILE_WISHLIST_CARD_RATING_STAR_SIZE_PX)}
            className="shrink-0"
          />
          <span className="font-normal">{ratingLabel}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!product.inStock || isAddingToCart}
        aria-label={addToCartLabel}
        className="absolute flex items-center justify-between rounded-full bg-brand-pink text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          left: lp(MOBILE_WISHLIST_CARD_CTA_HORIZONTAL_INSET_PX),
          right: lp(MOBILE_WISHLIST_CARD_CTA_HORIZONTAL_INSET_PX),
          bottom: lp(MOBILE_WISHLIST_CARD_DESIGN_HEIGHT_PX - MOBILE_WISHLIST_CARD_CTA_TOP_PX - MOBILE_WISHLIST_CARD_CTA_HEIGHT_PX),
          minHeight: lp(MOBILE_WISHLIST_CARD_CTA_HEIGHT_PX),
          paddingTop: lp(5),
          paddingBottom: lp(5),
          paddingLeft: lp(MOBILE_WISHLIST_CARD_CTA_PADDING_LEFT_PX),
          paddingRight: lp(MOBILE_WISHLIST_CARD_CTA_PADDING_RIGHT_PX),
          fontSize: lp(MOBILE_WISHLIST_CARD_CTA_FONT_SIZE_PX),
          lineHeight: `${lp(MOBILE_WISHLIST_CARD_CTA_LINE_HEIGHT_PX)}px`,
        }}
      >
        <span className="flex-1 text-center font-medium">{addToCartLabel}</span>
        <span
          className="flex shrink-0 items-center justify-center rounded-full bg-white"
          style={{
            width: lp(MOBILE_WISHLIST_CARD_CTA_ICON_SIZE_PX),
            height: lp(MOBILE_WISHLIST_CARD_CTA_ICON_SIZE_PX),
          }}
        >
          <Image
            src={MOBILE_WISHLIST_CARD_ASSETS.cart}
            alt=""
            width={lp(MOBILE_WISHLIST_CARD_CTA_CART_ICON_SIZE_PX)}
            height={lp(MOBILE_WISHLIST_CARD_CTA_CART_ICON_SIZE_PX)}
          />
        </span>
      </button>
    </article>
  );
}

export const MobileWishlistProductCard = memo(MobileWishlistProductCardComponent);
