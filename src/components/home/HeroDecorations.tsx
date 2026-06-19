import Image from 'next/image';
import {
  HERO_ASSETS,
  HERO_DECORATIONS,
  heroPctX,
  heroPctY,
} from '../../constants/hero';

/**
 * Rotated clay camera decorations from Figma hero frame.
 */
export function HeroDecorations() {
  return (
    <>
      {HERO_DECORATIONS.map((item) => {
        const transform = [
          item.flipY ? 'scaleY(-1)' : '',
          `rotate(${item.rotateDeg}deg)`,
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={item.assetKey}
            className="pointer-events-none absolute flex items-center justify-center"
            style={{
              left: heroPctX(item.leftPx),
              top: heroPctY(item.topPx),
              width: item.sizePx,
              height: item.sizePx,
              zIndex: item.zIndex,
            }}
          >
            <div className="flex-none" style={{ transform }}>
              <div
                className="relative"
                style={{ width: item.innerSizePx, height: item.innerSizePx }}
              >
                <Image
                  src={HERO_ASSETS[item.assetKey]}
                  alt=""
                  fill
                  sizes={`${item.innerSizePx}px`}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
