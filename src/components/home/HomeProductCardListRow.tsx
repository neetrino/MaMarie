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
  PRODUCTS_CATALOG_LIST_HEART_RIGHT_PX,
  PRODUCTS_CATALOG_LIST_HEART_TOP_PX,
  PRODUCTS_CATALOG_LIST_PANEL_PADDING_X_PX,
  PRODUCTS_CATALOG_LIST_PANEL_PADDING_Y_PX,
  PRODUCTS_CATALOG_LIST_PRICE_TO_ACTIONS_GAP_PX,
  PRODUCTS_CATALOG_LIST_RATING_STAR_TEXT_GAP_PX,
  PRODUCTS_CATALOG_LIST_RATING_TO_CART_GAP_PX,
  PRODUCTS_CATALOG_LIST_ROW_BORDER_WIDTH_PX,
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

  const ratingRow = (
    <div
      className="flex items-center justify-end whitespace-nowrap"
      style={{
        height: typography.ratingLineHeightPx,
        gap: lp(PRODUCTS_CATALOG_LIST_RATING_STAR_TEXT_GAP_PX),
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
  );

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

  return (
    <article
      className="home-product-card w-full shrink-0 overflow-visible"
      style={{
        height: PRODUCTS_CATALOG_LIST_ROW_HEIGHT_PX,
        borderRadius: PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX,
        ...buildHomeProductCardCssVars(layoutWidthPx),
      }}
    >
      <div
        className="flex h-full w-full overflow-hidden border-solid"
        style={{
          borderRadius: PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX,
          borderWidth: PRODUCTS_CATALOG_LIST_ROW_BORDER_WIDTH_PX,
          borderColor: HOME_PRODUCT_CARD_BG,
        }}
      >
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            width: PRODUCTS_CATALOG_LIST_IMAGE_WIDTH_PX,
            backgroundColor: HOME_PRODUCT_CARD_BG,
            borderRadius: PRODUCTS_CATALOG_LIST_ROW_RADIUS_PX,
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
              top: lp(PRODUCTS_CATALOG_LIST_HEART_TOP_PX),
              right: lp(PRODUCTS_CATALOG_LIST_HEART_RIGHT_PX),
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
            <Link
              href={`/products/${product.slug}`}
              className="truncate font-bold"
              style={{
                color: HOME_PRODUCT_CARD_TEXT_DARK,
                fontSize: typography.titleSizePx,
                lineHeight: `${typography.titleLineHeightPx}px`,
              }}
            >
              {product.title}
            </Link>

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

          <div
            className="flex h-full shrink-0 items-center"
            style={{ gap: lp(PRODUCTS_CATALOG_LIST_PRICE_TO_ACTIONS_GAP_PX) }}
          >
            {priceRow}
            <div
              className="flex shrink-0 flex-col items-end"
              style={{ gap: lp(PRODUCTS_CATALOG_LIST_RATING_TO_CART_GAP_PX) }}
            >
              {ratingRow}
              {cartButton}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export const HomeProductCardListRow = memo(HomeProductCardListRowComponent);
