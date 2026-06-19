import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import {
  BRAND_ASSETS,
  LOGO_HEIGHT_PX,
  LOGO_HEADER_HEIGHT_PX,
  LOGO_HEADER_WIDTH_PX,
  LOGO_WIDTH_PX,
  logoWidthForHeight,
} from '../constants/brand';

export type BrandLogoSize = 'default' | 'mobile' | 'compact';

export type BrandLogoLinkProps = Omit<ComponentProps<typeof Link>, 'href' | 'children'> & {
  /** Logo footprint — default matches Figma header, mobile for small screens, compact for admin rail. */
  size?: BrandLogoSize;
};

const LOGO_MOBILE_HEIGHT_PX = 56;
const LOGO_COMPACT_HEIGHT_PX = 36;

const LOGO_FOOTPRINT: Record<BrandLogoSize, { widthPx: number; heightPx: number }> = {
  default: { widthPx: LOGO_HEADER_WIDTH_PX, heightPx: LOGO_HEADER_HEIGHT_PX },
  mobile: {
    widthPx: logoWidthForHeight(LOGO_MOBILE_HEIGHT_PX),
    heightPx: LOGO_MOBILE_HEIGHT_PX,
  },
  compact: {
    widthPx: logoWidthForHeight(LOGO_COMPACT_HEIGHT_PX),
    heightPx: LOGO_COMPACT_HEIGHT_PX,
  },
};

export function BrandLogoLink({ className = '', size = 'default', ...rest }: BrandLogoLinkProps) {
  const { widthPx, heightPx } = LOGO_FOOTPRINT[size];

  return (
    <Link
      href="/"
      title="MAMARIE"
      className={`relative block flex-shrink-0 ${className}`}
      style={{ width: widthPx, height: heightPx }}
      {...rest}
    >
      <Image
        src={BRAND_ASSETS.logo}
        alt="MAMARIE"
        width={LOGO_WIDTH_PX}
        height={LOGO_HEIGHT_PX}
        priority={size === 'default'}
        className="h-full w-full object-contain object-left"
      />
    </Link>
  );
}
