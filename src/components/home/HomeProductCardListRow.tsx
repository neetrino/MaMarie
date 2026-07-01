'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import { memo, useState } from 'react';
import {
  HOME_PRODUCT_CARD_ASSETS,
  HOME_PRODUCT_CARD_BG,
  HOME_PRODUCT_CARD_CART_BG,
  HOME_PRODUCT_CARD_CART_ICON_SIZE_HOVER_PX,
  HOME_PRODUCT_CARD_COMPARE_COLOR,
  HOME_PRODUCT_CARD_HEART_SIZE_PX,
  HOME_PRODUCT_CARD_PRICE_COLOR,
  HOME_PRODUCT_CARD_RATING_COLOR,
  HOME_PRODUCT_CARD_TEXT_DARK,
  HOME_PRODUCT_CARD_TEXT_MUTED,
} from '../../constants/home-sections';
import {
  PRODUCTS_CATALOG_CARD_WIDTH_PX,
  PRODUCTS_CATALOG_LIST_IMAGE_WIDTH_PX,
  PRODUCTS_CATALOG_LIST_PANEL_PADDING_X_PX,
  PRODUCTS_CATALOG_LIST_PANEL_PADDING_Y_PX,
  PRODUCTS_CATALOG_LIST_ROW_HEIGHT_PX,
  PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX,
} from '../../constants/products-catalog';
import { formatPrice } from '../../lib/currency';
import { homeProductCardLayoutPx, resolveHomeProductCardTypography } from '../../lib/home-product-card-layout';
import { formatProductRatingLabel } from '../../lib/product-rating';
import { useAddToCart } from '../hooks/useAddToCart';
import { useCurrency } from '../hooks/useCurrency';
import { useWishlist } from '../hooks/useWishlist';
import { WishlistIcon } from '../icons/WishlistIcon';
import { buildHomeProductCardCssVars, resolveComparePrice } from './home-product-card-shared';
import type { HomeProductCardData } from './HomeProductCard';
import { HomeProductCardCartActions } from './HomeProductCardCartActions';
import { HomeProductCardColorSwatches } from './HomeProductCardColorSwatches';

interface HomeProductCardListRowProps {
  product: HomeProductCardData;
  imagePriority?: boolean;
}

function HomeProductCardListRowComponent({
  product,
  imagePriority = false,
}: HomeProductCardListRowProps) {
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

  const layoutWidthPx = PRODUCTS_CATALOG_CARD_WIDTH_PX;
  const lp = (value: number) => homeProductCardLayoutPx(value, layoutWidthPx);
  const typography = resolveHomeProductCardTypography(layoutWidthPx, false);
  const imageSrc =
    product.image && !imageError ? product.image : HOME_PRODUCT_CARD_ASSETS.placeholderImage;
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

  return (
    <article
      className="home-product-card w-full shrink-0 overflow-visible"
      style={{
        height: PRODUCTS_CATALOG_LIST_ROW_HEIGHT_PX,
        borderRadius: PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX,
        ...buildHomeProductCardCssVars(layoutWidthPx),
      }}
    >
      <div className="flex h-full w-full overflow-hidden" style={{ borderRadius: PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX }}>
        <div
          className="relative shrink-0"
          style={{
            width: PRODUCTS_CATALOG_LIST_IMAGE_WIDTH_PX,
            backgroundColor: HOME_PRODUCT_CARD_BG,
          }}
        >
          <Link
            href={`/products/${product.slug}`}
            className="relative block h-full w-full overflow-hidden"
          >
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              priority={imagePriority}
              loading={imagePriority ? 'eager' : 'lazy'}
              sizes={`${PRODUCTS_CATALOG_LIST_IMAGE_WIDTH_PX}px`}
              className="object-contain"
              onError={() => setImageError(true)}
            />
          </Link>

          <button
            type="button"
            onClick={handleWishlist}
            aria-pressed={isInWishlist}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute z-20 flex items-center justify-center transition-colors hover:opacity-80 ${
              isInWishlist ? 'text-red-600' : 'text-white'
            }`}
            style={{
              top: lp(12),
              right: lp(12),
              width: lp(HOME_PRODUCT_CARD_HEART_SIZE_PX),
              height: lp(HOME_PRODUCT_CARD_HEART_SIZE_PX),
            }}
          >
            <WishlistIcon isActive={isInWishlist} size={lp(HOME_PRODUCT_CARD_HEART_SIZE_PX)} />
          </button>
        </div>

        <div
          className="flex h-full min-w-0 flex-1 items-stretch justify-between bg-white"
          style={{
            paddingLeft: PRODUCTS_CATALOG_LIST_PANEL_PADDING_X_PX,
            paddingRight: PRODUCTS_CATALOG_LIST_PANEL_PADDING_X_PX,
            paddingTop: PRODUCTS_CATALOG_LIST_PANEL_PADDING_Y_PX,
            paddingBottom: PRODUCTS_CATALOG_LIST_PANEL_PADDING_Y_PX,
            gap: lp(12),
          }}
        >
          <div className="flex min-w-0 flex-1 flex-col" style={{ gap: lp(3) }}>
            <div className="flex items-center justify-between" style={{ gap: lp(8) }}>
              <Link
                href={`/products/${product.slug}`}
                className="min-w-0 flex-1 truncate font-bold"
                style={{
                  color: HOME_PRODUCT_CARD_TEXT_DARK,
                  fontSize: typography.titleSizePx,
                  lineHeight: `${typography.titleLineHeightPx}px`,
                }}
              >
                {product.title}
              </Link>

              <div
                className="relative shrink-0"
                style={{ width: lp(71), height: typography.ratingLineHeightPx }}
              >
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
            </div>

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

            <HomeProductCardColorSwatches
              colors={product.colors}
              layoutWidthPx={layoutWidthPx}
              maxVisible={typography.colorSwatchMaxVisible}
            />
          </div>

          <div className="flex shrink-0 flex-col items-end justify-end" style={{ gap: lp(8) }}>
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

            <HomeProductCardCartActions
              cartButton={cartButton}
              ratingLineHeightPx={typography.ratingLineHeightPx}
              actionsWidthPx={lp(100)}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export const HomeProductCardListRow = memo(HomeProductCardListRowComponent);
