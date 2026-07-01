'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import {
  MOBILE_HOME_ASSETS,
  MOBILE_HOME_PRODUCT_CARD_HEIGHT_PX,
  MOBILE_HOME_PRODUCT_CARD_RADIUS_PX,
  MOBILE_HOME_PRODUCT_CARD_WIDTH_PX,
} from '../../../constants/mobile-home';
import { useAddToCart } from '../../hooks/useAddToCart';
import { useCurrency } from '../../hooks/useCurrency';
import { useTranslation } from '../../../lib/i18n-client';
import { useWishlist } from '../../hooks/useWishlist';
import { formatPrice } from '../../../lib/currency';
import { formatProductRatingLabel } from '../../../lib/product-rating';
import { WishlistIcon } from '../../icons/WishlistIcon';
import type { HomeProductCardData } from '../HomeProductCard';

interface MobileHomeProductCardProps {
  product: HomeProductCardData;
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

export function MobileHomeProductCard({ product }: MobileHomeProductCardProps) {
  const { t } = useTranslation();
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
    product.image && !imageError ? product.image : MOBILE_HOME_ASSETS.placeholderImage;
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
    event.currentTarget.blur();
  };

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart({ origin: event.currentTarget, imageUrl: product.image });
  };

  return (
    <article
      className="relative shrink-0 snap-start bg-white"
      style={{
        width: MOBILE_HOME_PRODUCT_CARD_WIDTH_PX,
        height: MOBILE_HOME_PRODUCT_CARD_HEIGHT_PX,
        borderRadius: MOBILE_HOME_PRODUCT_CARD_RADIUS_PX,
      }}
    >
      <div className="relative h-[162px] overflow-hidden rounded-[25px]">
        <Link href={`/products/${product.slug}`} className="block h-full">
          <Image
            src={imageSrc}
            alt={product.title}
            width={174}
            height={134}
            className="mx-auto mt-7 object-contain"
            onError={() => setImageError(true)}
          />
        </Link>

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={isInWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 z-10 flex h-[30px] w-[30px] items-center justify-center transition-colors ${
            isInWishlist ? 'text-red-600' : 'text-white'
          }`}
        >
          <WishlistIcon isActive={isInWishlist} size={30} />
        </button>
      </div>

      <div className="px-2 pt-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="min-w-0 truncate text-base font-medium leading-7 text-[#1d1c16]"
          >
            {product.title}
          </Link>
          <p className="shrink-0 text-lg font-bold leading-6 text-black">
            {formatPrice(product.price, currency)}
          </p>
        </div>

        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm leading-7 text-[rgba(29,28,22,0.61)]">{subtitle}</p>
          {comparePrice != null ? (
            <p className="shrink-0 text-xs font-light leading-6 text-[#4d4d4d] line-through">
              {formatPrice(comparePrice, currency)}
            </p>
          ) : null}
        </div>

        <div className="relative mt-1 h-5 w-[71px]">
          <Image
            src={MOBILE_HOME_ASSETS.star}
            alt=""
            width={14}
            height={14}
            className="absolute left-0 top-0.5"
          />
          <span className="absolute left-[17px] top-0 text-[13.75px] leading-5 text-[#757571]">
            {ratingLabel}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!product.inStock || isAddingToCart}
        className="absolute bottom-3 left-1.5 flex w-[169px] items-center justify-between rounded-full bg-brand-pink py-1.5 pl-5 pr-2.5 text-center text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{t('home.mobile.addToCart')}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Image src={MOBILE_HOME_ASSETS.chevronCta} alt="" width={20} height={20} />
        </span>
      </button>
    </article>
  );
}
