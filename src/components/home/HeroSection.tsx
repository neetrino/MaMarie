import {
  HERO_CONTENT_MAX_HEIGHT_PX,
  HERO_CONTENT_MAX_WIDTH_PX,
  HERO_CONTENT_MIN_HEIGHT_PX,
  HERO_CTA_Z_INDEX,
  HERO_DESIGN_HEIGHT_PX,
  HERO_DESIGN_WIDTH_PX,
  HERO_GENDER_BUTTONS_TOP_PX,
  HERO_SCENE_LAYERS,
  HERO_SECTION_OFFSET_Y_PX,
  HERO_SECTION_Z_INDEX,
  heroPctY,
} from '../../constants/hero';
import { HeroGenderButtons } from './HeroGenderButtons';
import { HeroSceneLayerView } from './HeroSceneLayer';
import { HomePageSection } from './HomeSectionShell';

/**
 * Homepage hero — Figma frame `51:329` (1440×853).
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
        {HERO_SCENE_LAYERS.map((layer) => (
          <HeroSceneLayerView key={`${layer.kind}-${layer.assetKey}-${layer.zIndex}`} layer={layer} />
        ))}

        <div
          className="absolute left-1/2 hidden -translate-x-1/2 sm:block"
          style={{
            top: heroPctY(HERO_GENDER_BUTTONS_TOP_PX),
            zIndex: HERO_CTA_Z_INDEX,
          }}
        >
          <HeroGenderButtons />
        </div>

        <div
          className="absolute bottom-4 left-0 right-0 flex justify-center sm:hidden"
          style={{ zIndex: HERO_CTA_Z_INDEX }}
        >
          <HeroGenderButtons />
        </div>
      </div>
    </HomePageSection>
  );
}
