import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { BRAND_ASSETS, LOGO_HEIGHT_PX, LOGO_WIDTH_PX } from '../constants/brand';

export type BrandLogoSize = 'default' | 'mobile' | 'compact';

export type BrandLogoLinkProps = Omit<ComponentProps<typeof Link>, 'href' | 'children'> & {
  /** Logo footprint — default matches Figma header, mobile for small screens, compact for admin rail. */
  size?: BrandLogoSize;
};

const SIZE_CLASS: Record<BrandLogoSize, string> = {
  default: 'h-[89px] w-[78px]',
  mobile: 'h-14 w-[62px]',
  compact: 'h-9 w-9',
};

export function BrandLogoLink({ className = '', size = 'default', ...rest }: BrandLogoLinkProps) {
  const sizeClass = SIZE_CLASS[size];

  return (
    <Link
      href="/"
      title="MAMARIE"
      className={`relative flex flex-shrink-0 items-center overflow-hidden ${sizeClass} ${className}`}
      {...rest}
    >
      <Image
        src={BRAND_ASSETS.logo}
        alt="MAMARIE"
        width={LOGO_WIDTH_PX}
        height={LOGO_HEIGHT_PX}
        className="absolute left-0 top-0 h-full w-[198%] max-w-none object-left"
        priority={size === 'default'}
      />
    </Link>
  );
}
