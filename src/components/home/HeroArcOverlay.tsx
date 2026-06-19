import Image from 'next/image';
import {
  HERO_ARC_OFFSET_X_PX,
  HERO_ARC_PLACEMENT,
  HERO_ARC_Z_INDEX,
  HERO_ASSETS,
  heroPctH,
  heroPctW,
  heroPctX,
  heroPctY,
} from '../../constants/hero';

/**
 * Full arc overlay (`shape-text-arc.png`) — above all hero layers.
 */
export function HeroArcOverlay() {
  return (
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{
        left: heroPctX(HERO_ARC_PLACEMENT.leftPx + HERO_ARC_OFFSET_X_PX),
        top: heroPctY(HERO_ARC_PLACEMENT.topPx),
        width: heroPctW(HERO_ARC_PLACEMENT.widthPx),
        height: heroPctH(HERO_ARC_PLACEMENT.heightPx),
        zIndex: HERO_ARC_Z_INDEX,
      }}
    >
      <Image
        src={HERO_ASSETS.shapeTextArc}
        alt="Shape your childhood"
        width={HERO_ARC_PLACEMENT.widthPx}
        height={HERO_ARC_PLACEMENT.heightPx}
        priority
        className="h-full w-full object-cover mix-blend-screen"
      />
    </div>
  );
}
