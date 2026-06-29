import Image from 'next/image';
import {
  FOOTER_ASSETS,
  FOOTER_BUNNY_DECORATION,
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
  const scaleX = layout.scaleX ?? 1;
  const scaleY = layout.scaleY ?? 1;

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
          transform: `scale(${scaleX}, ${scaleY}) rotate(${layout.rotateDeg}deg)`,
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

/** Bunny — clipped inside footer, behind content (Figma `51:430`). */
export function FooterBunnyDecoration() {
  return (
    <FooterDecoration layout={FOOTER_BUNNY_DECORATION} imageSrc={FOOTER_ASSETS.decoBunny} />
  );
}

/** Strawberry — above footer content, may overlap section above (Figma `51:429`). */
export function FooterStrawberryDecoration() {
  return (
    <FooterDecoration layout={FOOTER_STRAWBERRY_DECORATION} imageSrc={FOOTER_ASSETS.decoCamera} />
  );
}
