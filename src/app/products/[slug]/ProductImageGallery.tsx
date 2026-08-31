'use client';

import NextImage from 'next/image';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ProductLabels } from '../../../components/ProductLabels';
import { ProductImagePlaceholder } from '../../../components/ProductImagePlaceholder';
import { WishlistIcon } from '../../../components/icons/WishlistIcon';
import { t } from '../../../lib/i18n';
import type { LanguageCode } from '../../../lib/language';
import { readProductPageSnapshot } from '../../../lib/product-page-snapshot';
import {
  DEFAULT_IMAGE_ASPECT_RATIO,
  resolveImageAspectRatio,
} from '../../../lib/resolve-image-aspect-ratio';
import { resolveContainedFrameSizePx } from '../../../lib/resolve-contained-frame-size';
import type { Product } from './types';
import {
  PRODUCT_PDP_GALLERY_LAYOUT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_FRAME_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_MAX_HEIGHT_PX,
  PRODUCT_PDP_MAIN_IMAGE_MAX_WIDTH_PX,
  PRODUCT_PDP_MAIN_IMAGE_MOBILE_MAX_HEIGHT_PX,
  PRODUCT_PDP_MAIN_IMAGE_MOBILE_MAX_WIDTH_PX,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_LEFT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_RIGHT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_WRAPPER_CLASS,
  PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_INSET_PX,
  PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_SIZE_PX,
  PRODUCT_PDP_MOBILE_WISHLIST_ICON_SIZE_PX,
  PRODUCT_PDP_MAIN_IMAGE_SIZES,
  PRODUCT_PDP_THUMBNAIL_MIN_IMAGE_COUNT,
} from './constants';
import { ProductImageZoomOverlay } from './ProductImageZoomOverlay';
import { ProductMainImageCarousel } from './ProductMainImageCarousel';
import { ProductThumbnailRail } from './ProductThumbnailRail';

interface ProductImageGalleryProps {
  images: string[];
  product: Product;
  discountPercent: number | null;
  language: LanguageCode;
  currentImageIndex: number;
  onImageIndexChange: (index: number) => void;
  /** LCP: prioritize only the first above-the-fold hero image. */
  mainImagePriority?: boolean;
  isInWishlist: boolean;
  onAddToWishlist: (e: MouseEvent) => void;
}

