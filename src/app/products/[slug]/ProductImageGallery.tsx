"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { ProductLabels } from "../../../components/ProductLabels";
import { ProductImagePlaceholder } from "../../../components/ProductImagePlaceholder";
import { t } from "../../../lib/i18n";
import type { LanguageCode } from "../../../lib/language";
import type { Product } from "./types";
import {
  PRODUCT_PDP_GALLERY_LAYOUT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_FRAME_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_LEFT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_RIGHT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_WRAPPER_CLASS,
  PRODUCT_PDP_THUMBNAIL_FRAME_ACTIVE_CLASS,
  PRODUCT_PDP_THUMBNAIL_FRAME_BASE_CLASS,
  PRODUCT_PDP_THUMBNAIL_FRAME_INACTIVE_CLASS,
  PRODUCT_PDP_THUMBNAIL_FRAME_SIZE_CLASS,
  PRODUCT_PDP_THUMBNAIL_LIST_MOBILE_CLASS,
  PRODUCT_PDP_THUMBNAIL_RAIL_WRAPPER_CLASS,
} from "./constants";

interface ProductImageGalleryProps {
  images: string[];
  product: Product;
  discountPercent: number | null;
  language: LanguageCode;
  currentImageIndex: number;
  onImageIndexChange: (index: number) => void;
  /** LCP: prioritize only the first above-the-fold hero image. */
  mainImagePriority?: boolean;
}

const PDP_MAIN_IMAGE_SIZES = "(max-width: 1024px) 100vw, 55vw";

interface ProductThumbnailRailProps {
  images: string[];
  currentImageIndex: number;
  failedIndices: Set<number>;
  onImageIndexChange: (index: number) => void;
  onImageError: (index: number) => void;
}

function ProductThumbnailRail({
  images,
  currentImageIndex,
  failedIndices,
  onImageIndexChange,
  onImageError,
}: ProductThumbnailRailProps) {
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      return;
    }

    activeThumbRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, [currentImageIndex]);

  return (
    <div className={PRODUCT_PDP_THUMBNAIL_RAIL_WRAPPER_CLASS}>
      <div className={PRODUCT_PDP_THUMBNAIL_LIST_MOBILE_CLASS}>
        {images.map((image, index) => {
          const isActive = index === currentImageIndex;
          return (
            <button
              key={index}
              ref={isActive ? activeThumbRef : undefined}
              type="button"
              onClick={() => onImageIndexChange(index)}
              className={`${PRODUCT_PDP_THUMBNAIL_FRAME_BASE_CLASS} ${PRODUCT_PDP_THUMBNAIL_FRAME_SIZE_CLASS} ${
                isActive
                  ? PRODUCT_PDP_THUMBNAIL_FRAME_ACTIVE_CLASS
                  : PRODUCT_PDP_THUMBNAIL_FRAME_INACTIVE_CLASS
              }`}
            >
              {failedIndices.has(index) ? (
                <ProductImagePlaceholder className="h-full w-full" aria-label="" />
              ) : (
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-contain transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                  onError={() => onImageError(index)}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ProductImageGallery({
  images,
  product,
  discountPercent,
  language,
  currentImageIndex,
  onImageIndexChange,
  mainImagePriority = false,
}: ProductImageGalleryProps) {
  const [showZoom, setShowZoom] = useState(false);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  const markFailed = (index: number) => {
    setFailedIndices((prev) => new Set(prev).add(index));
  };

  const mainImageFailed = failedIndices.has(currentImageIndex);
  const currentSrc = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  const showPreviousImage = () => {
    onImageIndexChange((currentImageIndex - 1 + images.length) % images.length);
  };

  const showNextImage = () => {
    onImageIndexChange((currentImageIndex + 1) % images.length);
  };

  return (
    <>
      <div className={PRODUCT_PDP_GALLERY_LAYOUT_CLASS}>
        <div className={PRODUCT_PDP_MAIN_IMAGE_WRAPPER_CLASS}>
          <div data-product-fly-origin className={PRODUCT_PDP_MAIN_IMAGE_FRAME_CLASS}>
            {images.length > 0 && !mainImageFailed ? (
              <Image
                src={currentSrc}
                alt={product.title}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                sizes={PDP_MAIN_IMAGE_SIZES}
                priority={mainImagePriority}
                unoptimized
                onError={() => markFailed(currentImageIndex)}
              />
            ) : (
              <ProductImagePlaceholder
                className="h-full w-full"
                aria-label={t(language, "common.messages.noImage")}
              />
            )}

            {discountPercent ? (
              <div className="absolute top-4 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
                -{discountPercent}%
              </div>
            ) : null}

            {product.labels ? <ProductLabels labels={product.labels} /> : null}

            {hasMultipleImages ? (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className={`${PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS} ${PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_LEFT_CLASS}`}
                  aria-label={t(language, 'common.ariaLabels.previousImage')}
                >
                  <ChevronLeft aria-hidden className={PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS} />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className={`${PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS} ${PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_RIGHT_CLASS}`}
                  aria-label={t(language, 'common.ariaLabels.nextImage')}
                >
                  <ChevronRight aria-hidden className={PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS} />
                </button>
              </>
            ) : null}

            <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setShowZoom(true)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                aria-label={t(language, 'common.ariaLabels.fullscreenImage')}
              >
                <Maximize2 className="h-5 w-5 text-gray-800" />
              </button>
            </div>
          </div>
        </div>

        {hasMultipleImages ? (
          <ProductThumbnailRail
            images={images}
            currentImageIndex={currentImageIndex}
            failedIndices={failedIndices}
            onImageIndexChange={onImageIndexChange}
            onImageError={markFailed}
          />
        ) : null}
      </div>

      {showZoom && images.length > 0 && !failedIndices.has(currentImageIndex) ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setShowZoom(false)}
        >
          <img src={currentSrc} alt="" className="max-h-full max-w-full object-contain" />
          <button
            type="button"
            className="absolute top-4 right-4 text-2xl text-white"
            aria-label={t(language, 'common.buttons.close')}
            onClick={(e) => {
              e.stopPropagation();
              setShowZoom(false);
            }}
          >
            {t(language, 'common.buttons.close')}
          </button>
        </div>
      ) : null}
    </>
  );
}
