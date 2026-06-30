import type { CSSProperties, ReactNode } from 'react';
import {
  PRODUCTS_CATALOG_OFFSET_TOP_DESKTOP_PX,
  PRODUCTS_CATALOG_OFFSET_TOP_MOBILE_PX,
} from '../../../constants/products-catalog';

const productPageOffsetStyle = {
  ['--products-catalog-offset-mobile']: `${PRODUCTS_CATALOG_OFFSET_TOP_MOBILE_PX}px`,
  ['--products-catalog-offset-desktop']: `calc(${PRODUCTS_CATALOG_OFFSET_TOP_DESKTOP_PX}px * var(--desktop-layout-scale, 1))`,
} as CSSProperties;

const productPageFrameClassName =
  'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-[var(--products-catalog-offset-mobile)] lg:pt-[var(--products-catalog-offset-desktop)]';

interface ProductPageFrameProps {
  children: ReactNode;
  className?: string;
}

/** PDP outer shell — same navbar clearance as `/products` catalog. */
export function ProductPageFrame({ children, className = '' }: ProductPageFrameProps) {
  return (
    <div
      className={`${productPageFrameClassName} ${className}`.trim()}
      style={productPageOffsetStyle}
    >
      {children}
    </div>
  );
}
