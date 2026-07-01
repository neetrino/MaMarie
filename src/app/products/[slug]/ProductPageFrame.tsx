import type { CSSProperties, ReactNode } from 'react';
import { DesktopFluidFrame } from '../../../components/DesktopFluidFrame';
import { HeaderContentFrame } from '../../../components/header/HeaderContentFrame';
import {
  PRODUCTS_CATALOG_OFFSET_TOP_DESKTOP_PX,
  PRODUCTS_CATALOG_OFFSET_TOP_MOBILE_PX,
} from '../../../constants/products-catalog';

const productPageOffsetStyle = {
  ['--products-catalog-offset-mobile']: `${PRODUCTS_CATALOG_OFFSET_TOP_MOBILE_PX}px`,
  ['--products-catalog-offset-desktop']: `calc(${PRODUCTS_CATALOG_OFFSET_TOP_DESKTOP_PX}px * var(--desktop-layout-scale, 1))`,
} as CSSProperties;

interface ProductPageFrameProps {
  children: ReactNode;
  className?: string;
}

/** PDP shell — logo-to-login track inside scaled 1440px frame (closed navbar width). */
export function ProductPageFrame({ children, className = '' }: ProductPageFrameProps) {
  return (
    <div
      className={`w-full max-w-full bg-white pb-12 pt-[var(--products-catalog-offset-mobile)] lg:pt-[var(--products-catalog-offset-desktop)] ${className}`.trim()}
      style={productPageOffsetStyle}
    >
      <DesktopFluidFrame>
        <HeaderContentFrame>{children}</HeaderContentFrame>
      </DesktopFluidFrame>
    </div>
  );
}
