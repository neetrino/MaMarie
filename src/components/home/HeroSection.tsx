import {
  HERO_BOTTOM_PILL_PLACEMENT,
  HERO_CONTENT_MAX_HEIGHT_PX,
  HERO_CONTENT_MAX_WIDTH_PX,
  HERO_CONTENT_MIN_HEIGHT_PX,
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
import { HeroBottomPill } from './HeroBottomPill';
import { HeroDecorations } from './HeroDecorations';
import { HeroLayerImage } from './HeroLayerImage';
import { HomePageSection } from './HomeSectionShell';

/**
 * Homepage hero — Figma frame `9:590` (1440×853).
 */
export function HeroSection() {
  return (
    <HomePageSection
      offsetTopPx={HERO_SECTION_OFFSET_Y_PX}
      className="relative isolate w-full overflow-hidden bg-white"
      style={{ zIndex: HERO_SECTION_Z_INDEX }}
    >
      <div
        className="relative isolate w-full overflow-hidden [container-type:size]"
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

        <HeroArcOverlay />

        <div
          className="absolute hidden sm:block"
          style={{
            left: heroPctX(HERO_BOTTOM_PILL_PLACEMENT.leftPx),
            top: heroPctY(HERO_BOTTOM_PILL_PLACEMENT.topPx),
            zIndex: HERO_CTA_Z_INDEX,
          }}
        >
          <HeroBottomPill />
        </div>

        <div
          className="absolute bottom-4 left-0 right-0 flex justify-center sm:hidden"
          style={{ zIndex: HERO_CTA_Z_INDEX }}
        >
          <HeroBottomPill />
        </div>
      </div>
    </HomePageSection>
  );
}
