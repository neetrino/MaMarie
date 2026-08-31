'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { ProductImagePlaceholder } from '../../../components/ProductImagePlaceholder';
import {
  PRODUCT_PDP_THUMBNAIL_FRAME_ACTIVE_CLASS,
  PRODUCT_PDP_THUMBNAIL_FRAME_BASE_CLASS,
  PRODUCT_PDP_THUMBNAIL_FRAME_INACTIVE_CLASS,
  PRODUCT_PDP_THUMBNAIL_FRAME_SIZE_CLASS,
  PRODUCT_PDP_THUMBNAIL_IMAGE_CLASS,
  PRODUCT_PDP_THUMBNAIL_LIST_MOBILE_CLASS,
  PRODUCT_PDP_THUMBNAIL_RAIL_WRAPPER_CLASS,
} from './constants';

interface ProductThumbnailRailProps {
  images: string[];
  currentImageIndex: number;
  failedSources: Set<string>;
  mainImageHeightPx: number | null;
  onImageIndexChange: (index: number) => void;
  onImageError: (src: string) => void;
}

export function ProductThumbnailRail({
  images,
  currentImageIndex,
  failedSources,
  mainImageHeightPx,
  onImageIndexChange,
  onImageError,
}: ProductThumbnailRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const activeThumb = activeThumbRef.current;
    if (!activeThumb) {
      return;
    }

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const scrollContainer = isDesktop ? railRef.current : listRef.current;
    if (!scrollContainer) {
      return;
    }

    if (!isDesktop) {
      const thumbLeft = activeThumb.offsetLeft;
      const thumbRight = thumbLeft + activeThumb.offsetWidth;
      const visibleLeft = scrollContainer.scrollLeft;
      const visibleRight = visibleLeft + scrollContainer.clientWidth;

      if (thumbLeft >= visibleLeft && thumbRight <= visibleRight) {
        return;
      }

      const nextScrollLeft =
        thumbRight > visibleRight ? thumbRight - scrollContainer.clientWidth : thumbLeft;

      scrollContainer.scrollTo({ left: Math.max(0, nextScrollLeft), behavior: 'smooth' });
      return;
    }

    const thumbTop = activeThumb.offsetTop;
    const thumbBottom = thumbTop + activeThumb.offsetHeight;
    const visibleTop = scrollContainer.scrollTop;
    const visibleBottom = visibleTop + scrollContainer.clientHeight;

    if (thumbTop >= visibleTop && thumbBottom <= visibleBottom) {
      return;
    }

    const nextScrollTop =
      thumbBottom > visibleBottom ? thumbBottom - scrollContainer.clientHeight : thumbTop;

    scrollContainer.scrollTo({ top: Math.max(0, nextScrollTop), behavior: 'smooth' });
  }, [currentImageIndex, mainImageHeightPx]);

  const railStyle: CSSProperties | undefined =
    mainImageHeightPx !== null ? { maxHeight: mainImageHeightPx } : undefined;

  return (
    <div ref={railRef} className={PRODUCT_PDP_THUMBNAIL_RAIL_WRAPPER_CLASS} style={railStyle}>
      <div ref={listRef} className={PRODUCT_PDP_THUMBNAIL_LIST_MOBILE_CLASS}>
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
              {failedSources.has(image) ? (
                <ProductImagePlaceholder className="h-full w-full" aria-label="" />
              ) : (
                <img
                  src={image}
                  alt=""
                  className={PRODUCT_PDP_THUMBNAIL_IMAGE_CLASS}
                  loading="lazy"
                  decoding="async"
                  onError={() => onImageError(image)}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
