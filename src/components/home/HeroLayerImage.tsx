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

/**
 * Absolutely positioned hero image layer with optional Figma crop offsets.
 */
export function HeroLayerImage({ layer }: HeroLayerImageProps) {
  const src = HERO_ASSETS[layer.assetKey];
  const crop = layer.crop ?? DEFAULT_CROP;

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
      <div
        className="relative h-full w-full"
        style={layer.flip ? { transform: 'scaleY(-1) rotate(180deg)' } : undefined}
      >
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
