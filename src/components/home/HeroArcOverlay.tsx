import Image from 'next/image';
import {
  HERO_ARC_OFFSET_X_PX,
  HERO_ARC_OFFSET_Y_PX,
  HERO_ARC_PLACEMENT,
  HERO_ARC_Z_INDEX,
  HERO_ASSETS,
  HERO_DESIGN_HEIGHT_PX,
  HERO_DESIGN_WIDTH_PX,
  HERO_HEADLINE_SCALE,
  heroPctH,
  heroPctW,
  heroPctX,
  heroPctY,
} from '../../constants/hero';

/**
 * Full arc overlay (`shape-text-arc.png`) — above all hero layers.
 */
export function HeroArcOverlay() {
  const arcOffsetXCqw = (HERO_ARC_OFFSET_X_PX / HERO_DESIGN_WIDTH_PX) * 100;
  const arcOffsetYCqh = (HERO_ARC_OFFSET_Y_PX / HERO_DESIGN_HEIGHT_PX) * 100;

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: heroPctX(HERO_ARC_PLACEMENT.leftPx),
        top: heroPctY(HERO_ARC_PLACEMENT.topPx),
        width: heroPctW(HERO_ARC_PLACEMENT.widthPx),
        height: heroPctH(HERO_ARC_PLACEMENT.heightPx),
        zIndex: HERO_ARC_Z_INDEX,
        transformOrigin: 'top center',
        transform: `translateX(${arcOffsetXCqw}cqw) translateY(${arcOffsetYCqh}cqh) scale(${HERO_HEADLINE_SCALE})`,
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
  );
}
