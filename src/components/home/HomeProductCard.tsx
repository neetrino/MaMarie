'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, MouseEvent } from 'react';
import { memo, useState } from 'react';
import {
  HOME_PRODUCT_CARD_ACTIONS_GAP_PX,
  HOME_PRODUCT_CARD_ACTIONS_HOVER_GAP_PX,
  HOME_PRODUCT_CARD_ASSETS,
  HOME_PRODUCT_CARD_BG,
  HOME_PRODUCT_CARD_CART_BG,
  HOME_PRODUCT_CARD_CART_ICON_HOVER_LEFT_PX,
  HOME_PRODUCT_CARD_CART_ICON_HOVER_TOP_PX,
  HOME_PRODUCT_CARD_CART_ICON_LEFT_PX,
  HOME_PRODUCT_CARD_CART_ICON_SIZE_HOVER_PX,
  HOME_PRODUCT_CARD_CART_ICON_SIZE_PX,
  HOME_PRODUCT_CARD_CART_ICON_TOP_PX,
  HOME_PRODUCT_CARD_CART_SIZE_HOVER_PX,
  HOME_PRODUCT_CARD_CART_SIZE_PX,
  HOME_PRODUCT_CARD_COMPARE_COLOR,
  HOME_PRODUCT_CARD_COMPARE_SIZE_PX,
  HOME_PRODUCT_CARD_HEIGHT_PX,
  HOME_PRODUCT_CARD_HEART_RIGHT_PX,
  HOME_PRODUCT_CARD_HEART_SIZE_PX,
  HOME_PRODUCT_CARD_HEART_TOP_PX,
  HOME_PRODUCT_CARD_HOVER_BG,
  HOME_PRODUCT_CARD_IMAGE_HEIGHT_PX,
  HOME_PRODUCT_CARD_IMAGE_HOVER_HEIGHT_PX,
  HOME_PRODUCT_CARD_IMAGE_HOVER_LEFT_PX,
  HOME_PRODUCT_CARD_IMAGE_HOVER_TOP_PX,
  HOME_PRODUCT_CARD_IMAGE_HOVER_WIDTH_PX,
  HOME_PRODUCT_CARD_IMAGE_LEFT_PX,
  HOME_PRODUCT_CARD_IMAGE_TOP_PX,
  HOME_PRODUCT_CARD_IMAGE_WIDTH_PX,
  HOME_PRODUCT_CARD_LIFT_PX,
  HOME_PRODUCT_CARD_PANEL_HEIGHT_PX,
  HOME_PRODUCT_CARD_PANEL_LEFT_COLUMN_WIDTH_PX,
  HOME_PRODUCT_CARD_PANEL_RADIUS_PX,
  HOME_PRODUCT_CARD_PANEL_TOP_PX,
  HOME_PRODUCT_CARD_PANEL_WIDTH_PX,
  HOME_PRODUCT_CARD_PRICE_COLOR,
  HOME_PRODUCT_CARD_PRICE_SIZE_PX,
  HOME_PRODUCT_CARD_RADIUS_PX,
  HOME_PRODUCT_CARD_RATING_COLOR,
  HOME_PRODUCT_CARD_RATING_SIZE_PX,
  HOME_PRODUCT_CARD_SUBTITLE_SIZE_PX,
  HOME_PRODUCT_CARD_TEXT_DARK,
  HOME_PRODUCT_CARD_TEXT_MUTED,
  HOME_PRODUCT_CARD_TITLE_SIZE_PX,
  HOME_PRODUCT_CARD_WIDTH_PX,
} from '../../constants/home-sections';
import { useAddToCart } from '../hooks/useAddToCart';
import { useCurrency } from '../hooks/useCurrency';
import { useWishlist } from '../hooks/useWishlist';
import { formatPrice } from '../../lib/currency';
import { formatProductRatingLabel } from '../../lib/product-rating';
import { WishlistIcon } from '../icons/WishlistIcon';
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
  /** Preload image for above-the-fold catalog cards. */
  imagePriority?: boolean;
}

