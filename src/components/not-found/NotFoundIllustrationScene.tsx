import Image from 'next/image';
import {
  NOT_FOUND_ASSETS,
  NOT_FOUND_DECO_BUNNY_FLIP_X,
  NOT_FOUND_DECO_BUNNY_FLIP_Y,
  NOT_FOUND_DECO_BUNNY_LEFT_PERCENT,
  NOT_FOUND_DECO_BUNNY_ROTATE_DEG,
  NOT_FOUND_DECO_BUNNY_SIZE_PX,
  NOT_FOUND_DECO_BUNNY_TOP_PERCENT,
  NOT_FOUND_DECO_RIGHT_LEFT_PERCENT,
  NOT_FOUND_DECO_RIGHT_ROTATE_DEG,
  NOT_FOUND_DECO_RIGHT_TOP_PERCENT,
  NOT_FOUND_DECO_RIGHT_WIDTH_PERCENT,
  NOT_FOUND_ILLUSTRATION_HEIGHT_PX,
  NOT_FOUND_ILLUSTRATION_LIFT_PX,
  NOT_FOUND_ILLUSTRATION_MAX_WIDTH_PX,
  NOT_FOUND_ILLUSTRATION_WIDTH_PX,
} from '../../constants/not-found-page';

function buildBunnyTransform(): string {
  return [
    NOT_FOUND_DECO_BUNNY_FLIP_X ? 'scaleX(-1)' : '',
    NOT_FOUND_DECO_BUNNY_FLIP_Y ? 'scaleY(-1)' : '',
    `rotate(${NOT_FOUND_DECO_BUNNY_ROTATE_DEG}deg)`,
  ]
    .filter(Boolean)
    .join(' ');
}

/** Figma `276:676` — 404 clay art with homepage bunny and music-note overlay. */
export function NotFoundIllustrationScene() {
  return (
    <div
      className="relative w-full overflow-visible"
      style={{
        maxWidth: NOT_FOUND_ILLUSTRATION_MAX_WIDTH_PX,
        transform: `translateY(-${NOT_FOUND_ILLUSTRATION_LIFT_PX}px)`,
      }}
    >
      <Image
        src={NOT_FOUND_ASSETS.illustration}
        alt=""
        width={NOT_FOUND_ILLUSTRATION_WIDTH_PX}
        height={NOT_FOUND_ILLUSTRATION_HEIGHT_PX}
        priority
        aria-hidden
        className="h-auto w-full object-contain"
        sizes="(max-width: 1024px) 100vw, 930px"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute aspect-square"
        style={{
          left: `${NOT_FOUND_DECO_RIGHT_LEFT_PERCENT}%`,
          top: `${NOT_FOUND_DECO_RIGHT_TOP_PERCENT}%`,
          width: `${NOT_FOUND_DECO_RIGHT_WIDTH_PERCENT}%`,
          transform: `rotate(${NOT_FOUND_DECO_RIGHT_ROTATE_DEG}deg)`,
        }}
      >
        <Image
          src={NOT_FOUND_ASSETS.decoRight}
          alt=""
          fill
          className="object-contain"
          sizes="125px"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute flex items-center justify-center"
        style={{
          left: `${NOT_FOUND_DECO_BUNNY_LEFT_PERCENT}%`,
          top: `${NOT_FOUND_DECO_BUNNY_TOP_PERCENT}%`,
          width: NOT_FOUND_DECO_BUNNY_SIZE_PX,
          height: NOT_FOUND_DECO_BUNNY_SIZE_PX,
        }}
      >
        <div
          className="relative shrink-0"
          style={{
            width: NOT_FOUND_DECO_BUNNY_SIZE_PX,
            height: NOT_FOUND_DECO_BUNNY_SIZE_PX,
            transform: buildBunnyTransform(),
          }}
        >
          <Image
            src={NOT_FOUND_ASSETS.decoBunny}
            alt=""
            fill
            className="object-cover"
            sizes={`${NOT_FOUND_DECO_BUNNY_SIZE_PX}px`}
          />
        </div>
      </div>
    </div>
  );
}
