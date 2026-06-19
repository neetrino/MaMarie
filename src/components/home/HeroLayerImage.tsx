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

function isSimpleContainLayer(layer: HeroLayerPlacement): boolean {
  return layer.objectFit === 'contain' && layer.crop === undefined;
}

/**
 * Absolutely positioned hero image layer with optional Figma crop offsets.
 */
export function HeroLayerImage({ layer }: HeroLayerImageProps) {
  const src = HERO_ASSETS[layer.assetKey];
  const transform = layerTransform(layer);

  if (isSimpleContainLayer(layer)) {
    const overflowClass =
      layer.scale !== undefined && layer.scale > 1 ? 'overflow-visible' : 'overflow-hidden';

    return (
      <div
        className={`pointer-events-none absolute max-w-full ${overflowClass}`}
        style={{
          left: heroPctX(layer.leftPx + (layer.offsetXPx ?? 0)),
          top: heroPctY(layer.topPx + (layer.offsetYPx ?? 0)),
          width: heroPctW(layer.widthPx),
          height: heroPctH(layer.heightPx),
          zIndex: layer.zIndex,
          transform,
          transformOrigin: layer.scaleOrigin,
        }}
      >
        <Image
          src={src}
          alt=""
          width={layer.widthPx}
          height={layer.heightPx}
          priority={layer.assetKey === 'layerRight'}
          sizes={`${layer.widthPx}px`}
          className="h-full w-full max-w-full object-contain mix-blend-screen"
        />
      </div>
    );
  }

  const crop = layer.crop ?? DEFAULT_CROP;
  const objectFit = layer.objectFit ?? 'cover';
  const objectFitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover';
  const overflowClass =
    layer.scale !== undefined && layer.scale > 1 ? 'overflow-visible' : 'overflow-hidden';

  return (
    <div
      className={`pointer-events-none absolute ${overflowClass}`}
      style={{
        left: heroPctX(layer.leftPx + (layer.offsetXPx ?? 0)),
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
            className={`${objectFitClass} mix-blend-screen`}
          />
        </div>
      </div>
    </div>
  );
}
