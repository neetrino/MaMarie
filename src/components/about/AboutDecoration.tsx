import type { CSSProperties } from 'react';

export interface AboutDecorationLayout {
  leftPx: number;
  topPx: number;
  wrapperSizePx: number;
  imageSizePx: number;
  rotateDeg?: number;
  flipX?: boolean;
  flipY?: boolean;
  zIndex?: number;
}

interface AboutDecorationProps {
  layout: AboutDecorationLayout;
  imageSrc: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Rotated / flipped clay decoration — Figma absolute overlay pattern.
 */
export function AboutDecoration({
  layout,
  imageSrc,
  className = '',
  style,
}: AboutDecorationProps) {
  const transform = [
    layout.flipX ? 'scaleX(-1)' : '',
    layout.flipY ? 'scaleY(-1)' : '',
    layout.rotateDeg !== undefined ? `rotate(${layout.rotateDeg}deg)` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute flex items-center justify-center ${className}`.trim()}
      style={{
        left: layout.leftPx,
        top: layout.topPx,
        width: layout.wrapperSizePx,
        height: layout.wrapperSizePx,
        zIndex: layout.zIndex,
        ...style,
      }}
    >
      <div
        className="relative shrink-0"
        style={{
          width: layout.imageSizePx,
          height: layout.imageSizePx,
          transform: transform || undefined,
        }}
      >
        <img
          src={imageSrc}
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          width={layout.imageSizePx}
          height={layout.imageSizePx}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
