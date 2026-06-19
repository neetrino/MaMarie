import Image from 'next/image';
import {
  FOOTER_ASSETS,
  FOOTER_STAR_DECORATION,
  FOOTER_STRAWBERRY_DECORATION,
  type FooterDecorationLayout,
} from '../../constants/footer';

function FooterDecoration({
  layout,
  imageSrc,
}: {
  layout: FooterDecorationLayout;
  imageSrc: string;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute flex items-center justify-center"
      style={{
        left: layout.leftPx,
        top: layout.topPx,
        width: layout.wrapperSizePx,
        height: layout.wrapperSizePx,
      }}
    >
      <div
        className="relative shrink-0"
        style={{
          width: layout.imageSizePx,
          height: layout.imageSizePx,
          transform: `rotate(${layout.rotateDeg}deg)`,
        }}
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes={`${Math.round(layout.imageSizePx)}px`}
          className="object-cover"
        />
      </div>
    </div>
  );
}

/** Star — clipped inside footer, behind content. */
export function FooterStarDecoration() {
  return (
    <FooterDecoration layout={FOOTER_STAR_DECORATION} imageSrc={FOOTER_ASSETS.decoStar} />
  );
}

/** Strawberry — above footer content, may overlap section above. */
export function FooterStrawberryDecoration() {
  return (
    <FooterDecoration layout={FOOTER_STRAWBERRY_DECORATION} imageSrc={FOOTER_ASSETS.decoCamera} />
  );
}