function resolveComparePrice(product: HomeProductCardData): number | null {
  const candidates = [product.originalPrice, product.compareAtPrice];
  for (const value of candidates) {
    if (value != null && value > product.price) {
      return value;
    }
  }
  return null;
}

function buildCardCssVars(): CSSProperties {
  return {
    '--home-product-card-image-left-default': `${HOME_PRODUCT_CARD_IMAGE_LEFT_PX}px`,
    '--home-product-card-image-top-default': `${HOME_PRODUCT_CARD_IMAGE_TOP_PX}px`,
    '--home-product-card-image-width-default': `${HOME_PRODUCT_CARD_IMAGE_WIDTH_PX}px`,
    '--home-product-card-image-height-default': `${HOME_PRODUCT_CARD_IMAGE_HEIGHT_PX}px`,
    '--home-product-card-image-left-hover': `${HOME_PRODUCT_CARD_IMAGE_HOVER_LEFT_PX}px`,
    '--home-product-card-image-top-hover': `${HOME_PRODUCT_CARD_IMAGE_HOVER_TOP_PX}px`,
    '--home-product-card-image-width-hover': `${HOME_PRODUCT_CARD_IMAGE_HOVER_WIDTH_PX}px`,
    '--home-product-card-image-height-hover': `${HOME_PRODUCT_CARD_IMAGE_HOVER_HEIGHT_PX}px`,
    '--home-product-card-bg-default': HOME_PRODUCT_CARD_BG,
    '--home-product-card-bg-hover': HOME_PRODUCT_CARD_HOVER_BG,
    '--home-product-card-actions-gap-default': `${HOME_PRODUCT_CARD_ACTIONS_GAP_PX}px`,
    '--home-product-card-actions-gap-hover': `${HOME_PRODUCT_CARD_ACTIONS_HOVER_GAP_PX}px`,
    '--home-product-card-cart-size-default': `${HOME_PRODUCT_CARD_CART_SIZE_PX}px`,
    '--home-product-card-cart-size-hover': `${HOME_PRODUCT_CARD_CART_SIZE_HOVER_PX}px`,
    '--home-product-card-cart-icon-size-default': `${HOME_PRODUCT_CARD_CART_ICON_SIZE_PX}px`,
    '--home-product-card-cart-icon-size-hover': `${HOME_PRODUCT_CARD_CART_ICON_SIZE_HOVER_PX}px`,
    '--home-product-card-cart-icon-left-default': `${HOME_PRODUCT_CARD_CART_ICON_LEFT_PX}px`,
    '--home-product-card-cart-icon-top-default': `${HOME_PRODUCT_CARD_CART_ICON_TOP_PX}px`,
    '--home-product-card-cart-icon-left-hover': `${HOME_PRODUCT_CARD_CART_ICON_HOVER_LEFT_PX}px`,
    '--home-product-card-cart-icon-top-hover': `${HOME_PRODUCT_CARD_CART_ICON_HOVER_TOP_PX}px`,
    '--home-product-card-lift-hover': `${-HOME_PRODUCT_CARD_LIFT_PX}px`,
  } as CSSProperties;
}

