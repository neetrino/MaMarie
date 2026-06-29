'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps, CSSProperties, MouseEvent } from 'react';
import {
  BRAND_ASSETS,
  LOGO_HEADER_HEIGHT_PX,
  LOGO_HEADER_WIDTH_PX,
  LOGO_HEIGHT_PX,
  LOGO_WIDTH_PX,
  logoNavbarWidthForHeight,
} from '../constants/brand';
import {
  HEADER_MOBILE_LOGO_CROP_HEIGHT_PERCENT,
  HEADER_MOBILE_LOGO_CROP_TOP_PERCENT,
  HEADER_MOBILE_LOGO_CROP_WIDTH_PERCENT,
  HEADER_MOBILE_LOGO_HEIGHT_PX,
  HEADER_MOBILE_LOGO_WIDTH_PX,
} from '../constants/header';

export type BrandLogoSize = 'default' | 'mobile' | 'compact';

export type BrandLogoLinkProps = Omit<ComponentProps<typeof Link>, 'href' | 'children'> & {
  /** Logo footprint — default matches Figma header, mobile for small screens, compact for admin rail. */
  size?: BrandLogoSize;
};

const LOGO_COMPACT_HEIGHT_PX = 32;

const LOGO_FOOTPRINT: Record<BrandLogoSize, { widthPx: number; heightPx: number }> = {
  default: { widthPx: LOGO_HEADER_WIDTH_PX, heightPx: LOGO_HEADER_HEIGHT_PX },
  mobile: {
    widthPx: HEADER_MOBILE_LOGO_WIDTH_PX,
    heightPx: HEADER_MOBILE_LOGO_HEIGHT_PX,
  },
  compact: {
    widthPx: logoNavbarWidthForHeight(LOGO_COMPACT_HEIGHT_PX),
    heightPx: LOGO_COMPACT_HEIGHT_PX,
  },
};

const mobileLogoCropStyle: CSSProperties = {
  width: `${HEADER_MOBILE_LOGO_CROP_WIDTH_PERCENT}%`,
  height: `${HEADER_MOBILE_LOGO_CROP_HEIGHT_PERCENT}%`,
  top: `${HEADER_MOBILE_LOGO_CROP_TOP_PERCENT}%`,
  left: 0,
};

export function BrandLogoLink({
  className = '',
  size = 'default',
  onClick,
  style: styleProp,
  ...rest
}: BrandLogoLinkProps) {
  const pathname = usePathname() ?? '';
  const { widthPx, heightPx } = LOGO_FOOTPRINT[size];

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || pathname !== '/') {
      return;
    }

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link
      href="/"
      title="MAMARIE"
      aria-label="MAMARIE"
      className={`relative block shrink-0 overflow-hidden ${className}`}
      style={{ width: widthPx, height: heightPx, ...styleProp }}
      onClick={handleClick}
      {...rest}
    >
      {size === 'mobile' ? (
        <Image
          src={BRAND_ASSETS.logoNavbarMobile}
          alt="MAMARIE"
          width={HEADER_MOBILE_LOGO_WIDTH_PX}
          height={HEADER_MOBILE_LOGO_HEIGHT_PX}
          priority
          className="pointer-events-none absolute max-w-none"
          style={mobileLogoCropStyle}
        />
      ) : (
        <Image
          src={BRAND_ASSETS.logoNavbar}
          alt="MAMARIE"
          width={LOGO_WIDTH_PX}
          height={LOGO_HEIGHT_PX}
          priority={size === 'default'}
          className="h-full w-full object-contain object-left"
        />
      )}
    </Link>
  );
}
