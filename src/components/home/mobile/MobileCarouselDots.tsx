'use client';

import {
  MOBILE_HOME_DOT_ACTIVE_COLOR,
  MOBILE_HOME_DOT_ACTIVE_COLOR_PINK,
  MOBILE_HOME_DOT_ACTIVE_WIDTH_PX,
  MOBILE_HOME_DOT_GAP_PX,
  MOBILE_HOME_DOT_INACTIVE_COLOR,
  MOBILE_HOME_DOT_SIZE_PX,
} from '../../../constants/mobile-home';

interface MobileCarouselDotsProps {
  count: number;
  activeIndex: number;
  variant?: 'blue' | 'pink';
  className?: string;
}

export function MobileCarouselDots({
  count,
  activeIndex,
  variant = 'blue',
  className = '',
}: MobileCarouselDotsProps) {
  if (count <= 1) {
    return null;
  }

  const activeColor =
    variant === 'pink' ? MOBILE_HOME_DOT_ACTIVE_COLOR_PINK : MOBILE_HOME_DOT_ACTIVE_COLOR;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ gap: MOBILE_HOME_DOT_GAP_PX }}
      role="tablist"
      aria-label="Carousel pagination"
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;

        return (
          <span
            key={index}
            role="tab"
            aria-selected={isActive}
            aria-label={`Slide ${index + 1}`}
            className="block shrink-0 rounded-full transition-all duration-300"
            style={{
              width: isActive ? MOBILE_HOME_DOT_ACTIVE_WIDTH_PX : MOBILE_HOME_DOT_SIZE_PX,
              height: MOBILE_HOME_DOT_SIZE_PX,
              borderRadius: isActive ? 20 : '50%',
              backgroundColor: isActive ? activeColor : MOBILE_HOME_DOT_INACTIVE_COLOR,
            }}
          />
        );
      })}
    </div>
  );
}
