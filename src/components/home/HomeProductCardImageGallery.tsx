'use client';

import Link from 'next/link';
import { useRef, type MouseEvent, type TouchEvent } from 'react';

const GALLERY_SWIPE_MIN_DISTANCE_PX = 48;

interface HomeProductCardImageGalleryProps {
  images: string[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  /** Mobile swipe surface — tap still opens the product; desktop uses card stretched link. */
  productHref?: string;
  onBeforeNavigate?: () => void;
}

type TouchPoint = { x: number; y: number };

function resolveSwipeDirection(start: TouchPoint, end: TouchPoint): 'previous' | 'next' | null {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  if (Math.abs(deltaX) < GALLERY_SWIPE_MIN_DISTANCE_PX) {
    return null;
  }

  if (Math.abs(deltaX) <= Math.abs(deltaY)) {
    return null;
  }

  return deltaX < 0 ? 'next' : 'previous';
}

/**
 * Card gallery controls — Main Variant images only.
 * Mobile: swipe between images. Desktop: no gallery chrome (first image).
 */
export function HomeProductCardImageGallery({
  images,
  activeIndex,
  onIndexChange,
  productHref,
  onBeforeNavigate,
}: HomeProductCardImageGalleryProps) {
  const touchStartRef = useRef<TouchPoint | null>(null);
  const didSwipeRef = useRef(false);

  if (images.length <= 1) {
    return null;
  }

  const safeIndex = Math.min(Math.max(activeIndex, 0), images.length - 1);

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    didSwipeRef.current = false;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;
    if (!start || !touch) {
      return;
    }

    const direction = resolveSwipeDirection(start, { x: touch.clientX, y: touch.clientY });
    if (!direction) {
      return;
    }

    didSwipeRef.current = true;
    event.preventDefault();
    if (direction === 'next') {
      onIndexChange((safeIndex + 1) % images.length);
      return;
    }
    onIndexChange((safeIndex - 1 + images.length) % images.length);
  };

  const handleMobileLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!didSwipeRef.current) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    didSwipeRef.current = false;
  };

  if (!productHref) {
    return (
      <div
        aria-hidden
        className="pointer-events-auto absolute inset-0 z-10 lg:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
    );
  }

  return (
    <Link
      href={productHref}
      aria-hidden
      tabIndex={-1}
      className="pointer-events-auto absolute inset-0 z-10 lg:hidden"
      onFocus={onBeforeNavigate}
      onPointerDown={onBeforeNavigate}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleMobileLinkClick}
    />
  );
}
