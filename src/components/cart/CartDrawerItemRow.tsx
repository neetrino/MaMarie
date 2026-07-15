'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  isCartItemAtMaxStock,
  isCartItemQuantityAboveStock,
} from '../../app/cart/cart-handlers';
import { formatCartLineAmountInCurrency } from '../../app/cart/cart-summary-labels';
import type { CartItem } from '../../app/cart/types';
import {
  CART_DRAWER_ITEM_THUMB_RADIUS_PX,
  CART_DRAWER_ITEM_THUMB_SIZE_PX,
} from '../../constants/cart-drawer';
import { HOME_PRODUCT_CARD_ASSETS, HOME_PRODUCT_CARD_BG } from '../../constants/home-sections';
import type { CurrencyCode } from '../../lib/currency';
import { closeCartDrawer } from '../../lib/cart-drawer';
import { resolveColorSwatch } from '../../lib/resolve-color-swatch';

interface CartDrawerItemRowProps {
  item: CartItem;
  currency: string;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  t: (key: string) => string;
}

export function CartDrawerItemRow({
  item,
  currency,
  onRemove,
  onUpdateQuantity,
  t,
}: CartDrawerItemRowProps) {
  const currencyCode = currency as CurrencyCode;
  const rawImage = item.variant.product.image;
  const [imageError, setImageError] = useState(false);
  const [displayQuantity, setDisplayQuantity] = useState(item.quantity);

  const imageSrc =
    rawImage && !imageError ? rawImage : HOME_PRODUCT_CARD_ASSETS.placeholderImage;

  useEffect(() => {
    setDisplayQuantity(item.quantity);
  }, [item.id, item.quantity]);

  useEffect(() => {
    setImageError(false);
  }, [rawImage]);

  const atMaxStock = isCartItemAtMaxStock(item.variant.stock, displayQuantity);
  const lineTotal = item.price * displayQuantity;

  const handleQuantityChange = (nextQuantity: number) => {
    if (nextQuantity < 1) {
      onRemove(item.id);
      return;
    }

    if (isCartItemQuantityAboveStock(item.variant.stock, nextQuantity)) {
      return;
    }

    setDisplayQuantity(nextQuantity);
    onUpdateQuantity(item.id, nextQuantity);
  };

  const productHref = `/products/${item.variant.product.slug}`;

  const handleProductNavigate = () => {
    closeCartDrawer();
  };

  return (
    <article className="mb-3 rounded-[20px] border border-gray-200 bg-white p-3 shadow-sm last:mb-0">
      <div className="flex items-stretch gap-3">
        <Link
          href={productHref}
          onClick={handleProductNavigate}
          className="relative block shrink-0 self-stretch overflow-hidden"
          style={{
            width: CART_DRAWER_ITEM_THUMB_SIZE_PX,
            minHeight: CART_DRAWER_ITEM_THUMB_SIZE_PX,
            borderRadius: CART_DRAWER_ITEM_THUMB_RADIUS_PX,
            backgroundColor: HOME_PRODUCT_CARD_BG,
          }}
        >
          <Image
            src={imageSrc}
            alt={item.variant.product.title}
            fill
            className="object-contain p-0.5"
            sizes={`${CART_DRAWER_ITEM_THUMB_SIZE_PX}px`}
            unoptimized
            onError={() => setImageError(true)}
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={productHref}
                onClick={handleProductNavigate}
                className="line-clamp-2 text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
              >
                {item.variant.product.title}
              </Link>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {formatCartLineAmountInCurrency(lineTotal, currencyCode)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label={t('common.buttons.remove')}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            {item.selectedColor ? (
              <span
                className="h-7 w-7 shrink-0 rounded-full"
                style={{ backgroundColor: resolveColorSwatch(item.selectedColor) }}
                aria-label={t('common.ariaLabels.color').replace('{color}', item.selectedColor)}
                title={item.selectedColor}
              />
            ) : null}
            {item.selectedSize ? (
              <span
                className="inline-flex h-7 min-w-[28px] shrink-0 items-center justify-center rounded-full bg-brand-pink px-2.5 text-xs font-semibold uppercase leading-none text-white shadow-sm"
                aria-label={t('common.ariaLabels.size').replace('{size}', item.selectedSize)}
                title={item.selectedSize}
              >
                {item.selectedSize}
              </span>
            ) : null}

            <div className="ml-auto inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-sky-50/70 px-0.5 py-0.5">
              <button
                type="button"
                onClick={() => handleQuantityChange(displayQuantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-white"
                aria-label={t('common.ariaLabels.decreaseQuantity')}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="min-w-[1.25rem] text-center text-sm font-semibold text-gray-900">
                {displayQuantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(displayQuantity + 1)}
                disabled={atMaxStock}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={t('common.ariaLabels.increaseQuantity')}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
