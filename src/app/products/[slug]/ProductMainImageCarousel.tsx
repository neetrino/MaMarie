'use client';

import NextImage from 'next/image';
import { useEffect, useRef } from 'react';
import { ProductImagePlaceholder } from '../../../components/ProductImagePlaceholder';
import {
  PRODUCT_PDP_MAIN_IMAGE_CAROUSEL_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_OBJECT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_SIZES,
  PRODUCT_PDP_MAIN_IMAGE_SLIDE_CLASS,
} from './constants';

interface ProductMainImageCarouselProps {
  images: string[];
  alt: string;
  currentImageIndex: number;
  failedSources: Set<string>;
  mainImagePriority: boolean;
  onImageIndexChange: (index: number) => void;
  onImageError: (src: string) => void;
  onImageLoad: (src: string, naturalWidth: number, naturalHeight: number) => void;
}

const PROGRAMMATIC_SCROLL_RELEASE_MS = 450;

/** Horizontal snap carousel — swipe/scroll images like Mobee PDP. */
export function ProductMainImageCarousel({
  images,
  alt,
  currentImageIndex,
  failedSources,
  mainImagePriority,
  onImageIndexChange,
  onImageError,
  onImageLoad,
}: ProductMainImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const currentIndexRef = useRef(currentImageIndex);
  const releaseTimerRef = useRef<number | null>(null);

  const lockProgrammaticScroll = () => {
    isProgrammaticScrollRef.current = true;
    if (releaseTimerRef.current !== null) {
      window.clearTimeout(releaseTimerRef.current);
    }
    releaseTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      releaseTimerRef.current = null;
    }, PROGRAMMATIC_SCROLL_RELEASE_MS);
  };

  const syncScrollToIndex = (index: number, behavior: ScrollBehavior) => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const width = container.clientWidth;
    if (width <= 0) {
      return;
    }

    const targetLeft = index * width;
    if (Math.abs(container.scrollLeft - targetLeft) < 2) {
      return;
    }

    lockProgrammaticScroll();
    container.scrollTo({ left: targetLeft, behavior });
  };

  useEffect(() => {
    currentIndexRef.current = currentImageIndex;
    syncScrollToIndex(currentImageIndex, 'smooth');

    return () => {
      if (releaseTimerRef.current !== null) {
        window.clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
      }
    };
  }, [currentImageIndex]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) {
        return;
      }

      const width = container.clientWidth;
      if (width <= 0) {
        return;
      }

      const nextIndex = Math.min(
        images.length - 1,
        Math.max(0, Math.round(container.scrollLeft / width)),
      );

      if (nextIndex !== currentIndexRef.current) {
        onImageIndexChange(nextIndex);
      }
    };

    const handleResize = () => {
      // Frame size follows image aspect — keep the active slide pinned.
      syncScrollToIndex(currentIndexRef.current, 'auto');
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [images.length, onImageIndexChange]);

  return (
    <div
      ref={scrollRef}
      className={PRODUCT_PDP_MAIN_IMAGE_CAROUSEL_CLASS}
      aria-roledescription="carousel"
    >
      {images.map((image, index) => {
        const failed = failedSources.has(image);

        return (
          <div key={`${image}-${index}`} className={PRODUCT_PDP_MAIN_IMAGE_SLIDE_CLASS}>
            {failed ? (
              <ProductImagePlaceholder className="h-full w-full" aria-label="" />
            ) : (
              <NextImage
                src={image}
                alt={index === currentImageIndex ? alt : ''}
                fill
                className={PRODUCT_PDP_MAIN_IMAGE_OBJECT_CLASS}
                sizes={PRODUCT_PDP_MAIN_IMAGE_SIZES}
                loading={mainImagePriority && index === 0 ? 'eager' : 'lazy'}
                unoptimized
                draggable={false}
                onLoad={(event) => {
                  onImageLoad(
                    image,
                    event.currentTarget.naturalWidth,
                    event.currentTarget.naturalHeight,
                  );
                }}
                onError={() => onImageError(image)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
