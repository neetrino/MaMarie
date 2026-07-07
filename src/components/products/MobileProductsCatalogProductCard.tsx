'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import { memo, useLayoutEffect, useRef, useState } from 'react';
import {
  MOBILE_PRODUCTS_CATALOG_CARD_ASSETS,
  MOBILE_PRODUCTS_CATALOG_CARD_BG,
  MOBILE_PRODUCTS_CATALOG_CARD_COMPARE_COLOR,
  MOBILE_PRODUCTS_CATALOG_CARD_COMPARE_LINE_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_COMPARE_SIZE_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CONTENT_PADDING_X_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CONTENT_TOP_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CTA_CART_ICON_SIZE_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CTA_FONT_SIZE_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CTA_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CTA_HORIZONTAL_INSET_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CTA_ICON_SIZE_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CTA_LINE_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CTA_PADDING_LEFT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CTA_PADDING_RIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_CTA_TOP_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_DESIGN_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_PRICE_COLOR,
  MOBILE_PRODUCTS_CATALOG_CARD_PRICE_LINE_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_PRICE_SIZE_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_RADIUS_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_RATING_COLOR,
  MOBILE_PRODUCTS_CATALOG_CARD_RATING_LINE_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_RATING_SIZE_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_RATING_STAR_SIZE_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_RATING_STAR_TEXT_GAP_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_SUBTITLE_LINE_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_SUBTITLE_SIZE_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_TEXT_DARK,
  MOBILE_PRODUCTS_CATALOG_CARD_TEXT_MUTED,
  MOBILE_PRODUCTS_CATALOG_CARD_TITLE_LINE_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_TITLE_SIZE_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX,
} from '../../constants/mobile-products-catalog';
import { useAddToCart } from '../hooks/useAddToCart';
import { useCurrency } from '../hooks/useCurrency';
import { useWishlist } from '../hooks/useWishlist';
import { formatPrice } from '../../lib/currency';
import {
  mobileProductsCatalogCardLayoutPx,
  resolveMobileProductsCatalogCardHeightPx,
} from '../../lib/mobile-products-catalog-card-layout';
import { formatProductRatingLabel } from '../../lib/product-rating';
import { writeProductPageSnapshotFromCard } from '../../lib/product-page-snapshot';
import { resolveComparePrice } from '../home/home-product-card-shared';
import type { HomeProductCardData } from '../home/HomeProductCard';
import { MobileProductsCatalogColorSwatches } from './MobileProductsCatalogColorSwatches';
import { MobileProductsCatalogProductCardMedia } from './MobileProductsCatalogProductCardMedia';

interface MobileProductsCatalogProductCardProps {
  product: HomeProductCardData;
  layoutWidthPx?: number;
  imagePriority?: boolean;
  addToCartLabel: string;
}

