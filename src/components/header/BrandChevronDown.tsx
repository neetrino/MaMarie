import Image from 'next/image';
import type { CSSProperties } from 'react';
import { BRAND_ASSETS } from '../../constants/brand';

/** Closed chevron angle (points down). Open adds 180deg. */
const CHEVRON_CLOSED_ROTATE_DEG = 270;
const CHEVRON_OPEN_ROTATE_DEG = CHEVRON_CLOSED_ROTATE_DEG + 180;
const CHEVRON_ANIMATION_MS = 300;
/** Matches login pill icon stroke (`icon-login.svg`). */
export const BRAND_CHEVRON_LOGIN_INK = '#4B5563';

interface BrandChevronDownProps {
  className?: string;
  style?: CSSProperties;
  isOpen?: boolean;
  /** Recolor the white chevron asset (default stays white for pink pills). */
  inkColor?: string;
  /** Heavier glyph — matches bold pill label weight. */
  bold?: boolean;
}

/**
 * Down chevron from Figma asset (115-867), with open/close rotation animation.
 */
export function BrandChevronDown({
  className = '',
  style,
  isOpen = false,
  inkColor,
  bold = false,
}: BrandChevronDownProps) {
  const rotationDeg = isOpen ? CHEVRON_OPEN_ROTATE_DEG : CHEVRON_CLOSED_ROTATE_DEG;
  const transformStyle = {
    transform: `rotate(${rotationDeg}deg)`,
    transitionDuration: `${CHEVRON_ANIMATION_MS}ms`,
  } as const;

  const boldFilter = bold && inkColor
    ? [
        `drop-shadow(0.55px 0 0 ${inkColor})`,
        `drop-shadow(-0.55px 0 0 ${inkColor})`,
        `drop-shadow(0 0.55px 0 ${inkColor})`,
        `drop-shadow(0 -0.55px 0 ${inkColor})`,
      ].join(' ')
    : undefined;

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={style}
      aria-hidden
    >
      {inkColor ? (
        <span
          className={`inline-block transition-transform ease-in-out ${
            bold ? 'h-[14px] w-[8px]' : 'h-[13px] w-[7px]'
          }`}
          style={{
            ...transformStyle,
            backgroundColor: inkColor,
            filter: boldFilter,
            WebkitMaskImage: `url(${BRAND_ASSETS.iconChevron})`,
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskImage: `url(${BRAND_ASSETS.iconChevron})`,
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: 'contain',
          }}
        />
      ) : (
        <Image
          src={BRAND_ASSETS.iconChevron}
          alt=""
          width={7}
          height={13}
          className="h-auto w-[7px] transition-transform ease-in-out"
          style={transformStyle}
        />
      )}
    </span>
  );
}
