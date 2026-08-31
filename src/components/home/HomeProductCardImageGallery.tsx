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
 * Mobile: swipe + dots. Desktop: dots only (no arrows).
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

  return (
    <>
      {productHref ? (
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
      ) : (
        <div
          aria-hidden
          className="pointer-events-auto absolute inset-0 z-10 lg:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      )}

      <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {images.map((_, dotIndex) => (
          <button
            key={`dot-${dotIndex}`}
            type="button"
            aria-label={`Image ${dotIndex + 1}`}
            className={`pointer-events-auto h-2 w-2 rounded-full ${
              dotIndex === safeIndex ? 'bg-brand-pink' : 'bg-brand-pink/40'
            }`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onIndexChange(dotIndex);
            }}
          />
        ))}
      </div>
    </>
  );
}
