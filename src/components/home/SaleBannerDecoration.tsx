import {
  SALE_BANNER_DECORATION_IMAGE_HEIGHT_PERCENT,
  SALE_BANNER_DECORATION_IMAGE_LEFT_PERCENT,
  SALE_BANNER_DECORATION_IMAGE_TOP_PERCENT,
  SALE_BANNER_DECORATION_IMAGE_WIDTH_PERCENT,
  SALE_BANNER_DECORATION_INNER_HEIGHT_RATIO,
  SALE_BANNER_DECORATION_INNER_WIDTH_RATIO,
  SALE_BANNER_DECORATION_LEFT_PX,
  SALE_BANNER_DECORATION_ROTATE_DEG,
  SALE_BANNER_DECORATION_TOP_PX,
  SALE_BANNER_DECORATION_WRAPPER_HEIGHT_PX,
  SALE_BANNER_DECORATION_WRAPPER_WIDTH_PX,
  SALE_BANNER_DECORATION_Z_INDEX,
  SALE_BANNER_HEIGHT_PX,
  SALE_BANNER_MAX_WIDTH_PX,
  SALE_SECTION_ASSETS,
} from '../../constants/sale-section';

function saleBannerPct(valuePx: number, basePx: number): string {
  return `${(valuePx / basePx) * 100}%`;
}

/** Figma `51:364` — cropped dress image. */
function SaleBannerDecorationImage() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        alt=""
        src={SALE_SECTION_ASSETS.bannerDecoration}
        loading="lazy"
        decoding="async"
        className="absolute max-w-none object-cover"
        style={{
          height: `${SALE_BANNER_DECORATION_IMAGE_HEIGHT_PERCENT}%`,
          width: `${SALE_BANNER_DECORATION_IMAGE_WIDTH_PERCENT}%`,
          left: `${SALE_BANNER_DECORATION_IMAGE_LEFT_PERCENT}%`,
          top: `${SALE_BANNER_DECORATION_IMAGE_TOP_PERCENT}%`,
        }}
      />
    </div>
  );
}

/** Figma `51:364` — rotated dress decoration on sale banner (`51:363`). */
export function SaleBannerDecoration() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute flex items-center justify-center"
      style={{
        left: saleBannerPct(SALE_BANNER_DECORATION_LEFT_PX, SALE_BANNER_MAX_WIDTH_PX),
        top: saleBannerPct(SALE_BANNER_DECORATION_TOP_PX, SALE_BANNER_HEIGHT_PX),
        width: saleBannerPct(SALE_BANNER_DECORATION_WRAPPER_WIDTH_PX, SALE_BANNER_MAX_WIDTH_PX),
        height: saleBannerPct(SALE_BANNER_DECORATION_WRAPPER_HEIGHT_PX, SALE_BANNER_HEIGHT_PX),
        zIndex: SALE_BANNER_DECORATION_Z_INDEX,
      }}
    >
      <div
        className="flex-none"
        style={{
          transform: `rotate(${SALE_BANNER_DECORATION_ROTATE_DEG}deg)`,
          width: `${SALE_BANNER_DECORATION_INNER_WIDTH_RATIO * 100}%`,
          height: `${SALE_BANNER_DECORATION_INNER_HEIGHT_RATIO * 100}%`,
        }}
      >
        <SaleBannerDecorationImage />
      </div>
    </div>
  );
}
