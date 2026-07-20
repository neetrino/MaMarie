'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties, MouseEvent } from 'react';
import {
  ADMIN_SIDEBAR_HEADER_LOGO_HEIGHT_PX,
  ADMIN_SIDEBAR_HEADER_LOGO_WIDTH_PX,
} from '../app/supersudo/admin-sidebar-classes';
import { BRAND_ASSETS } from '../constants/brand';

const LOGO_ADMIN_SIDEBAR_SOURCE_WIDTH_PX = 931;
const LOGO_ADMIN_SIDEBAR_SOURCE_HEIGHT_PX = 413;

type AdminBrandLogoLinkProps = {
  className?: string;
  heightPx?: number;
  widthPx?: number;
};

/** Admin panel logo — stacked clay ma/marie wordmark. */
export function AdminBrandLogoLink({
  className = '',
  heightPx = ADMIN_SIDEBAR_HEADER_LOGO_HEIGHT_PX,
  widthPx = ADMIN_SIDEBAR_HEADER_LOGO_WIDTH_PX,
}: AdminBrandLogoLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.push('/', { scroll: true });
  };

  const style: CSSProperties = {
    width: widthPx,
    height: heightPx,
  };

  return (
    <Link
      href="/"
      title="MAMARIE"
      aria-label="MAMARIE"
      className={`relative block shrink-0 overflow-hidden leading-none ${className}`.trim()}
      style={style}
      onClick={handleClick}
    >
      <Image
        src={BRAND_ASSETS.logoAdminSidebar}
        alt="MAMARIE"
        width={LOGO_ADMIN_SIDEBAR_SOURCE_WIDTH_PX}
        height={LOGO_ADMIN_SIDEBAR_SOURCE_HEIGHT_PX}
        priority
        className="h-full w-full object-contain object-left"
      />
    </Link>
  );
}
