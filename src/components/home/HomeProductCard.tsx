'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import {
  HOME_PRODUCT_CARD_ASSETS,
  HOME_PRODUCT_CARD_BG,
  HOME_PRODUCT_CARD_CART_BG,
  HOME_PRODUCT_CARD_CART_ICON_SIZE_PX,
  HOME_PRODUCT_CARD_CART_SIZE_PX,
  HOME_PRODUCT_CARD_COMPARE_COLOR,
  HOME_PRODUCT_CARD_COMPARE_SIZE_PX,
  HOME_PRODUCT_CARD_HEIGHT_PX,
  HOME_PRODUCT_CARD_HEART_RIGHT_PX,
  HOME_PRODUCT_CARD_HEART_SIZE_PX,
  HOME_PRODUCT_CARD_HEART_TOP_PX,
  HOME_PRODUCT_CARD_IMAGE_HEIGHT_PX,
  HOME_PRODUCT_CARD_IMAGE_LEFT_PX,
  HOME_PRODUCT_CARD_IMAGE_TOP_PX,
  HOME_PRODUCT_CARD_IMAGE_WIDTH_PX,
  HOME_PRODUCT_CARD_PANEL_HEIGHT_PX,
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
import { useAuth } from '../../lib/auth/AuthContext';
import { formatPrice } from '../../lib/currency';

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
}

interface HomeProductCardProps {
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

export function HomeProductCard({ product }: HomeProductCardProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const currency = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist(product.id);
  const { isAddingToCart, addToCart } = useAddToCart({
    productId: product.id,
    productSlug: product.slug,
    inStock: product.inStock,
    defaultVariantId: product.defaultVariantId ?? undefined,
    price: product.price,
  });
  const [imageError, setImageError] = useState(false);

  const imageSrc =
    product.image && !imageError ? product.image : HOME_PRODUCT_CARD_ASSETS.placeholderImage;
  const comparePrice = resolveComparePrice(product);
  const subtitle = product.subtitle?.trim() || product.title;
  const isPlaceholder = product.id.startsWith('best-products-placeholder');

  const handleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isPlaceholder) {
      return;
    }
    if (!isLoggedIn) {
      router.push('/login?redirect=/');
      return;
    }
    toggleWishlist();
  };

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isPlaceholder) {
      return;
    }
    const origin = event.currentTarget;
    addToCart({ origin, imageUrl: product.image });
  };

  return (
    <article
      className="relative shrink-0"
      style={{ width: HOME_PRODUCT_CARD_WIDTH_PX, height: HOME_PRODUCT_CARD_HEIGHT_PX }}
    >
      <div
        className="relative h-full w-full overflow-visible"
        style={{ borderRadius: HOME_PRODUCT_CARD_RADIUS_PX, backgroundColor: HOME_PRODUCT_CARD_BG }}
      >
        <Link
          href={isPlaceholder ? '/products' : `/products/${product.slug}`}
          className="absolute overflow-hidden"
          style={{
            left: HOME_PRODUCT_CARD_IMAGE_LEFT_PX,
            top: HOME_PRODUCT_CARD_IMAGE_TOP_PX,
            width: HOME_PRODUCT_CARD_IMAGE_WIDTH_PX,
            height: HOME_PRODUCT_CARD_IMAGE_HEIGHT_PX,
          }}
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
              sizes={`${HOME_PRODUCT_CARD_IMAGE_WIDTH_PX}px`}
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={isInWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute z-20 transition-opacity hover:opacity-80"
          style={{
            top: HOME_PRODUCT_CARD_HEART_TOP_PX,
            right: HOME_PRODUCT_CARD_HEART_RIGHT_PX,
            width: HOME_PRODUCT_CARD_HEART_SIZE_PX,
            height: HOME_PRODUCT_CARD_HEART_SIZE_PX,
          }}
        >
          <Image
            src={HOME_PRODUCT_CARD_ASSETS.heart}
            alt=""
            width={HOME_PRODUCT_CARD_HEART_SIZE_PX}
            height={HOME_PRODUCT_CARD_HEART_SIZE_PX}
            className={isInWishlist ? 'opacity-100' : 'opacity-90'}
          />
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
          <div className="flex min-w-0 flex-col" style={{ gap: 16, width: 100 }}>
            <div className="flex flex-col">
              <Link
                href={isPlaceholder ? '/products' : `/products/${product.slug}`}
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

          <div className="flex flex-col items-end justify-center" style={{ gap: 21, width: 100 }}>
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
                4.7 (210)
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isPlaceholder || !product.inStock || isAddingToCart}
              aria-label="Add to cart"
              className="relative shrink-0 rounded-full transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                width: HOME_PRODUCT_CARD_CART_SIZE_PX,
                height: HOME_PRODUCT_CARD_CART_SIZE_PX,
                backgroundColor: HOME_PRODUCT_CARD_CART_BG,
              }}
            >
              <Image
                src={HOME_PRODUCT_CARD_ASSETS.cart}
                alt=""
                width={HOME_PRODUCT_CARD_CART_ICON_SIZE_PX}
                height={HOME_PRODUCT_CARD_CART_ICON_SIZE_PX}
                className="absolute"
                style={{ left: 11, top: 12 }}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
