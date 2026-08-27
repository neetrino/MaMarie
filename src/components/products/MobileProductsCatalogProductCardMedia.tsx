'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import {
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
import { ProductImagePlaceholder } from '../ProductImagePlaceholder';
import { HomeProductCardImageGallery } from '../home/HomeProductCardImageGallery';

interface MobileProductsCatalogProductCardMediaProps {
  slug: string;
  productHref: string;
  title: string;
  imageSrc: string | null;
  images?: string[];
  imagePriority: boolean;
  layoutWidthPx: number;
  isInWishlist: boolean;
  onWishlistToggle: (event: MouseEvent<HTMLButtonElement>) => void;
  onBeforeNavigate?: () => void;
}

/** Figma `167:619` — product photo frame and wishlist control. */
export function MobileProductsCatalogProductCardMedia({
  slug,
  productHref,
  title,
  imageSrc,
  images,
  imagePriority,
  layoutWidthPx,
  isInWishlist,
  onWishlistToggle,
  onBeforeNavigate,
}: MobileProductsCatalogProductCardMediaProps) {
  const galleryImages =
    images && images.length > 0 ? images : imageSrc ? [imageSrc] : [];
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setGalleryIndex(0);
    setImageError(false);
  }, [slug, galleryImages.join('|')]);

  const activeImage =
    galleryImages[Math.min(galleryIndex, Math.max(galleryImages.length - 1, 0))] ?? null;
  const showProductImage = Boolean(activeImage) && !imageError;
  const hasMultipleImages = galleryImages.length > 1;
  const lp = (value: number) => mobileProductsCatalogCardLayoutPx(value, layoutWidthPx);

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
        href={productHref}
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
          {showProductImage && activeImage ? (
            <Image
              src={activeImage}
              alt={title}
              fill
              priority={imagePriority}
              loading={imagePriority ? 'eager' : 'lazy'}
              sizes={`${lp(MOBILE_PRODUCTS_CATALOG_CARD_IMAGE_INNER_WIDTH_PX)}px`}
              className="object-contain"
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <ProductImagePlaceholder className="h-full w-full" aria-label={title} />
          )}
        </div>
      </Link>

      {hasMultipleImages ? (
        <div className="pointer-events-auto absolute inset-0 z-10">
          <HomeProductCardImageGallery
            images={galleryImages}
            activeIndex={galleryIndex}
            onIndexChange={(next) => {
              setGalleryIndex(next);
              setImageError(false);
            }}
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={onWishlistToggle}
        aria-pressed={isInWishlist}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute z-20 flex items-center justify-center transition-opacity hover:opacity-80 ${
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
