'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import { memo, useState } from 'react';
import {
  HOME_PRODUCT_CARD_ASSETS,
  HOME_PRODUCT_CARD_CART_BG,
  HOME_PRODUCT_CARD_CART_ICON_SIZE_HOVER_PX,
  HOME_PRODUCT_CARD_COMPARE_COLOR,
  HOME_PRODUCT_CARD_HEART_RIGHT_PX,
  HOME_PRODUCT_CARD_HEART_SIZE_PX,
  HOME_PRODUCT_CARD_HEART_TOP_PX,
  HOME_PRODUCT_CARD_IMAGE_WIDTH_PX,
  HOME_PRODUCT_CARD_PANEL_HEIGHT_PX,
  HOME_PRODUCT_CARD_PANEL_LEFT_COLUMN_WIDTH_PX,
  HOME_PRODUCT_CARD_PANEL_RADIUS_PX,
  HOME_PRODUCT_CARD_PANEL_TOP_PX,
  HOME_PRODUCT_CARD_PANEL_WIDTH_PX,
  HOME_PRODUCT_CARD_PRICE_COLOR,
  HOME_PRODUCT_CARD_RADIUS_PX,
  HOME_PRODUCT_CARD_RATING_COLOR,
  HOME_PRODUCT_CARD_RATING_STAR_TEXT_GAP_PX,
  HOME_PRODUCT_CARD_TEXT_DARK,
  HOME_PRODUCT_CARD_TEXT_MUTED,
  HOME_PRODUCT_CARD_WIDTH_PX,
} from '../../constants/home-sections';
import { useAddToCart } from '../hooks/useAddToCart';
import { useCurrency } from '../hooks/useCurrency';
import { useWishlist } from '../hooks/useWishlist';
import { formatPrice } from '../../lib/currency';
import {
  homeProductCardLayoutPx,
  HOME_PRODUCT_CARD_COMPACT_DESCRIPTION_TO_SWATCHES_GAP_PX,
  resolveHomeProductCardHeightPx,
  resolveHomeProductCardTypography,
} from '../../lib/home-product-card-layout';
import { formatProductRatingLabel } from '../../lib/product-rating';
import { writeProductPageSnapshotFromCard } from '../../lib/product-page-snapshot';
import { WishlistIcon } from '../icons/WishlistIcon';
import { buildHomeProductCardCssVars, resolveComparePrice } from './home-product-card-shared';
import { HomeProductCardColorSwatches } from './HomeProductCardColorSwatches';
import { HomeProductCardSizeBadges } from './HomeProductCardSizeBadges';
import type {
  ProductColorOption,
  ProductSizeOption,
} from '../../lib/services/product-variant-attributes';

export interface HomeProductCardData {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  price: number;
  compareAtPrice?: number | null;
  originalPrice?: number | null;
  image: string | null;
  inStock: boolean;
  defaultVariantId?: string | null;
  colors?: ProductColorOption[];
  sizes?: ProductSizeOption[];
  averageRating?: number;
  reviewsCount?: number;
}

interface HomeProductCardProps {
  product: HomeProductCardData;
  layoutWidthPx?: number;
  layoutHeightPx?: number;
  /** Tighter panel typography — catalog 4-column view. */
  compactPanel?: boolean;
  /** Preload image for above-the-fold catalog cards. */
  imagePriority?: boolean;
  /** Static card — no hover lift, size badges, or cart/image transitions (mobile home). */
  disableHoverEffects?: boolean;
}

function areHomeProductCardPropsEqual(
  prev: HomeProductCardProps,
  next: HomeProductCardProps
): boolean {
  if (
    prev.layoutWidthPx !== next.layoutWidthPx ||
    prev.layoutHeightPx !== next.layoutHeightPx ||
    prev.compactPanel !== next.compactPanel ||
    prev.imagePriority !== next.imagePriority ||
    prev.disableHoverEffects !== next.disableHoverEffects
  ) {
    return false;
  }

  const prevProduct = prev.product;
  const nextProduct = next.product;
  return (
    prevProduct.id === nextProduct.id &&
    prevProduct.slug === nextProduct.slug &&
    prevProduct.title === nextProduct.title &&
    prevProduct.subtitle === nextProduct.subtitle &&
    prevProduct.price === nextProduct.price &&
    prevProduct.compareAtPrice === nextProduct.compareAtPrice &&
    prevProduct.originalPrice === nextProduct.originalPrice &&
    prevProduct.image === nextProduct.image &&
    prevProduct.inStock === nextProduct.inStock &&
    prevProduct.defaultVariantId === nextProduct.defaultVariantId &&
    prevProduct.averageRating === nextProduct.averageRating &&
    prevProduct.reviewsCount === nextProduct.reviewsCount
  );
}

