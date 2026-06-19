import Image from 'next/image';
import {
  HERO_ARC_PLACEMENT,
  HERO_ASSETS,
  HERO_COLLAGE_SHIFT_X_PX,
  HERO_CTA_PLACEMENT,
  HERO_DESIGN_HEIGHT_PX,
  HERO_DESIGN_WIDTH_PX,
  HERO_PADDING_LEFT_PX,
  HERO_PADDING_RIGHT_PX,
  HERO_PHOTO_LAYERS,
  heroPctH,
  heroPctW,
  heroPctX,
  heroPctY,
} from '../../constants/hero';
import { HeroCtaButtons } from './HeroCtaButtons';
import { HeroDecorations } from './HeroDecorations';
import { HeroLayerImage } from './HeroLayerImage';

const heroInsetStyle = {
  paddingLeft: HERO_PADDING_LEFT_PX,
  paddingRight: HERO_PADDING_RIGHT_PX,
} as const;

/**
 * Homepage hero — Figma frame `9:590` photo collage + arc + CTA.
 */
export function HeroSection() {
  return (
    <section aria-label="Hero" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px]" style={heroInsetStyle}>
        <div
          className="relative mx-auto w-full overflow-hidden"
          style={{
            aspectRatio: `${HERO_DESIGN_WIDTH_PX} / ${HERO_DESIGN_HEIGHT_PX}`,
            maxHeight: HERO_DESIGN_HEIGHT_PX,
            minHeight: 520,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: `translateX(${HERO_COLLAGE_SHIFT_X_PX}px)` }}
          >
            {HERO_PHOTO_LAYERS.map((layer) => (
              <HeroLayerImage key={layer.assetKey} layer={layer} />
            ))}

            <HeroDecorations />

            <div
              className="pointer-events-none absolute z-[70] flex justify-center"
              style={{
                left: heroPctX(HERO_ARC_PLACEMENT.leftPx),
                top: heroPctY(HERO_ARC_PLACEMENT.topPx),
                width: heroPctW(HERO_ARC_PLACEMENT.widthPx),
                height: heroPctH(HERO_ARC_PLACEMENT.heightPx),
              }}
            >
              <Image
                src={HERO_ASSETS.shapeTextArc}
                alt="Shape your childhood"
                width={HERO_ARC_PLACEMENT.widthPx}
                height={HERO_ARC_PLACEMENT.heightPx}
                priority
                className="h-full w-full object-contain mix-blend-screen"
              />
            </div>
          </div>

          <div
            className="absolute z-[80] hidden sm:block"
            style={{
              left: heroPctX(HERO_CTA_PLACEMENT.leftPx),
              top: heroPctY(HERO_CTA_PLACEMENT.topPx),
            }}
          >
            <HeroCtaButtons />
          </div>

          <div className="absolute bottom-8 left-0 right-0 z-[80] flex justify-center sm:hidden">
            <HeroCtaButtons />
          </div>
        </div>
      </div>
    </section>
  );
}