function areHomeProductCardPropsEqual(
  prev: HomeProductCardProps,
  next: HomeProductCardProps
): boolean {
  if (
    prev.layoutWidthPx !== next.layoutWidthPx ||
    prev.layoutHeightPx !== next.layoutHeightPx ||
    prev.imagePriority !== next.imagePriority
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
  imagePriority = false,
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

  const handleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist();
  };

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const origin = event.currentTarget;
    addToCart({ origin, imageUrl: product.image });
  };

  const cardWidth = layoutWidthPx ?? HOME_PRODUCT_CARD_WIDTH_PX;
  const cardHeight = layoutHeightPx ?? HOME_PRODUCT_CARD_HEIGHT_PX;

  return (
    <article
      className="home-product-card relative shrink-0"
      style={{ width: cardWidth, height: cardHeight, ...buildCardCssVars() }}
    >
      <div
        className="home-product-card-surface relative h-full w-full overflow-visible"
        style={{ borderRadius: HOME_PRODUCT_CARD_RADIUS_PX }}
      >
        <Link
          href={`/products/${product.slug}`}
          className="home-product-card-image-wrap absolute overflow-hidden"
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
              sizes={`${HOME_PRODUCT_CARD_IMAGE_WIDTH_PX}px`}
              className="object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        </Link>

        <HomeProductCardSizeBadges sizes={product.sizes} />

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={isInWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute z-20 flex items-center justify-center transition-colors hover:opacity-80 ${
            isInWishlist ? 'text-red-600' : 'text-white'
          }`}
          style={{
            top: HOME_PRODUCT_CARD_HEART_TOP_PX,
            right: HOME_PRODUCT_CARD_HEART_RIGHT_PX,
            width: HOME_PRODUCT_CARD_HEART_SIZE_PX,
            height: HOME_PRODUCT_CARD_HEART_SIZE_PX,
          }}
        >
          <WishlistIcon isActive={isInWishlist} size={HOME_PRODUCT_CARD_HEART_SIZE_PX} />
        </button>

        <div
          className="absolute left-1/2 flex -translate-x-1/2 items-start justify-between bg-white"
          style={{
            top: HOME_PRODUCT_CARD_PANEL_TOP_PX,
            width: HOME_PRODUCT_CARD_PANEL_WIDTH_PX,
            height: HOME_PRODUCT_CARD_PANEL_HEIGHT_PX,
            borderRadius: HOME_PRODUCT_CARD_PANEL_RADIUS_PX,
            paddingTop: 23,
            paddingBottom: 9,
            paddingLeft: 18,
            paddingRight: 20,
          }}
        >
          <div
            className="flex min-w-0 flex-col"
            style={{ gap: 7, width: HOME_PRODUCT_CARD_PANEL_LEFT_COLUMN_WIDTH_PX }}
          >
            <div className="flex w-full flex-col" style={{ gap: 3 }}>
              <Link
                href={`/products/${product.slug}`}
                className="truncate font-bold"
                style={{
                  color: HOME_PRODUCT_CARD_TEXT_DARK,
                  fontSize: HOME_PRODUCT_CARD_TITLE_SIZE_PX,
                  lineHeight: '28px',
                }}
              >
                {product.title}
              </Link>
              <p
                className="truncate font-normal"
                style={{
                  color: HOME_PRODUCT_CARD_TEXT_MUTED,
                  fontSize: HOME_PRODUCT_CARD_SUBTITLE_SIZE_PX,
                  lineHeight: '28px',
                }}
              >
                {subtitle}
              </p>
              <HomeProductCardColorSwatches colors={product.colors} />
            </div>

            <div className="flex items-start whitespace-nowrap" style={{ gap: 16, lineHeight: '24px' }}>
              <p
                className="font-bold"
                style={{ color: HOME_PRODUCT_CARD_PRICE_COLOR, fontSize: HOME_PRODUCT_CARD_PRICE_SIZE_PX }}
              >
                {formatPrice(product.price, currency)}
              </p>
              {comparePrice != null ? (
                <p
                  className="font-normal line-through"
                  style={{
                    color: HOME_PRODUCT_CARD_COMPARE_COLOR,
                    fontSize: HOME_PRODUCT_CARD_COMPARE_SIZE_PX,
                  }}
                >
                  {formatPrice(comparePrice, currency)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="home-product-card-actions flex flex-col items-end justify-center" style={{ width: 100 }}>
            <div className="relative" style={{ width: 71, height: 20 }}>
              <Image
                src={HOME_PRODUCT_CARD_ASSETS.star}
                alt=""
                width={14}
                height={14}
                className="absolute top-0"
                style={{ left: -7 }}
              />
              <p
                className="absolute whitespace-nowrap font-normal"
                style={{
                  left: 11,
                  top: 0,
                  color: HOME_PRODUCT_CARD_RATING_COLOR,
                  fontSize: HOME_PRODUCT_CARD_RATING_SIZE_PX,
                  lineHeight: '20px',
                }}
              >
                {ratingLabel}
              </p>
            </div>

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
          </div>
        </div>
      </div>
    </article>
  );
}

/** Memoized catalog card — skips re-render when product display fields are unchanged. */
export const HomeProductCard = memo(HomeProductCardComponent, areHomeProductCardPropsEqual);
