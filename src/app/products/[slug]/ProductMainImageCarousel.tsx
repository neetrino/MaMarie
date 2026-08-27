'use client';

import NextImage from 'next/image';
import { useEffect, useRef } from 'react';
import { ProductImagePlaceholder } from '../../../components/ProductImagePlaceholder';
import {
  PRODUCT_PDP_MAIN_IMAGE_CAROUSEL_CLASS,
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
  onImageLoad: (src: string) => void;
}

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

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const targetLeft = currentImageIndex * container.clientWidth;
    if (Math.abs(container.scrollLeft - targetLeft) < 2) {
      return;
    }

    isProgrammaticScrollRef.current = true;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });

    const releaseTimer = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 400);

    return () => {
      window.clearTimeout(releaseTimer);
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

      if (nextIndex !== currentImageIndex) {
        onImageIndexChange(nextIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [currentImageIndex, images.length, onImageIndexChange]);

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
                className="object-contain"
                sizes={PRODUCT_PDP_MAIN_IMAGE_SIZES}
                loading={mainImagePriority && index === 0 ? 'eager' : 'lazy'}
                unoptimized
                draggable={false}
                onLoad={() => onImageLoad(image)}
                onError={() => onImageError(image)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
