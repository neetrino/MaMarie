import type { CSSProperties, ReactNode } from 'react';
import { DesktopFluidFrame } from '../../../components/DesktopFluidFrame';
import { HeaderContentFrame } from '../../../components/header/HeaderContentFrame';
import {
  PRODUCTS_CATALOG_OFFSET_TOP_DESKTOP_PX,
  PRODUCTS_CATALOG_OFFSET_TOP_MOBILE_PX,
} from '../../../constants/products-catalog';
import {
  PRODUCT_PDP_CONTENT_INSET_X_DESKTOP_PX,
  PRODUCT_PDP_CONTENT_INSET_X_MOBILE_PX,
} from './constants';

const productPageOffsetStyle = {
  ['--products-catalog-offset-mobile']: `${PRODUCTS_CATALOG_OFFSET_TOP_MOBILE_PX}px`,
  ['--products-catalog-offset-desktop']: `calc(${PRODUCTS_CATALOG_OFFSET_TOP_DESKTOP_PX}px * var(--desktop-layout-scale, 1))`,
  ['--product-pdp-content-inset-mobile']: `${PRODUCT_PDP_CONTENT_INSET_X_MOBILE_PX}px`,
  ['--product-pdp-content-inset-desktop']: `${PRODUCT_PDP_CONTENT_INSET_X_DESKTOP_PX}px`,
} as CSSProperties;

interface ProductPageFrameProps {
  children: ReactNode;
  className?: string;
}

/** PDP shell — logo-to-login track inside scaled 1440px frame (closed navbar width). */
export function ProductPageFrame({ children, className = '' }: ProductPageFrameProps) {
  return (
    <div
      className={`mobile-product-page w-full max-w-full max-lg:bg-[#f1f1f3] lg:bg-white pb-12 pt-[var(--products-catalog-offset-mobile)] lg:pt-[var(--products-catalog-offset-desktop)] ${className}`.trim()}
      style={productPageOffsetStyle}
    >
      <DesktopFluidFrame>
        <HeaderContentFrame>
          <div className="px-[var(--product-pdp-content-inset-mobile)] lg:px-[var(--product-pdp-content-inset-desktop)]">
            {children}
          </div>
        </HeaderContentFrame>
      </DesktopFluidFrame>
    </div>
  );
}
