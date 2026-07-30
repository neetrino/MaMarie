import type { ReactNode } from 'react';
import Image from 'next/image';
import {
  HERO_ASSETS,
  HERO_INSCRIPTION_APPEAR_DURATION_MS,
  type HeroFlatPlacement,
  type HeroRotatedPlacement,
  type HeroSceneLayer,
  heroPctH,
  heroPctW,
  heroPctX,
  heroPctY,
} from '../../constants/hero';
import type { DecorationMotion } from '../../constants/decoration-motion';
import { DecorationMotionShell } from '../decoration-motion/DecorationMotionShell';
import { SoftAppearShell } from '../motion/SoftAppearShell';

interface HeroSceneLayerProps {
  layer: HeroSceneLayer;
  sceneReady: boolean;
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
        priority
        unoptimized
        quality={100}
        sizes={`${layer.widthPx}px`}
        className={flatImageClassName(layer)}
      />
    </div>
  );
}

function rotatedImageClassName(layer: HeroRotatedPlacement): string {
  if (layer.objectFit === 'contain') {
    if (layer.objectPosition === 'bottom') {
      return 'object-contain object-bottom';
    }

    if (layer.objectPosition === 'center') {
      return 'object-contain object-center';
    }

    return 'object-contain object-center';
  }

  return layer.objectPosition === 'bottom' ? 'object-bottom object-cover' : 'object-cover';
}

function OptionalMotion({
  motion,
  children,
}: {
  motion: DecorationMotion | undefined;
  children: ReactNode;
}) {
  if (!motion) {
    return children;
  }

  return <DecorationMotionShell motion={motion}>{children}</DecorationMotionShell>;
}

function OptionalAppear({
  enabled,
  active,
  delayMs,
  children,
}: {
  enabled: boolean;
  active: boolean;
  delayMs: number;
  children: ReactNode;
}) {
  if (!enabled) {
    return children;
  }

  return (
    <SoftAppearShell
      active={active}
      durationMs={HERO_INSCRIPTION_APPEAR_DURATION_MS}
      delayMs={delayMs}
      className="flex h-full w-full items-center justify-center"
    >
      {children}
    </SoftAppearShell>
  );
}

function HeroRotatedLayer({
  layer,
  sceneReady,
}: {
  layer: HeroRotatedPlacement;
  sceneReady: boolean;
}) {
  const innerTransform = [layer.flipY ? 'scaleY(-1)' : '', `rotate(${layer.rotateDeg}deg)`]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className="pointer-events-none absolute flex items-center justify-center overflow-visible"
      style={{
        left: heroPctX(layer.leftPx),
        top: heroPctY(layer.topPx),
        width: heroPctW(layer.containerWidthPx),
        height: heroPctH(layer.containerHeightPx),
        zIndex: layer.zIndex,
      }}
    >
      <OptionalAppear
        enabled={Boolean(layer.appearEnter)}
        active={sceneReady}
        delayMs={layer.appearDelayMs ?? 0}
      >
        <OptionalMotion motion={layer.motion}>
          <div
            className="relative flex-none overflow-visible"
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
              priority
              unoptimized
              quality={100}
              sizes={`${layer.imageWidthPx}px`}
              className={`max-w-none ${rotatedImageClassName(layer)}`}
            />
          </div>
        </OptionalMotion>
      </OptionalAppear>
    </div>
  );
}

/** Single hero scene layer — flat or rotated per Figma frame `51:329`. */
export function HeroSceneLayerView({ layer, sceneReady }: HeroSceneLayerProps) {
  if (layer.kind === 'flat') {
    return <HeroFlatLayer layer={layer} />;
  }

  return <HeroRotatedLayer layer={layer} sceneReady={sceneReady} />;
}