export function ProductImageGallery({
  images,
  product,
  discountPercent,
  language,
  currentImageIndex,
  onImageIndexChange,
  mainImagePriority = false,
  isInWishlist,
  onAddToWishlist,
}: ProductImageGalleryProps) {
  const mainFrameRef = useRef<HTMLDivElement>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [failedSources, setFailedSources] = useState<Set<string>>(new Set());
  const [snapshotSrc, setSnapshotSrc] = useState<string | undefined>(() => images[currentImageIndex]);
  const [mainImageHeightPx, setMainImageHeightPx] = useState<number | null>(null);
  const [aspectBySrc, setAspectBySrc] = useState<Record<string, number>>({});
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  const markFailed = (src: string | undefined) => {
    if (!src) {
      return;
    }
    setFailedSources((prev) => new Set(prev).add(src));
  };

  const rememberAspectRatio = (src: string, naturalWidth: number, naturalHeight: number) => {
    const nextRatio = resolveImageAspectRatio(naturalWidth, naturalHeight);
    setAspectBySrc((prev) => {
      if (prev[src] === nextRatio) {
        return prev;
      }
      return { ...prev, [src]: nextRatio };
    });
  };

  const currentSrc = images[currentImageIndex];
  const renderedSrc = currentSrc ?? snapshotSrc;
  const mainImageFailed = currentSrc ? failedSources.has(currentSrc) : false;
  const snapshotFailed = snapshotSrc ? failedSources.has(snapshotSrc) : false;
  const canShowSnapshot = Boolean(snapshotSrc && !snapshotFailed);
  const canShowMainImage = Boolean(currentSrc && !mainImageFailed);
  const hasMultipleImages = images.length >= PRODUCT_PDP_THUMBNAIL_MIN_IMAGE_COUNT;
  const imageAspectRatio =
    (currentSrc ? aspectBySrc[currentSrc] : undefined) ??
    (snapshotSrc ? aspectBySrc[snapshotSrc] : undefined) ??
    DEFAULT_IMAGE_ASPECT_RATIO;
  const frameSize = resolveContainedFrameSizePx(
    imageAspectRatio,
    isDesktopViewport
      ? PRODUCT_PDP_MAIN_IMAGE_MAX_WIDTH_PX
      : PRODUCT_PDP_MAIN_IMAGE_MOBILE_MAX_WIDTH_PX,
    isDesktopViewport
      ? PRODUCT_PDP_MAIN_IMAGE_MAX_HEIGHT_PX
      : PRODUCT_PDP_MAIN_IMAGE_MOBILE_MAX_HEIGHT_PX,
  );

  useEffect(() => {
    const entrySnapshot = readProductPageSnapshot(product.slug);
    if (entrySnapshot?.imageUrl) {
      setSnapshotSrc(entrySnapshot.imageUrl);
    }
  }, [product.slug]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const syncViewport = () => {
      setIsDesktopViewport(desktopQuery.matches);
    };
    syncViewport();
    desktopQuery.addEventListener('change', syncViewport);
    return () => desktopQuery.removeEventListener('change', syncViewport);
  }, []);

  useEffect(() => {
    const frame = mainFrameRef.current;
    if (!frame || !hasMultipleImages) {
      setMainImageHeightPx(null);
      return;
    }

    const desktopQuery = window.matchMedia('(min-width: 1024px)');

    const syncHeight = () => {
      if (!desktopQuery.matches) {
        setMainImageHeightPx(null);
        return;
      }
      const nextHeight = Math.round(frame.getBoundingClientRect().height);
      setMainImageHeightPx(nextHeight > 0 ? nextHeight : null);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(frame);
    desktopQuery.addEventListener('change', syncHeight);
    return () => {
      observer.disconnect();
      desktopQuery.removeEventListener('change', syncHeight);
    };
  }, [hasMultipleImages, imageAspectRatio]);

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
          <div
            ref={mainFrameRef}
            data-product-fly-origin
            className={PRODUCT_PDP_MAIN_IMAGE_FRAME_CLASS}
            style={{
              width: frameSize.widthPx,
              height: frameSize.heightPx,
              aspectRatio: String(imageAspectRatio),
            }}
          >
            {hasMultipleImages ? (
              <ProductMainImageCarousel
                images={images}
                alt={product.title}
                currentImageIndex={currentImageIndex}
                failedSources={failedSources}
                mainImagePriority={mainImagePriority}
                onImageIndexChange={onImageIndexChange}
                onImageError={markFailed}
                onImageLoad={(src, naturalWidth, naturalHeight) => {
                  setSnapshotSrc(src);
                  rememberAspectRatio(src, naturalWidth, naturalHeight);
                }}
              />
            ) : canShowMainImage || canShowSnapshot ? (
              <>
                {snapshotSrc && snapshotSrc !== currentSrc && !snapshotFailed ? (
                  <img
                    src={snapshotSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain"
                    aria-hidden
                    decoding="async"
                    onLoad={(event) => {
                      rememberAspectRatio(
                        snapshotSrc,
                        event.currentTarget.naturalWidth,
                        event.currentTarget.naturalHeight,
                      );
                    }}
                  />
                ) : null}
                {currentSrc && !mainImageFailed ? (
                  <NextImage
                    src={currentSrc}
                    alt={product.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    sizes={PRODUCT_PDP_MAIN_IMAGE_SIZES}
                    loading={mainImagePriority ? 'eager' : 'lazy'}
                    unoptimized
                    onLoad={(event) => {
                      setSnapshotSrc(currentSrc);
                      rememberAspectRatio(
                        currentSrc,
                        event.currentTarget.naturalWidth,
                        event.currentTarget.naturalHeight,
                      );
                    }}
                    onError={() => markFailed(currentSrc)}
                  />
                ) : null}
              </>
            ) : (
              <ProductImagePlaceholder
                className="h-full w-full"
                aria-label={t(language, 'common.messages.noImage')}
              />
            )}

            {discountPercent ? (
              <div className="pointer-events-none absolute top-4 left-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
                -{discountPercent}%
              </div>
            ) : null}

            {product.labels ? <ProductLabels labels={product.labels} /> : null}

            <button
              type="button"
              onClick={onAddToWishlist}
              aria-pressed={isInWishlist}
              aria-label={
                isInWishlist
                  ? t(language, 'common.ariaLabels.removeFromWishlist')
                  : t(language, 'common.ariaLabels.addToWishlist')
              }
              className={`absolute z-20 flex items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-white/90 lg:hidden ${
                isInWishlist ? 'text-brand-pink' : 'text-gray-800'
              }`}
              style={{
                top: PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_INSET_PX,
                right: PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_INSET_PX,
                width: PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_SIZE_PX,
                height: PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_SIZE_PX,
              }}
            >
              <WishlistIcon
                isActive={isInWishlist}
                size={PRODUCT_PDP_MOBILE_WISHLIST_ICON_SIZE_PX}
              />
            </button>

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
            failedSources={failedSources}
            mainImageHeightPx={mainImageHeightPx}
            imageAspectRatio={imageAspectRatio}
            onImageIndexChange={onImageIndexChange}
            onImageError={markFailed}
          />
        ) : null}
      </div>

      <ProductImageZoomOverlay
        isOpen={showZoom && Boolean(renderedSrc) && !failedSources.has(renderedSrc ?? '')}
        src={renderedSrc ?? ''}
        alt={product.title}
        language={language}
        onClose={() => setShowZoom(false)}
        showNavigation={hasMultipleImages}
        onPrevious={showPreviousImage}
        onNext={showNextImage}
      />
    </>
  );
}
