import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import {
  MOBILE_PRODUCTS_CATALOG_CARD_ASSETS,
  MOBILE_PRODUCTS_CATALOG_CARD_HEART_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_HEART_RIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_HEART_TOP_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_HEART_WIDTH_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_FRAME_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_FRAME_LEFT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_FRAME_RADIUS_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_FRAME_TOP_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_FRAME_WIDTH_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_INNER_HEIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_INNER_LEFT_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_INNER_TOP_PX,
  MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_INNER_WIDTH_PX,
} from '../../constants/mobile-products-catalog';
import { mobileProductsCatalogCardLayoutPx } from '../../lib/mobile-products-catalog-card-layout';
import { WishlistIcon } from '../icons/WishlistIcon';

interface MobileProductsCatalogProductCardMediaProps {
  slug: string;
  title: string;
  imageSrc: string;
  imagePriority: boolean;
  layoutWidthPx: number;
  isInWishlist: boolean;
  onWishlistToggle: (event: MouseEvent<HTMLButtonElement>) => void;
  onBeforeNavigate?: () => void;
}

/** Figma `167:619` — product photo frame and wishlist control. */
export function MobileProductsCatalogProductCardMedia({
  slug,
  title,
  imageSrc,
  imagePriority,
  layoutWidthPx,
  isInWishlist,
  onWishlistToggle,
  onBeforeNavigate,
}: MobileProductsCatalogProductCardMediaProps) {
  const [imageError, setImageError] = useState(false);
  const lp = (value: number) => mobileProductsCatalogCardLayoutPx(value, layoutWidthPx);
  const resolvedImageSrc =
    imageSrc && !imageError ? imageSrc : MOBILE_PRODUCTS_CATALOG_CARD_ASSETS.placeholderImage;

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_FRAME_LEFT_PX),
        top: lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_FRAME_TOP_PX),
        width: lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_FRAME_WIDTH_PX),
        height: lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_FRAME_HEIGHT_PX),
        borderRadius: lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_FRAME_RADIUS_PX),
      }}
    >
      <Link
        href={`/products/${slug}`}
        className="absolute overflow-hidden"
        onFocus={onBeforeNavigate}
        onPointerDown={onBeforeNavigate}
        style={{
          left: lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_INNER_LEFT_PX),
          top: lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_INNER_TOP_PX),
          width: lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_INNER_WIDTH_PX),
          height: lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_INNER_HEIGHT_PX),
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
            src={resolvedImageSrc}
            alt={title}
            fill
            priority={imagePriority}
            loading={imagePriority ? 'eager' : 'lazy'}
            sizes={`${lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_INNER_WIDTH_PX)}px`}
            className="object-contain"
            onError={() => setImageError(true)}
          />
        </div>
      </Link>

      <button
        type="button"
        onClick={onWishlistToggle}
        aria-pressed={isInWishlist}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute z-10 flex items-center justify-center transition-opacity hover:opacity-80 ${
          isInWishlist ? 'text-brand-pink' : ''
        }`}
        style={{
          top: lp(MOBILE_PRODUCTS_CATALOG_CARD_HEART_TOP_PX),
          right: lp(MOBILE_PRODUCTS_CATALOG_CARD_HEART_RIGHT_PX),
          width: lp(MOBILE_PRODUCTS_CATALOG_CARD_HEART_WIDTH_PX),
          height: lp(MOBILE_PRODUCTS_CATALOG_CARD_HEART_HEIGHT_PX),
        }}
      >
        <WishlistIcon
          isActive={isInWishlist}
          size={lp(MOBILE_PRODUCTS_CATALOG_CARD_HEART_WIDTH_PX)}
        />
      </button>
    </div>
  );
}
