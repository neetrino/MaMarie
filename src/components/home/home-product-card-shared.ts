import type { CSSProperties } from 'react';
import {
  HOME_PRODUCT_CARD_ACTIONS_GAP_PX,
  HOME_PRODUCT_CARD_ACTIONS_HOVER_GAP_PX,
  HOME_PRODUCT_CARD_BG,
  HOME_PRODUCT_CARD_CART_ICON_HOVER_LEFT_PX,
  HOME_PRODUCT_CARD_CART_ICON_HOVER_TOP_PX,
  HOME_PRODUCT_CARD_CART_ICON_LEFT_PX,
  HOME_PRODUCT_CARD_CART_ICON_SIZE_HOVER_PX,
  HOME_PRODUCT_CARD_CART_ICON_SIZE_PX,
  HOME_PRODUCT_CARD_CART_ICON_TOP_PX,
  HOME_PRODUCT_CARD_CART_SIZE_HOVER_PX,
  HOME_PRODUCT_CARD_CART_SIZE_PX,
  HOME_PRODUCT_CARD_HOVER_BG,
  HOME_PRODUCT_CARD_IMAGE_HEIGHT_PX,
  HOME_PRODUCT_CARD_IMAGE_HOVER_HEIGHT_PX,
  HOME_PRODUCT_CARD_IMAGE_HOVER_LEFT_PX,
  HOME_PRODUCT_CARD_IMAGE_HOVER_TOP_PX,
  HOME_PRODUCT_CARD_IMAGE_HOVER_WIDTH_PX,
  HOME_PRODUCT_CARD_IMAGE_LEFT_PX,
  HOME_PRODUCT_CARD_IMAGE_TOP_PX,
  HOME_PRODUCT_CARD_IMAGE_WIDTH_PX,
  HOME_PRODUCT_CARD_LIFT_PX,
} from '../../constants/home-sections';
import { homeProductCardLayoutPx } from '../../lib/home-product-card-layout';
import type { HomeProductCardData } from './HomeProductCard';

export function resolveComparePrice(product: HomeProductCardData): number | null {
  const candidates = [product.originalPrice, product.compareAtPrice];
  for (const value of candidates) {
    if (value != null && value > product.price) {
      return value;
    }
  }
  return null;
}

/** CSS variables for `.home-product-card` hover transitions. */
export function buildHomeProductCardCssVars(layoutWidthPx?: number): CSSProperties {
  const lp = (value: number) => homeProductCardLayoutPx(value, layoutWidthPx);

  return {
    '--home-product-card-image-left-default': `${lp(HOME_PRODUCT_CARD_IMAGE_LEFT_PX)}px`,
    '--home-product-card-image-top-default': `${lp(HOME_PRODUCT_CARD_IMAGE_TOP_PX)}px`,
    '--home-product-card-image-width-default': `${lp(HOME_PRODUCT_CARD_IMAGE_WIDTH_PX)}px`,
    '--home-product-card-image-height-default': `${lp(HOME_PRODUCT_CARD_IMAGE_HEIGHT_PX)}px`,
    '--home-product-card-image-left-hover': `${lp(HOME_PRODUCT_CARD_IMAGE_HOVER_LEFT_PX)}px`,
    '--home-product-card-image-top-hover': `${lp(HOME_PRODUCT_CARD_IMAGE_HOVER_TOP_PX)}px`,
    '--home-product-card-image-width-hover': `${lp(HOME_PRODUCT_CARD_IMAGE_HOVER_WIDTH_PX)}px`,
    '--home-product-card-image-height-hover': `${lp(HOME_PRODUCT_CARD_IMAGE_HOVER_HEIGHT_PX)}px`,
    '--home-product-card-bg-default': HOME_PRODUCT_CARD_BG,
    '--home-product-card-bg-hover': HOME_PRODUCT_CARD_HOVER_BG,
    '--home-product-card-actions-gap-default': `${lp(HOME_PRODUCT_CARD_ACTIONS_GAP_PX)}px`,
    '--home-product-card-actions-gap-hover': `${lp(HOME_PRODUCT_CARD_ACTIONS_HOVER_GAP_PX)}px`,
    '--home-product-card-cart-size-default': `${lp(HOME_PRODUCT_CARD_CART_SIZE_PX)}px`,
    '--home-product-card-cart-size-hover': `${lp(HOME_PRODUCT_CARD_CART_SIZE_HOVER_PX)}px`,
    '--home-product-card-cart-icon-size-default': `${lp(HOME_PRODUCT_CARD_CART_ICON_SIZE_PX)}px`,
    '--home-product-card-cart-icon-size-hover': `${lp(HOME_PRODUCT_CARD_CART_ICON_SIZE_HOVER_PX)}px`,
    '--home-product-card-cart-icon-left-default': `${lp(HOME_PRODUCT_CARD_CART_ICON_LEFT_PX)}px`,
    '--home-product-card-cart-icon-top-default': `${lp(HOME_PRODUCT_CARD_CART_ICON_TOP_PX)}px`,
    '--home-product-card-cart-icon-left-hover': `${lp(HOME_PRODUCT_CARD_CART_ICON_HOVER_LEFT_PX)}px`,
    '--home-product-card-cart-icon-top-hover': `${lp(HOME_PRODUCT_CARD_CART_ICON_HOVER_TOP_PX)}px`,
    '--home-product-card-lift-hover': `${-lp(HOME_PRODUCT_CARD_LIFT_PX)}px`,
  } as CSSProperties;
}
