import {
  decorationMotionAt,
  type DecorationMotion,
} from '../../constants/decoration-motion';
import type { AboutUsDecorationLayout } from '../../constants/about-us-section';
import { DecorationMotionShell } from '../decoration-motion/DecorationMotionShell';

interface AboutUsDecorationProps {
  layout: AboutUsDecorationLayout;
  imageSrc: string;
  motion: DecorationMotion;
}

/** Rotated clay decoration on About Us cards. */
export function AboutUsHomeDecoration({ layout, imageSrc, motion }: AboutUsDecorationProps) {
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
      className="pointer-events-none absolute flex items-center justify-center"
      style={{
        left: layout.leftPx,
        top: layout.topPx,
        width: layout.wrapperSizePx,
        height: layout.wrapperSizePx,
        zIndex: layout.zIndex,
      }}
    >
      <DecorationMotionShell motion={motion}>
        <div
          className="relative shrink-0"
          style={{
            width: layout.imageSizePx,
            height: layout.imageSizePx,
            transform,
          }}
        >
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
            width={layout.imageSizePx}
            height={layout.imageSizePx}
          />
        </div>
      </DecorationMotionShell>
    </div>
  );
}

export function AboutUsHomeDecorations({
  decorations,
}: {
  decorations: Array<AboutUsDecorationLayout & { imageSrc: string }>;
}) {
  return (
    <>
      {decorations.map((deco, index) => (
        <AboutUsHomeDecoration
          key={deco.imageSrc}
          layout={deco}
          imageSrc={deco.imageSrc}
          motion={decorationMotionAt(index)}
        />
      ))}
    </>
  );
}
