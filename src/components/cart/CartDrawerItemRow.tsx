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

function resolveColorSwatch(color: string | null | undefined): string {
  if (!color) {
    return '#cbd5e1';
  }

  const value = color.trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) || /^(rgb|hsl)a?\(/i.test(value)) {
    return color;
  }

  const colorMap: Record<string, string> = {
    white: '#ffffff',
    black: '#111827',
    beige: '#f5f5dc',
    cream: '#fff7d6',
    ivory: '#fffff0',
    gray: '#9ca3af',
    grey: '#9ca3af',
    blue: '#3b82f6',
    red: '#ef4444',
    green: '#22c55e',
    pink: '#ec4899',
    brown: '#92400e',
    yellow: '#facc15',
    orange: '#f97316',
    purple: '#a855f7',
    navy: '#1e3a8a',
    'белый': '#ffffff',
    'черный': '#111827',
    'чёрный': '#111827',
    'бежевый': '#f5f5dc',
    'серый': '#9ca3af',
    'синий': '#3b82f6',
    'красный': '#ef4444',
    'зеленый': '#22c55e',
    'зелёный': '#22c55e',
    'розовый': '#ec4899',
    'коричневый': '#92400e',
    'желтый': '#facc15',
    'жёлтый': '#facc15',
    'оранжевый': '#f97316',
    'фиолетовый': '#a855f7',
    'սպիտակ': '#ffffff',
    'սև': '#111827',
    'սեւ': '#111827',
    'բեժ': '#f5f5dc',
    'մոխրագույն': '#9ca3af',
    'կապույտ': '#3b82f6',
    'կարմիր': '#ef4444',
    'կանաչ': '#22c55e',
    'վարդագույն': '#ec4899',
    'շագանակագույն': '#92400e',
    'դեղին': '#facc15',
    'նարնջագույն': '#f97316',
    'մանուշակագույն': '#a855f7',
  };

  return colorMap[value] ?? '#cbd5e1';
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
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {formatCartLineAmountInCurrency(lineTotal, currencyCode)}
              </p>
              {(item.selectedColor || item.selectedSize) ? (
                <div className="mt-1 flex items-center gap-2">
                  {item.selectedColor ? (
                    <span
                      className="h-5 w-5 rounded-full"
                      style={{ backgroundColor: resolveColorSwatch(item.selectedColor) }}
                      aria-label={t('common.ariaLabels.color').replace('{color}', item.selectedColor)}
                      title={item.selectedColor}
                    />
                  ) : null}
                  {item.selectedSize ? (
                    <span
                      className="inline-flex min-h-[24px] min-w-[24px] items-center justify-center rounded-full bg-brand-pink px-2.5 text-xs font-semibold uppercase leading-none text-white shadow-sm"
                      aria-label={t('common.ariaLabels.size').replace('{size}', item.selectedSize)}
                      title={item.selectedSize}
                    >
                      {item.selectedSize}
                    </span>
                  ) : null}
                </div>
              ) : null}
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
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-white"
                aria-label={t('common.ariaLabels.decreaseQuantity')}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-semibold text-gray-900">
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
