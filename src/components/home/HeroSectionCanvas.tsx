'use client';

import { useEffect, useState } from 'react';
import {
  HERO_CONTENT_MAX_HEIGHT_PX,
  HERO_CONTENT_MAX_WIDTH_PX,
  HERO_CONTENT_MIN_HEIGHT_PX,
  HERO_CTA_Z_INDEX,
  HERO_DESIGN_HEIGHT_PX,
  HERO_DESIGN_WIDTH_PX,
  HERO_GENDER_BUTTONS_BOTTOM_OFFSET_PX,
  HERO_SCENE_LAYERS,
  HERO_SCENE_OFFSET_X_PX,
  HERO_SCENE_OFFSET_Y_PX,
  HERO_SCENE_OVERFLOW_BOTTOM_PX,
  HERO_SCENE_OVERFLOW_TOP_PX,
  HERO_SECTION_Z_INDEX,
  heroOverflowPaddingX,
  heroPctX,
  heroPctY,
} from '../../constants/hero';
import { HeroGenderButtons } from './HeroGenderButtons';
import { HeroSceneLayerView } from './HeroSceneLayer';
import { preloadHeroSceneAssets } from './hero-scene-preload';

function useHeroSceneReady(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void preloadHeroSceneAssets().then(() => {
      if (!cancelled) {
        setIsReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return isReady;
}

/**
 * Keeps hero art and CTAs hidden until every scene asset has loaded,
 * then reveals the full frame at once (no staggered pop-in).
 */
export function HeroSectionCanvas() {
  const isSceneReady = useHeroSceneReady();

  return (
    <div
      className="relative isolate mx-auto w-full overflow-visible [container-type:size]"
      style={{
        aspectRatio: `${HERO_DESIGN_WIDTH_PX} / ${HERO_DESIGN_HEIGHT_PX}`,
        maxWidth: HERO_CONTENT_MAX_WIDTH_PX,
        maxHeight: HERO_CONTENT_MAX_HEIGHT_PX,
        minHeight: HERO_CONTENT_MIN_HEIGHT_PX,
        width: '100%',
        zIndex: HERO_SECTION_Z_INDEX,
      }}
    >
      <div
        className={isSceneReady ? 'opacity-100' : 'opacity-0'}
        style={{
          position: 'absolute',
          inset: 0,
          paddingTop: heroOverflowPaddingX(HERO_SCENE_OVERFLOW_TOP_PX),
          paddingBottom: heroOverflowPaddingX(HERO_SCENE_OVERFLOW_BOTTOM_PX),
        }}
        aria-hidden={!isSceneReady}
      >
        <div
          className="absolute bottom-0 overflow-visible"
          style={{
            top: heroPctY(HERO_SCENE_OFFSET_Y_PX),
            left: heroPctX(HERO_SCENE_OFFSET_X_PX),
            right: 0,
          }}
        >
          {HERO_SCENE_LAYERS.map((layer) => (
            <HeroSceneLayerView
              key={`${layer.kind}-${layer.assetKey}-${layer.zIndex}`}
              layer={layer}
            />
          ))}
        </div>

        <div
          className="absolute left-1/2 flex -translate-x-1/2 justify-center"
          style={{
            bottom: heroOverflowPaddingX(HERO_GENDER_BUTTONS_BOTTOM_OFFSET_PX),
            zIndex: HERO_CTA_Z_INDEX,
          }}
        >
          <HeroGenderButtons />
        </div>
      </div>
    </div>
  );
}