function HomeProductCardComponent({
  product,
  layoutWidthPx,
  layoutHeightPx,
  compactPanel = false,
  imagePriority = false,
  disableHoverEffects = false,
}: HomeProductCardProps) {
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

  const imageSrc =
    product.image && !imageError ? product.image : HOME_PRODUCT_CARD_ASSETS.placeholderImage;
  const comparePrice = resolveComparePrice(product);
  const subtitle = product.subtitle?.trim() || product.title;
  const ratingLabel = formatProductRatingLabel(
    product.averageRating ?? 0,
    product.reviewsCount ?? 0
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
    const origin = event.currentTarget;
    addToCart({ origin, imageUrl: product.image });
    event.currentTarget.blur();
  };

  const lp = (value: number) => homeProductCardLayoutPx(value, layoutWidthPx);
  const cardWidth = layoutWidthPx ?? HOME_PRODUCT_CARD_WIDTH_PX;
  const cardHeight = resolveHomeProductCardHeightPx(layoutWidthPx, layoutHeightPx);
  const typography = resolveHomeProductCardTypography(layoutWidthPx, compactPanel);

  const priceRow = (
    <div
      className="flex items-center whitespace-nowrap"
      style={{ gap: lp(16), lineHeight: `${typography.priceLineHeightPx}px` }}
    >
      <p
        className="font-bold"
        style={{ color: HOME_PRODUCT_CARD_PRICE_COLOR, fontSize: typography.priceSizePx }}
      >
        {formatPrice(product.price, currency)}
      </p>
      {comparePrice != null ? (
        <p
          className="font-normal line-through"
          style={{
            color: HOME_PRODUCT_CARD_COMPARE_COLOR,
            fontSize: typography.compareSizePx,
          }}
        >
          {formatPrice(comparePrice, currency)}
        </p>
      ) : null}
    </div>
  );

  const ratingRow = compactPanel ? (
    <div
      className="flex items-center justify-end whitespace-nowrap"
      style={{
        height: typography.ratingLineHeightPx,
        gap: lp(HOME_PRODUCT_CARD_RATING_STAR_TEXT_GAP_PX),
        color: HOME_PRODUCT_CARD_RATING_COLOR,
        fontSize: typography.ratingSizePx,
        lineHeight: `${typography.ratingLineHeightPx}px`,
      }}
    >
      <Image
        src={HOME_PRODUCT_CARD_ASSETS.star}
        alt=""
        width={typography.ratingStarSizePx}
        height={typography.ratingStarSizePx}
        className="shrink-0"
      />
      <span className="font-normal">{ratingLabel}</span>
    </div>
  ) : (
    <div className="relative shrink-0" style={{ width: lp(71), height: typography.ratingLineHeightPx }}>
      <Image
        src={HOME_PRODUCT_CARD_ASSETS.star}
        alt=""
        width={typography.ratingStarSizePx}
        height={typography.ratingStarSizePx}
        className="absolute top-0"
        style={{ left: lp(-7) }}
      />
      <p
        className="absolute whitespace-nowrap font-normal"
        style={{
          left: lp(11),
          top: 0,
          color: HOME_PRODUCT_CARD_RATING_COLOR,
          fontSize: typography.ratingSizePx,
          lineHeight: `${typography.ratingLineHeightPx}px`,
        }}
      >
        {ratingLabel}
      </p>
    </div>
  );

  const cartButton = (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!product.inStock || isAddingToCart}
      aria-label="Add to cart"
      className="home-product-card-cart relative shrink-0 rounded-full disabled:cursor-not-allowed disabled:opacity-50"
      style={{ backgroundColor: HOME_PRODUCT_CARD_CART_BG }}
    >
      <Image
        src={HOME_PRODUCT_CARD_ASSETS.cart}
        alt=""
        width={HOME_PRODUCT_CARD_CART_ICON_SIZE_HOVER_PX}
        height={HOME_PRODUCT_CARD_CART_ICON_SIZE_HOVER_PX}
        className="home-product-card-cart-icon absolute"
      />
    </button>
  );

  const subtitleLine = (
    <p
      className="truncate font-normal"
      style={{
        color: HOME_PRODUCT_CARD_TEXT_MUTED,
        fontSize: typography.subtitleSizePx,
        lineHeight: `${typography.subtitleLineHeightPx}px`,
      }}
    >
      {subtitle}
    </p>
  );

  const titleLine = (
    <Link
      href={`/products/${product.slug}`}
      className="truncate font-bold"
      onFocus={saveSnapshot}
      onPointerDown={saveSnapshot}
      style={{
        color: HOME_PRODUCT_CARD_TEXT_DARK,
        fontSize: typography.titleSizePx,
        lineHeight: `${typography.titleLineHeightPx}px`,
      }}
    >
      {product.title}
    </Link>
  );

  const colorSwatches = (
    <HomeProductCardColorSwatches
      colors={product.colors}
      layoutWidthPx={layoutWidthPx}
      maxVisible={typography.colorSwatchMaxVisible}
    />
  );

  const standardPanelContent = (
    <div className="flex w-full items-start justify-between" style={{ gap: lp(8) }}>
      <div
        className="flex min-w-0 flex-col"
        style={{ gap: lp(7), width: lp(HOME_PRODUCT_CARD_PANEL_LEFT_COLUMN_WIDTH_PX) }}
      >
        {titleLine}
        {subtitleLine}
        {colorSwatches}
        {priceRow}
      </div>

      <div
        className="home-product-card-actions flex shrink-0 flex-col items-end justify-center"
        style={{ width: lp(100) }}
      >
        {ratingRow}
        {cartButton}
      </div>
    </div>
  );

  const compactPanelContent = (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex w-full items-center justify-between" style={{ gap: lp(8) }}>
        <div className="min-w-0 flex-1">{titleLine}</div>
        {ratingRow}
      </div>

      <div
        className="flex flex-1 flex-col justify-center"
        style={{ gap: HOME_PRODUCT_CARD_COMPACT_DESCRIPTION_TO_SWATCHES_GAP_PX }}
      >
        {subtitleLine}
        {colorSwatches}
      </div>

      <div className="flex items-center justify-between" style={{ gap: lp(8) }}>
        {priceRow}
        <div className="home-product-card-actions flex shrink-0 items-center justify-center">
          {cartButton}
        </div>
      </div>
    </div>
  );

  return (
    <article
      className={`home-product-card relative shrink-0 overflow-visible${
        disableHoverEffects ? ' home-product-card--static' : ''
      }`}
      style={{ width: cardWidth, height: cardHeight, ...buildHomeProductCardCssVars(layoutWidthPx) }}
    >
      <div
        className="home-product-card-surface relative h-full w-full overflow-visible"
        style={{ borderRadius: lp(HOME_PRODUCT_CARD_RADIUS_PX) }}
      >
        <Link
          href={`/products/${product.slug}`}
          className="home-product-card-image-wrap absolute overflow-hidden"
          onFocus={saveSnapshot}
          onPointerDown={saveSnapshot}
        >
          <div
            className="pointer-events-none absolute relative max-w-none"
            style={{
              height: '133.2%',
              width: '107.38%',
              left: '-3.69%',
              top: '-21.48%',
            }}
          >
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              priority={imagePriority}
              loading={imagePriority ? 'eager' : 'lazy'}
              sizes={`${lp(HOME_PRODUCT_CARD_IMAGE_WIDTH_PX)}px`}
              className="object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        </Link>

        {!disableHoverEffects ? (
          <HomeProductCardSizeBadges sizes={product.sizes} layoutWidthPx={layoutWidthPx} />
        ) : null}

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={isInWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute z-20 flex items-center justify-center transition-colors hover:opacity-80 ${
            isInWishlist ? 'text-brand-pink' : ''
          }`}
          style={{
            top: lp(HOME_PRODUCT_CARD_HEART_TOP_PX),
            right: lp(HOME_PRODUCT_CARD_HEART_RIGHT_PX),
            width: lp(HOME_PRODUCT_CARD_HEART_SIZE_PX),
            height: lp(HOME_PRODUCT_CARD_HEART_SIZE_PX),
          }}
        >
          <WishlistIcon isActive={isInWishlist} size={lp(HOME_PRODUCT_CARD_HEART_SIZE_PX)} />
        </button>

        <div
          className="absolute left-1/2 flex w-full -translate-x-1/2 flex-col bg-white"
          style={{
            top: lp(HOME_PRODUCT_CARD_PANEL_TOP_PX),
            width: lp(HOME_PRODUCT_CARD_PANEL_WIDTH_PX),
            height: lp(HOME_PRODUCT_CARD_PANEL_HEIGHT_PX),
            borderRadius: lp(HOME_PRODUCT_CARD_PANEL_RADIUS_PX),
            paddingTop: lp(compactPanel ? 14 : 23),
            paddingBottom: lp(9),
            paddingLeft: lp(18),
            paddingRight: lp(20),
          }}
        >
          {compactPanel ? compactPanelContent : standardPanelContent}
        </div>
      </div>
    </article>
  );
}

/** Memoized catalog card — skips re-render when product display fields are unchanged. */
export const HomeProductCard = memo(HomeProductCardComponent, areHomeProductCardPropsEqual);
