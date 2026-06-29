import Image from 'next/image';
import type { CSSProperties } from 'react';
import { BRAND_ASSETS } from '../../constants/brand';

/** Closed chevron angle (points down). Open adds 180deg. */
const CHEVRON_CLOSED_ROTATE_DEG = 270;
const CHEVRON_OPEN_ROTATE_DEG = CHEVRON_CLOSED_ROTATE_DEG + 180;
const CHEVRON_ANIMATION_MS = 300;

interface BrandChevronDownProps {
  className?: string;
  style?: CSSProperties;
  isOpen?: boolean;
}

/**
 * Down chevron from Figma asset (115-867), with open/close rotation animation.
 */
export function BrandChevronDown({ className = '', style, isOpen = false }: BrandChevronDownProps) {
  const rotationDeg = isOpen ? CHEVRON_OPEN_ROTATE_DEG : CHEVRON_CLOSED_ROTATE_DEG;

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={style}
      aria-hidden
    >
      <Image
        src={BRAND_ASSETS.iconChevron}
        alt=""
        width={7}
        height={13}
        className="h-auto w-[7px] transition-transform ease-in-out"
        style={{
          transform: `rotate(${rotationDeg}deg)`,
          transitionDuration: `${CHEVRON_ANIMATION_MS}ms`,
        }}
      />
    </span>
  );
}
