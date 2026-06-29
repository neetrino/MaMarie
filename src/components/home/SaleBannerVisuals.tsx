import Image from 'next/image';
import {
  SALE_BANNER_CHILD_HEIGHT_PX,
  SALE_BANNER_CHILD_IMAGE_HEIGHT_PERCENT,
  SALE_BANNER_CHILD_IMAGE_LEFT_PERCENT,
  SALE_BANNER_CHILD_IMAGE_TOP_PERCENT,
  SALE_BANNER_CHILD_LEFT_PX,
  SALE_BANNER_CHILD_RADIUS_PX,
  SALE_BANNER_CHILD_TOP_PX,
  SALE_BANNER_CHILD_WIDTH_PX,
  SALE_BANNER_CHILD_Z_INDEX,
  SALE_BANNER_HEIGHT_PX,
  SALE_BANNER_MAX_WIDTH_PX,
  SALE_SECTION_ASSETS,
} from '../../constants/sale-section';
import { SaleBannerDecoration } from './SaleBannerDecoration';

function saleBannerPct(valuePx: number, basePx: number): string {
  return `${(valuePx / basePx) * 100}%`;
}

function SaleBannerChildPhoto() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute hidden overflow-hidden md:block"
      style={{
        left: saleBannerPct(SALE_BANNER_CHILD_LEFT_PX, SALE_BANNER_MAX_WIDTH_PX),
        top: saleBannerPct(SALE_BANNER_CHILD_TOP_PX, SALE_BANNER_HEIGHT_PX),
        width: saleBannerPct(SALE_BANNER_CHILD_WIDTH_PX, SALE_BANNER_MAX_WIDTH_PX),
        height: saleBannerPct(SALE_BANNER_CHILD_HEIGHT_PX, SALE_BANNER_HEIGHT_PX),
        borderRadius: SALE_BANNER_CHILD_RADIUS_PX,
        zIndex: SALE_BANNER_CHILD_Z_INDEX,
      }}
    >
      <Image
        src={SALE_SECTION_ASSETS.bannerChild}
        alt=""
        width={SALE_BANNER_CHILD_WIDTH_PX}
        height={SALE_BANNER_CHILD_HEIGHT_PX}
        sizes="(min-width: 768px) 628px, 0px"
        className="absolute max-w-none object-cover"
        style={{
          height: `${SALE_BANNER_CHILD_IMAGE_HEIGHT_PERCENT}%`,
          width: '100%',
          left: `${SALE_BANNER_CHILD_IMAGE_LEFT_PERCENT}%`,
          top: `${SALE_BANNER_CHILD_IMAGE_TOP_PERCENT}%`,
        }}
      />
    </div>
  );
}

/** Figma `51:363` — decorative layers behind sale banner copy. */
export function SaleBannerVisuals() {
  return (
    <>
      <SaleBannerDecoration />
      <SaleBannerChildPhoto />
    </>
  );
}