function MobileProductsCatalogProductCardComponent({
  product,
  layoutWidthPx = MOBILE_PRODUCTS_CATALOG_CARD_WIDTH_PX,
  imagePriority = false,
  addToCartLabel,
}: MobileProductsCatalogProductCardProps) {
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
  const lp = (value: number) => mobileProductsCatalogCardLayoutPx(value, cardWidthPx);
  const cardHeightPx = resolveMobileProductsCatalogCardHeightPx(cardWidthPx);
  const comparePrice = resolveComparePrice(product);
  const subtitle = product.subtitle?.trim() || product.title;
  const ratingLabel = formatProductRatingLabel(
    product.averageRating ?? 0,
    product.reviewsCount ?? 0,
  );
  const saveSnapshot = () => writeProductPageSnapshotFromCard({
    slug: product.slug,
    title: product.title,
    image: product.image,
    subtitle: product.subtitle,
    price: product.price,
    originalPrice: product.originalPrice,
    compareAtPrice: product.compareAtPrice,
    colors: product.colors,
    sizes: product.sizes,
    averageRating: product.averageRating,
    reviewsCount: product.reviewsCount,
    inStock: product.inStock,
  });

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
        borderRadius: lp(MOBILE_PRODUCTS_CATALOG_CARD_RADIUS_PX),
        backgroundColor: MOBILE_PRODUCTS_CATALOG_CARD_BG,
      }}
    >
      <MobileProductsCatalogProductCardMedia
        slug={product.slug}
        title={product.title}
        imageSrc={product.image ?? ''}
        imagePriority={imagePriority}
        layoutWidthPx={cardWidthPx}
        isInWishlist={isInWishlist}
        onWishlistToggle={handleWishlist}
        onBeforeNavigate={saveSnapshot}
      />

      <div
        className="absolute inset-x-0"
        style={{
          top: lp(MOBILE_PRODUCTS_CATALOG_CARD_CONTENT_TOP_PX),
          paddingLeft: lp(MOBILE_PRODUCTS_CATALOG_CARD_CONTENT_PADDING_X_PX),
          paddingRight: lp(MOBILE_PRODUCTS_CATALOG_CARD_CONTENT_PADDING_X_PX),
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.slug}`}
              className="block truncate font-medium"
              onFocus={saveSnapshot}
              onPointerDown={saveSnapshot}
              style={{
                color: MOBILE_PRODUCTS_CATALOG_CARD_TEXT_DARK,
                fontSize: lp(MOBILE_PRODUCTS_CATALOG_CARD_TITLE_SIZE_PX),
                lineHeight: `${lp(MOBILE_PRODUCTS_CATALOG_CARD_TITLE_LINE_HEIGHT_PX)}px`,
              }}
            >
              {product.title}
            </Link>
            <p
              className="truncate font-normal"
              style={{
                color: MOBILE_PRODUCTS_CATALOG_CARD_TEXT_MUTED,
                fontSize: lp(MOBILE_PRODUCTS_CATALOG_CARD_SUBTITLE_SIZE_PX),
                lineHeight: `${lp(MOBILE_PRODUCTS_CATALOG_CARD_SUBTITLE_LINE_HEIGHT_PX)}px`,
              }}
            >
              {subtitle}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p
              className="font-bold whitespace-nowrap"
              style={{
                color: MOBILE_PRODUCTS_CATALOG_CARD_PRICE_COLOR,
                fontSize: lp(MOBILE_PRODUCTS_CATALOG_CARD_PRICE_SIZE_PX),
                lineHeight: `${lp(MOBILE_PRODUCTS_CATALOG_CARD_PRICE_LINE_HEIGHT_PX)}px`,
              }}
            >
              {formatPrice(product.price, currency)}
            </p>
            {comparePrice != null ? (
              <p
                className="font-light line-through whitespace-nowrap"
                style={{
                  color: MOBILE_PRODUCTS_CATALOG_CARD_COMPARE_COLOR,
                  fontSize: lp(MOBILE_PRODUCTS_CATALOG_CARD_COMPARE_SIZE_PX),
                  lineHeight: `${lp(MOBILE_PRODUCTS_CATALOG_CARD_COMPARE_LINE_HEIGHT_PX)}px`,
                }}
              >
                {formatPrice(comparePrice, currency)}
              </p>
            ) : null}
          </div>
        </div>

        <MobileProductsCatalogColorSwatches
          colors={product.colors}
          layoutWidthPx={cardWidthPx}
        />

        <div
          className="flex items-center"
          style={{
            marginTop: lp(6),
            gap: lp(MOBILE_PRODUCTS_CATALOG_CARD_RATING_STAR_TEXT_GAP_PX),
            color: MOBILE_PRODUCTS_CATALOG_CARD_RATING_COLOR,
            fontSize: lp(MOBILE_PRODUCTS_CATALOG_CARD_RATING_SIZE_PX),
            lineHeight: `${lp(MOBILE_PRODUCTS_CATALOG_CARD_RATING_LINE_HEIGHT_PX)}px`,
          }}
        >
          <Image
            src={MOBILE_PRODUCTS_CATALOG_CARD_ASSETS.star}
            alt=""
            width={lp(MOBILE_PRODUCTS_CATALOG_CARD_RATING_STAR_SIZE_PX)}
            height={lp(MOBILE_PRODUCTS_CATALOG_CARD_RATING_STAR_SIZE_PX)}
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
          left: lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_HORIZONTAL_INSET_PX),
          right: lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_HORIZONTAL_INSET_PX),
          bottom: lp(
            MOBILE_PRODUCTS_CATALOG_CARD_DESIGN_HEIGHT_PX
              - MOBILE_PRODUCTS_CATALOG_CARD_CTA_TOP_PX
              - MOBILE_PRODUCTS_CATALOG_CARD_CTA_HEIGHT_PX,
          ),
          minHeight: lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_HEIGHT_PX),
          paddingTop: lp(5),
          paddingBottom: lp(5),
          paddingLeft: lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_PADDING_LEFT_PX),
          paddingRight: lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_PADDING_RIGHT_PX),
          fontSize: lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_FONT_SIZE_PX),
          lineHeight: `${lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_LINE_HEIGHT_PX)}px`,
        }}
      >
        <span className="flex-1 text-center font-medium">{addToCartLabel}</span>
        <span
          className="flex shrink-0 items-center justify-center rounded-full bg-white"
          style={{
            width: lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_ICON_SIZE_PX),
            height: lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_ICON_SIZE_PX),
          }}
        >
          <Image
            src={MOBILE_PRODUCTS_CATALOG_CARD_ASSETS.cart}
            alt=""
            width={lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_CART_ICON_SIZE_PX)}
            height={lp(MOBILE_PRODUCTS_CATALOG_CARD_CTA_CART_ICON_SIZE_PX)}
          />
        </span>
      </button>
    </article>
  );
}

export const MobileProductsCatalogProductCard = memo(MobileProductsCatalogProductCardComponent);
