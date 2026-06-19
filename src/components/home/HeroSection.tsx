import {
  HERO_CONTENT_MAX_HEIGHT_PX,
  HERO_CONTENT_MAX_WIDTH_PX,
  HERO_CONTENT_MIN_HEIGHT_PX,
  HERO_CTA_PLACEMENT,
  HERO_CTA_Z_INDEX,
  HERO_DESIGN_HEIGHT_PX,
  HERO_DESIGN_WIDTH_PX,
  HERO_PHOTO_LAYERS,
  HERO_SECTION_OFFSET_Y_PX,
  HERO_SECTION_Z_INDEX,
  heroPctX,
  heroPctY,
} from '../../constants/hero';
import { HeroArcOverlay } from './HeroArcOverlay';
import { HeroCtaButtons } from './HeroCtaButtons';
import { HeroDecorations } from './HeroDecorations';
import { HeroLayerImage } from './HeroLayerImage';

/**
 * Homepage hero — Figma frame `9:590` (1440×853 artboard).
 */
export function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative isolate w-full overflow-hidden bg-white"
      style={{ paddingTop: HERO_SECTION_OFFSET_Y_PX, zIndex: HERO_SECTION_Z_INDEX }}
    >
      <div className="relative isolate mx-auto w-full max-w-[1440px]">
        <div
          className="relative isolate mx-auto w-full overflow-hidden [container-type:size]"
          style={{
            aspectRatio: `${HERO_DESIGN_WIDTH_PX} / ${HERO_DESIGN_HEIGHT_PX}`,
            maxWidth: HERO_CONTENT_MAX_WIDTH_PX,
            maxHeight: HERO_CONTENT_MAX_HEIGHT_PX,
            minHeight: HERO_CONTENT_MIN_HEIGHT_PX,
            zIndex: HERO_SECTION_Z_INDEX,
          }}
        >
          {HERO_PHOTO_LAYERS.map((layer) => (
            <HeroLayerImage key={layer.assetKey} layer={layer} />
          ))}

          <HeroDecorations />

          <div
            className="absolute hidden sm:block"
            style={{
              left: heroPctX(HERO_CTA_PLACEMENT.leftPx),
              top: heroPctY(HERO_CTA_PLACEMENT.topPx),
              zIndex: HERO_CTA_Z_INDEX,
            }}
          >
            <HeroCtaButtons />
          </div>

          <div
            className="absolute bottom-8 left-0 right-0 flex justify-center sm:hidden"
            style={{ zIndex: HERO_CTA_Z_INDEX }}
          >
            <HeroCtaButtons />
          </div>

          <HeroArcOverlay />
        </div>
      </div>
    </section>
  );
}
