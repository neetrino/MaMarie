import {
  WHY_US_IMAGE_BOX_HEIGHT_PX,
  WHY_US_IMAGE_BOX_WIDTH_PX,
  WHY_US_LAYOUT_SCALE,
  type WhyUsCardImageLayout,
} from '../../constants/why-us-section';

interface WhyUsCardImageProps {
  src: string;
  layout: WhyUsCardImageLayout;
}

function scalePx(value: number): number {
  return value * WHY_US_LAYOUT_SCALE;
}

function WhyUsCardImageFill({
  src,
  layout,
}: {
  src: string;
  layout: Extract<WhyUsCardImageLayout, { kind: 'fill' }>;
}) {
  return (
    <img
      alt=""
      src={src}
      loading="lazy"
      decoding="async"
      className="pointer-events-none absolute max-w-none object-cover"
      style={{
        left: scalePx(layout.leftPx),
        top: scalePx(layout.topPx),
        width: scalePx(layout.widthPx),
        height: scalePx(layout.heightPx),
      }}
    />
  );
}

function WhyUsCardImageCrop({
  src,
  layout,
}: {
  src: string;
  layout: Extract<WhyUsCardImageLayout, { kind: 'crop' }>;
}) {
  return (
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{
        left: scalePx(layout.leftPx),
        top: scalePx(layout.topPx),
        width: scalePx(layout.widthPx),
        height: scalePx(layout.heightPx),
      }}
    >
      <img
        alt=""
        src={src}
        loading="lazy"
        decoding="async"
        className="absolute max-w-none object-cover"
        style={{
          height: `${layout.imageHeightPercent}%`,
          width: `${layout.imageWidthPercent}%`,
          left: `${layout.imageLeftPercent}%`,
          top: `${layout.imageTopPercent}%`,
        }}
      />
    </div>
  );
}

function WhyUsCardImageRotated({
  src,
  layout,
}: {
  src: string;
  layout: Extract<WhyUsCardImageLayout, { kind: 'rotated' }>;
}) {
  return (
    <div
      className="pointer-events-none absolute flex items-center justify-center"
      style={{
        left: scalePx(layout.wrapperLeftPx),
        top: scalePx(layout.wrapperTopPx),
        width: scalePx(layout.wrapperSizePx),
        height: scalePx(layout.wrapperSizePx),
      }}
    >
      <div className="flex-none" style={{ transform: `rotate(${layout.rotateDeg}deg)` }}>
        <img
          alt=""
          src={src}
          loading="lazy"
          decoding="async"
          className="max-w-none object-cover"
          style={{
            width: scalePx(layout.imageSizePx),
            height: scalePx(layout.imageSizePx),
          }}
        />
      </div>
    </div>
  );
}

/** Figma `51:378`–`51:401` — card image areas. */
export function WhyUsCardImage({ src, layout }: WhyUsCardImageProps) {
  return (
    <div
      aria-hidden
      className="relative shrink-0 overflow-hidden bg-white"
      style={{
        width: WHY_US_IMAGE_BOX_WIDTH_PX,
        height: WHY_US_IMAGE_BOX_HEIGHT_PX,
      }}
    >
      {layout.kind === 'fill' ? <WhyUsCardImageFill src={src} layout={layout} /> : null}
      {layout.kind === 'crop' ? <WhyUsCardImageCrop src={src} layout={layout} /> : null}
      {layout.kind === 'rotated' ? <WhyUsCardImageRotated src={src} layout={layout} /> : null}
    </div>
  );
}
