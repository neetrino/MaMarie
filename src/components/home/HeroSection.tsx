import {
  HERO_CANVAS_HORIZONTAL_BLEED_LEFT_PX,
  HERO_CANVAS_HORIZONTAL_BLEED_TOTAL_PX,
  HERO_SECTION_OFFSET_Y_PX,
  HERO_SECTION_Z_INDEX,
} from '../../constants/hero';
import { HeroSectionCanvas } from './HeroSectionCanvas';
import { HERO_SCENE_PRELOAD_URLS } from './hero-scene-preload';
import { HomeSectionShell } from './HomeSectionShell';

/**
 * Homepage hero — Figma frame `51:329` (1440×853).
 */
export function HeroSection() {
  return (
    <HomeSectionShell
      offsetTopPx={HERO_SECTION_OFFSET_Y_PX}
      className="relative isolate w-full overflow-visible bg-white"
      style={{ zIndex: HERO_SECTION_Z_INDEX }}
    >
      {HERO_SCENE_PRELOAD_URLS.map((url) => (
        <link key={url} rel="preload" as="image" href={url} />
      ))}

      <div
        style={{
          width: `calc(100% + ${HERO_CANVAS_HORIZONTAL_BLEED_TOTAL_PX}px)`,
          marginLeft: -HERO_CANVAS_HORIZONTAL_BLEED_LEFT_PX,
        }}
      >
        <HeroSectionCanvas />
      </div>
    </HomeSectionShell>
  );
}
