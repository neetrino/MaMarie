import Image from 'next/image';
import {
  HERO_ASSETS,
  type HeroImageCrop,
  type HeroLayerPlacement,
  heroPctH,
  heroPctW,
  heroPctX,
  heroPctY,
} from '../../constants/hero';

interface HeroLayerImageProps {
  layer: HeroLayerPlacement;
}

const DEFAULT_CROP: HeroImageCrop = {
  widthPercent: 100,
  heightPercent: 100,
  leftPercent: 0,
  topPercent: 0,
};

function cropBoxStyle(crop: HeroImageCrop) {
  return {
    width: `${crop.widthPercent}%`,
    height: `${crop.heightPercent}%`,
    left: `${crop.leftPercent}%`,
    top: `${crop.topPercent}%`,
  } as const;
}

function layerTransform(layer: HeroLayerPlacement): string | undefined {
  const parts: string[] = [];
  if (layer.scale !== undefined && layer.scale !== 1) {
    parts.push(`scale(${layer.scale})`);
  }
  if (layer.flip) {
    parts.push('scaleY(-1) rotate(180deg)');
  }
  return parts.length > 0 ? parts.join(' ') : undefined;
}

/**
 * Absolutely positioned hero image layer with optional Figma crop offsets.
 */
export function HeroLayerImage({ layer }: HeroLayerImageProps) {
  const src = HERO_ASSETS[layer.assetKey];
  const crop = layer.crop ?? DEFAULT_CROP;
  const transform = layerTransform(layer);

  return (
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{
        left: heroPctX(layer.leftPx),
        top: heroPctY(layer.topPx + (layer.offsetYPx ?? 0)),
        width: heroPctW(layer.widthPx),
        height: heroPctH(layer.heightPx),
        zIndex: layer.zIndex,
        transform,
        transformOrigin: layer.scaleOrigin,
      }}
    >
      <div className="relative h-full w-full">
        <div className="absolute" style={cropBoxStyle(crop)}>
          <Image
            src={src}
            alt=""
            fill
            priority={layer.assetKey === 'layerCenter'}
            sizes={`${layer.widthPx}px`}
            className="object-cover mix-blend-screen"
          />
        </div>
      </div>
    </div>
  );
}
