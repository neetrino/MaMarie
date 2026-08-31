'use client';

import NextImage from 'next/image';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ProductImagePlaceholder } from '../../../components/ProductImagePlaceholder';
import { t } from '../../../lib/i18n';
import type { LanguageCode } from '../../../lib/language';
import { readProductPageSnapshot } from '../../../lib/product-page-snapshot';
import {
  DEFAULT_IMAGE_ASPECT_RATIO,
  resolveImageAspectRatio,
} from '../../../lib/resolve-image-aspect-ratio';
import type { Product } from './types';
import {
  PRODUCT_PDP_GALLERY_LAYOUT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_FRAME_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_OBJECT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_SIZES,
  PRODUCT_PDP_MAIN_IMAGE_WRAPPER_CLASS,
  PRODUCT_PDP_THUMBNAIL_MIN_IMAGE_COUNT,
} from './constants';
import { ProductImageZoomOverlay } from './ProductImageZoomOverlay';
import { ProductMainImageCarousel } from './ProductMainImageCarousel';
import { ProductMainImageControls } from './ProductMainImageControls';
import { ProductThumbnailRail } from './ProductThumbnailRail';
import { usePdpMainImageFrameSize } from './usePdpMainImageFrameSize';

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
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const mainFrameRef = useRef<HTMLDivElement>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [failedSources, setFailedSources] = useState<Set<string>>(new Set());
  const [snapshotSrc, setSnapshotSrc] = useState<string | undefined>(() => images[currentImageIndex]);
  const [mainImageHeightPx, setMainImageHeightPx] = useState<number | null>(null);
  const [aspectBySrc, setAspectBySrc] = useState<Record<string, number>>({});

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
  const frameSize = usePdpMainImageFrameSize(mainWrapperRef, imageAspectRatio);

  useEffect(() => {
    const entrySnapshot = readProductPageSnapshot(product.slug);
    if (entrySnapshot?.imageUrl) {
      setSnapshotSrc(entrySnapshot.imageUrl);
    }
  }, [product.slug]);

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
        <div ref={mainWrapperRef} className={PRODUCT_PDP_MAIN_IMAGE_WRAPPER_CLASS}>
          <div
            ref={mainFrameRef}
            data-product-fly-origin
            className={PRODUCT_PDP_MAIN_IMAGE_FRAME_CLASS}
            style={{
              width: frameSize.widthPx,
              height: frameSize.heightPx,
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
                    className={`absolute inset-0 h-full w-full ${PRODUCT_PDP_MAIN_IMAGE_OBJECT_CLASS}`}
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
                    className={`${PRODUCT_PDP_MAIN_IMAGE_OBJECT_CLASS} transition-transform duration-500 group-hover:scale-105`}
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

            <ProductMainImageControls
              product={product}
              discountPercent={discountPercent}
              language={language}
              hasMultipleImages={hasMultipleImages}
              isInWishlist={isInWishlist}
              onAddToWishlist={onAddToWishlist}
              onPreviousImage={showPreviousImage}
              onNextImage={showNextImage}
              onOpenZoom={() => setShowZoom(true)}
            />
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
