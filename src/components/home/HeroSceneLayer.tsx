import Image from 'next/image';
import {
  HERO_ASSETS,
  type HeroFlatPlacement,
  type HeroRotatedPlacement,
  type HeroSceneLayer,
  heroPctH,
  heroPctW,
  heroPctX,
  heroPctY,
} from '../../constants/hero';

interface HeroSceneLayerProps {
  layer: HeroSceneLayer;
}

function innerSizePercent(containerPx: number, imagePx: number): string {
  return `${(imagePx / containerPx) * 100}%`;
}

function flatImageClassName(layer: HeroFlatPlacement): string {
  const position = layer.objectPosition === 'bottom' ? 'object-bottom' : 'object-center';
  const fit =
    layer.objectFit === 'contain'
      ? 'object-contain'
      : layer.objectFit === 'cover'
        ? 'object-cover'
        : 'object-fill';

  return `${fit} ${position} h-full w-full max-w-none`;
}

function HeroFlatLayer({ layer }: { layer: HeroFlatPlacement }) {
  return (
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{
        left: heroPctX(layer.leftPx),
        top: heroPctY(layer.topPx),
        width: heroPctW(layer.widthPx),
        height: heroPctH(layer.heightPx),
        zIndex: layer.zIndex,
      }}
    >
      <Image
        src={HERO_ASSETS[layer.assetKey]}
        alt=""
        fill
        priority={layer.priority}
        sizes={`${layer.widthPx}px`}
        className={flatImageClassName(layer)}
      />
    </div>
  );
}

function HeroRotatedLayer({ layer }: { layer: HeroRotatedPlacement }) {
  const innerTransform = [layer.flipY ? 'scaleY(-1)' : '', `rotate(${layer.rotateDeg}deg)`]
    .filter(Boolean)
    .join(' ');

  const objectPositionClass =
    layer.objectPosition === 'bottom' ? 'object-bottom object-cover' : 'object-cover';

  return (
    <div
      className="pointer-events-none absolute flex items-center justify-center"
      style={{
        left: heroPctX(layer.leftPx),
        top: heroPctY(layer.topPx),
        width: heroPctW(layer.containerWidthPx),
        height: heroPctH(layer.containerHeightPx),
        zIndex: layer.zIndex,
      }}
    >
      <div
        className="relative flex-none"
        style={{
          transform: innerTransform,
          width: innerSizePercent(layer.containerWidthPx, layer.imageWidthPx),
          height: innerSizePercent(layer.containerHeightPx, layer.imageHeightPx),
        }}
      >
        <Image
          src={HERO_ASSETS[layer.assetKey]}
          alt=""
          fill
          priority={layer.priority}
          sizes={`${layer.imageWidthPx}px`}
          className={objectPositionClass}
        />
      </div>
    </div>
  );
}

/** Single hero scene layer — flat or rotated per Figma frame `51:329`. */
export function HeroSceneLayerView({ layer }: HeroSceneLayerProps) {
  if (layer.kind === 'flat') {
    return <HeroFlatLayer layer={layer} />;
  }

  return <HeroRotatedLayer layer={layer} />;
}
