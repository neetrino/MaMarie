import Image from 'next/image';
import {
  HERO_ASSETS,
  HERO_DECORATIONS,
  heroPctH,
  heroPctW,
  heroPctX,
  heroPctY,
} from '../../constants/hero';

/**
 * Floating clay decorations (star, bunny, music notes).
 */
export function HeroDecorations() {
  return (
    <>
      {HERO_DECORATIONS.map((item) => {
        const transform = [
          item.flipY ? 'scaleY(-1)' : '',
          item.rotateDeg !== undefined ? `rotate(${item.rotateDeg}deg)` : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={item.assetKey}
            className="pointer-events-none absolute"
            style={{
              left: heroPctX(item.leftPx),
              top: heroPctY(item.topPx),
              width: heroPctW(item.widthPx),
              height: heroPctH(item.heightPx),
              zIndex: item.zIndex,
              transform: transform || undefined,
            }}
          >
            <div className="relative h-full w-full">
              <Image
                src={HERO_ASSETS[item.assetKey]}
                alt=""
                fill
                sizes={`${item.widthPx}px`}
                className="object-contain"
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
