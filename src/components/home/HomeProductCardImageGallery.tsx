'use client';

import type { MouseEvent } from 'react';

interface HomeProductCardImageGalleryProps {
  images: string[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

/**
 * Card gallery controls — Main Variant images only (prev/next + dots).
 * Parent renders the active image so existing card layout stays intact.
 */
export function HomeProductCardImageGallery({
  images,
  activeIndex,
  onIndexChange,
}: HomeProductCardImageGalleryProps) {
  if (images.length <= 1) {
    return null;
  }

  const safeIndex = Math.min(Math.max(activeIndex, 0), images.length - 1);

  const goPrev = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onIndexChange((safeIndex - 1 + images.length) % images.length);
  };

  const goNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onIndexChange((safeIndex + 1) % images.length);
  };

  return (
    <>
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous image"
        className="absolute left-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base font-semibold text-gray-800 shadow-md hover:bg-white"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next image"
        className="absolute right-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base font-semibold text-gray-800 shadow-md hover:bg-white"
      >
        ›
      </button>
      <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {images.map((_, dotIndex) => (
          <button
            key={`dot-${dotIndex}`}
            type="button"
            aria-label={`Image ${dotIndex + 1}`}
            className={`pointer-events-auto h-2 w-2 rounded-full ${
              dotIndex === safeIndex ? 'bg-white' : 'bg-white/50'
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
