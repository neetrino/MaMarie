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
    <article className="border-b border-gray-100 py-4 first:pt-0 last:border-b-0">
      <div className="flex items-start gap-3">
        <Link
          href={productHref}
          onClick={handleProductNavigate}
          className="relative block shrink-0 overflow-hidden"
          style={{
            width: CART_DRAWER_ITEM_THUMB_SIZE_PX,
            height: CART_DRAWER_ITEM_THUMB_SIZE_PX,
            borderRadius: CART_DRAWER_ITEM_THUMB_RADIUS_PX,
            backgroundColor: HOME_PRODUCT_CARD_BG,
          }}
        >
          <Image
            src={imageSrc}
            alt={item.variant.product.title}
            fill
            className="object-contain p-1"
            sizes={`${CART_DRAWER_ITEM_THUMB_SIZE_PX}px`}
            unoptimized
            onError={() => setImageError(true)}
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={productHref}
                onClick={handleProductNavigate}
                className="line-clamp-2 text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
              >
                {item.variant.product.title}
              </Link>
              {item.selectedColor ? (
                <p className="mt-1 text-xs text-gray-500">
                  {t('common.ariaLabels.color').replace('{color}', item.selectedColor)}
                </p>
              ) : null}
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

          <div className="mt-2 flex justify-end">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-sky-50/70 px-1 py-1">
              <button
                type="button"
                onClick={() => handleQuantityChange(displayQuantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-white"
                aria-label={t('common.ariaLabels.decreaseQuantity')}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="min-w-[1.75rem] text-center text-sm font-semibold text-gray-900">
                {displayQuantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(displayQuantity + 1)}
                disabled={atMaxStock}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
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
