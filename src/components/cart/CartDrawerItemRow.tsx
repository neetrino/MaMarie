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
import type { CurrencyCode } from '../../lib/currency';
import { processImageUrl } from '../../lib/utils/image-utils';
import { ProductImagePlaceholder } from '../ProductImagePlaceholder';

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
  const imageSrc = processImageUrl(item.variant.product.image);
  const [imageError, setImageError] = useState(false);
  const [displayQuantity, setDisplayQuantity] = useState(item.quantity);

  useEffect(() => {
    setDisplayQuantity(item.quantity);
  }, [item.id, item.quantity]);

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

  return (
    <article className="border-b border-gray-100 py-5 first:pt-0 last:border-b-0">
      <div className="flex items-start gap-4">
        <Link
          href={`/products/${item.variant.product.slug}`}
          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100"
        >
          {!imageSrc || imageError ? (
            <ProductImagePlaceholder
              className="h-full w-full"
              aria-label={item.variant.product.title}
            />
          ) : (
            <Image
              src={imageSrc}
              alt={item.variant.product.title}
              fill
              className="object-contain p-1"
              sizes="80px"
              unoptimized
              onError={() => setImageError(true)}
            />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/products/${item.variant.product.slug}`}
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

          <div className="mt-3 flex justify-end">
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
