"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { ProductLabels } from "../../../components/ProductLabels";
import { ProductImagePlaceholder } from "../../../components/ProductImagePlaceholder";
import { t } from "../../../lib/i18n";
import type { LanguageCode } from "../../../lib/language";
import type { Product } from "./types";
import {
  PRODUCT_PDP_THUMBNAIL_FRAME_ACTIVE_CLASS,
  PRODUCT_PDP_THUMBNAIL_FRAME_BASE_CLASS,
  PRODUCT_PDP_THUMBNAIL_FRAME_INACTIVE_CLASS,
  PRODUCT_PDP_THUMBNAIL_LIST_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_LEFT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_RIGHT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS,
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
      <div className="flex gap-6 items-start">
        <div className="flex w-28 flex-shrink-0 flex-col">
          <div className={PRODUCT_PDP_THUMBNAIL_LIST_CLASS}>
            {images.map((image, index) => {
              const isActive = index === currentImageIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onImageIndexChange(index)}
                  className={`${PRODUCT_PDP_THUMBNAIL_FRAME_BASE_CLASS} ${
                    isActive
                      ? PRODUCT_PDP_THUMBNAIL_FRAME_ACTIVE_CLASS
                      : PRODUCT_PDP_THUMBNAIL_FRAME_INACTIVE_CLASS
                  }`}
                >
                  {failedIndices.has(index) ? (
                    <ProductImagePlaceholder className="w-full h-full" aria-label="" />
                  ) : (
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-contain transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                      onError={() => markFailed(index)}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <div
            data-product-fly-origin
            className="relative aspect-square rounded-lg overflow-hidden group shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          >
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
                className="w-full h-full"
                aria-label={t(language, "common.messages.noImage")}
              />
            )}

            {discountPercent ? (
              <div className="absolute top-4 right-4 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold z-10 shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
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

            <div className="absolute bottom-4 left-4 flex flex-col gap-3 z-10">
              <button
                type="button"
                onClick={() => setShowZoom(true)}
                className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-white/90 transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                aria-label={t(language, 'common.ariaLabels.fullscreenImage')}
              >
                <Maximize2 className="w-5 h-5 text-gray-800" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showZoom && images.length > 0 && !failedIndices.has(currentImageIndex) ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <img src={currentSrc} alt="" className="max-w-full max-h-full object-contain" />
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-2xl"
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
