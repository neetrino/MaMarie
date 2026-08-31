'use client';

import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { ProductLabels } from '../../../components/ProductLabels';
import { WishlistIcon } from '../../../components/icons/WishlistIcon';
import { t } from '../../../lib/i18n';
import type { LanguageCode } from '../../../lib/language';
import type { Product } from './types';
import {
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_LEFT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_RIGHT_CLASS,
  PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS,
  PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_INSET_PX,
  PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_SIZE_PX,
  PRODUCT_PDP_MOBILE_WISHLIST_ICON_SIZE_PX,
} from './constants';

interface ProductMainImageControlsProps {
  product: Product;
  discountPercent: number | null;
  language: LanguageCode;
  hasMultipleImages: boolean;
  isInWishlist: boolean;
  onAddToWishlist: (e: MouseEvent) => void;
  onPreviousImage: () => void;
  onNextImage: () => void;
  onOpenZoom: () => void;
}

export function ProductMainImageControls({
  product,
  discountPercent,
  language,
  hasMultipleImages,
  isInWishlist,
  onAddToWishlist,
  onPreviousImage,
  onNextImage,
  onOpenZoom,
}: ProductMainImageControlsProps) {
  return (
    <>
      {discountPercent ? (
        <div className="pointer-events-none absolute top-4 left-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
          -{discountPercent}%
        </div>
      ) : null}

      {product.labels ? <ProductLabels labels={product.labels} /> : null}

      <button
        type="button"
        onClick={onAddToWishlist}
        aria-pressed={isInWishlist}
        aria-label={
          isInWishlist
            ? t(language, 'common.ariaLabels.removeFromWishlist')
            : t(language, 'common.ariaLabels.addToWishlist')
        }
        className={`absolute z-20 flex items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-white/90 lg:hidden ${
          isInWishlist ? 'text-brand-pink' : 'text-gray-800'
        }`}
        style={{
          top: PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_INSET_PX,
          right: PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_INSET_PX,
          width: PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_SIZE_PX,
          height: PRODUCT_PDP_MOBILE_WISHLIST_BUTTON_SIZE_PX,
        }}
      >
        <WishlistIcon isActive={isInWishlist} size={PRODUCT_PDP_MOBILE_WISHLIST_ICON_SIZE_PX} />
      </button>

      {hasMultipleImages ? (
        <>
          <button
            type="button"
            onClick={onPreviousImage}
            className={`${PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS} ${PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_LEFT_CLASS}`}
            aria-label={t(language, 'common.ariaLabels.previousImage')}
          >
            <ChevronLeft aria-hidden className={PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS} />
          </button>
          <button
            type="button"
            onClick={onNextImage}
            className={`${PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_BASE_CLASS} ${PRODUCT_PDP_MAIN_IMAGE_NAV_BUTTON_RIGHT_CLASS}`}
            aria-label={t(language, 'common.ariaLabels.nextImage')}
          >
            <ChevronRight aria-hidden className={PRODUCT_PDP_MAIN_IMAGE_NAV_ICON_CLASS} />
          </button>
        </>
      ) : null}

      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-3">
        <button
          type="button"
          onClick={onOpenZoom}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
          aria-label={t(language, 'common.ariaLabels.fullscreenImage')}
        >
          <Maximize2 className="h-5 w-5 text-gray-800" />
        </button>
      </div>
    </>
  );
}
