import type { CSSProperties, ReactNode } from 'react';
import {
  MOBILE_PRODUCTS_CATALOG_FRAME_BREAKOUT_LEFT_PX,
  MOBILE_PRODUCTS_CATALOG_FRAME_BREAKOUT_RIGHT_PX,
  MOBILE_PRODUCTS_CATALOG_PAGE_HORIZONTAL_PADDING_PX,
} from '../../constants/mobile-products-catalog';

const mobileProductsCatalogTrackStyle: CSSProperties = {
  width: `calc(100% + ${MOBILE_PRODUCTS_CATALOG_FRAME_BREAKOUT_LEFT_PX + MOBILE_PRODUCTS_CATALOG_FRAME_BREAKOUT_RIGHT_PX}px)`,
  marginLeft: -MOBILE_PRODUCTS_CATALOG_FRAME_BREAKOUT_LEFT_PX,
  marginRight: -MOBILE_PRODUCTS_CATALOG_FRAME_BREAKOUT_RIGHT_PX,
  paddingLeft: MOBILE_PRODUCTS_CATALOG_PAGE_HORIZONTAL_PADDING_PX,
  paddingRight: MOBILE_PRODUCTS_CATALOG_PAGE_HORIZONTAL_PADDING_PX,
};

interface MobileProductsCatalogTrackProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Breaks out of `HomeContentHorizontalFrame` to the 20px mobile navbar content track. */
export function MobileProductsCatalogTrack({
  children,
  className = '',
  style,
}: MobileProductsCatalogTrackProps) {
  return (
    <div className={className} style={{ ...mobileProductsCatalogTrackStyle, ...style }}>
      {children}
    </div>
  );
}
