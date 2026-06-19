'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '../../lib/i18n-client';
import {
  getHeroBottomPillIndicator,
  HERO_BOTTOM_PILL_BACKDROP_BLUR_PX,
  HERO_BOTTOM_PILL_BG_COLOR,
  HERO_BOTTOM_PILL_FONT_SIZE_PX,
  HERO_BOTTOM_PILL_HEIGHT_PX,
  HERO_BOTTOM_PILL_INNER_ACTIVE_HEIGHT_PX,
  HERO_BOTTOM_PILL_LINE_HEIGHT_PX,
  HERO_BOTTOM_PILL_PRIMARY_BG_COLOR,
  HERO_BOTTOM_PILL_PRIMARY_INSET_SHADOW,
  HERO_BOTTOM_PILL_SLIDE_MS,
  HERO_BOTTOM_PILL_TAB_KEYS,
  HERO_BOTTOM_PILL_TEXT_COLOR,
  HERO_BOTTOM_PILL_WIDTH_PX,
  HERO_BOTTOM_PILL_ACTIVE_TOP_PX,
} from '../../constants/hero';

/** Figma node `1:59` — frosted carousel pill with sliding active indicator. */
export function HeroBottomPill() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideAnimationEnabled, setSlideAnimationEnabled] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setSlideAnimationEnabled(true);
    });
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  const indicator = getHeroBottomPillIndicator(activeIndex);

  return (
    <div
      className="relative isolate overflow-hidden rounded-full"
      style={{
        width: HERO_BOTTOM_PILL_WIDTH_PX,
        height: HERO_BOTTOM_PILL_HEIGHT_PX,
        backgroundColor: HERO_BOTTOM_PILL_BG_COLOR,
        backdropFilter: `blur(${HERO_BOTTOM_PILL_BACKDROP_BLUR_PX}px)`,
        WebkitBackdropFilter: `blur(${HERO_BOTTOM_PILL_BACKDROP_BLUR_PX}px)`,
        fontSize: HERO_BOTTOM_PILL_FONT_SIZE_PX,
        color: HERO_BOTTOM_PILL_TEXT_COLOR,
      }}
      role="tablist"
      aria-label={t('home.hero.bottomPill.label')}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full ease-in-out"
        style={{
          top: HERO_BOTTOM_PILL_ACTIVE_TOP_PX,
          left: indicator.leftPx,
          width: indicator.widthPx,
          height: HERO_BOTTOM_PILL_INNER_ACTIVE_HEIGHT_PX,
          backgroundColor: HERO_BOTTOM_PILL_PRIMARY_BG_COLOR,
          boxShadow: HERO_BOTTOM_PILL_PRIMARY_INSET_SHADOW,
          transitionProperty: 'left, width',
          transitionDuration: slideAnimationEnabled ? `${HERO_BOTTOM_PILL_SLIDE_MS}ms` : '0ms',
        }}
      />

      <div className="relative z-10 flex h-full w-full">
        {HERO_BOTTOM_PILL_TAB_KEYS.map((labelKey, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={labelKey}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(index)}
              className={`flex h-full flex-1 basis-0 items-center justify-center whitespace-nowrap text-center transition-opacity hover:opacity-90 ${
                isActive ? 'font-bold' : 'font-normal'
              }`}
              style={{
                lineHeight: `${HERO_BOTTOM_PILL_LINE_HEIGHT_PX}px`,
                color: HERO_BOTTOM_PILL_TEXT_COLOR,
              }}
            >
              {t(labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
