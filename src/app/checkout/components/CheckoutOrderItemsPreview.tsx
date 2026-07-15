'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { formatCartLineAmountInCurrency } from '../../cart/cart-summary-labels';
import type { Cart, CartItem } from '../../cart/types';
import {
  CART_DRAWER_ITEM_THUMB_RADIUS_PX,
  CART_DRAWER_ITEM_THUMB_SIZE_PX,
} from '../../../constants/cart-drawer';
import {
  CHECKOUT_ORDER_ITEM_CARD_MAX_WIDTH_PX,
  CHECKOUT_ORDER_ITEM_CARD_MIN_WIDTH_PX,
  CHECKOUT_ORDER_ITEM_TITLE_MAX_WIDTH_PX,
} from '../../../constants/checkout-page';
import { HOME_PRODUCT_CARD_ASSETS, HOME_PRODUCT_CARD_BG } from '../../../constants/home-sections';
import type { CurrencyCode } from '../../../lib/currency';
import { resolveColorSwatch } from '../../../lib/resolve-color-swatch';
import {
  CHECKOUT_ORDER_ITEM_CARD_CLASS,
  CHECKOUT_ORDER_ITEMS_COLOR_SWATCH_CLASS,
  CHECKOUT_ORDER_ITEMS_NAME_CLASS,
  CHECKOUT_ORDER_ITEMS_PREVIEW_CARD_CLASS,
  CHECKOUT_ORDER_ITEMS_PREVIEW_COUNT_CLASS,
  CHECKOUT_ORDER_ITEMS_PREVIEW_LIST_CLASS,
  CHECKOUT_ORDER_ITEMS_PREVIEW_TITLE_CLASS,
  CHECKOUT_ORDER_ITEMS_PRICE_CLASS,
  CHECKOUT_ORDER_ITEMS_QTY_CLASS,
  CHECKOUT_ORDER_ITEMS_REMOVE_BUTTON_CLASS,
  CHECKOUT_ORDER_ITEMS_SIZE_PILL_CLASS,
  CHECKOUT_ORDER_ITEMS_THUMB_FRAME_CLASS,
  CHECKOUT_ORDER_ITEMS_VARIANT_ROW_CLASS,
} from '../constants/checkout-ui';

interface CheckoutOrderItemsPreviewProps {
  cart: Cart;
  currency: string;
  onRemoveItem: (itemId: string) => void;
  t: (key: string) => string;
  className?: string;
}

function CheckoutOrderItemPreview({
  item,
  currency,
  onRemove,
  t,
}: {
  item: CartItem;
  currency: CurrencyCode;
  onRemove: (itemId: string) => void;
  t: (key: string) => string;
}) {
  const rawImage = item.variant.product.image;
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    rawImage && !imageError ? rawImage : HOME_PRODUCT_CARD_ASSETS.placeholderImage;
  const lineTotal = item.price * item.quantity;

  useEffect(() => {
    setImageError(false);
  }, [rawImage]);

  return (
    <article
      className={CHECKOUT_ORDER_ITEM_CARD_CLASS}
      style={{
        minWidth: CHECKOUT_ORDER_ITEM_CARD_MIN_WIDTH_PX,
        maxWidth: CHECKOUT_ORDER_ITEM_CARD_MAX_WIDTH_PX,
        ['--checkout-order-item-title-max-width' as string]: `${CHECKOUT_ORDER_ITEM_TITLE_MAX_WIDTH_PX}px`,
      }}
    >
      <div className="flex items-stretch gap-3">
        <div
          className={CHECKOUT_ORDER_ITEMS_THUMB_FRAME_CLASS}
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
        </div>

        <div className="flex w-max min-w-0 max-w-full flex-1 flex-col justify-between gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="w-max min-w-0 max-w-full">
              <p className={CHECKOUT_ORDER_ITEMS_NAME_CLASS}>{item.variant.product.title}</p>
              <p className={CHECKOUT_ORDER_ITEMS_PRICE_CLASS}>
                {formatCartLineAmountInCurrency(lineTotal, currency)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className={CHECKOUT_ORDER_ITEMS_REMOVE_BUTTON_CLASS}
              aria-label={t('common.buttons.remove')}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={CHECKOUT_ORDER_ITEMS_VARIANT_ROW_CLASS}>
            {item.selectedColor ? (
              <span
                className={CHECKOUT_ORDER_ITEMS_COLOR_SWATCH_CLASS}
                style={{ backgroundColor: resolveColorSwatch(item.selectedColor) }}
                aria-label={t('common.ariaLabels.color').replace('{color}', item.selectedColor)}
                title={item.selectedColor}
              />
            ) : null}
            {item.selectedSize ? (
              <span
                className={CHECKOUT_ORDER_ITEMS_SIZE_PILL_CLASS}
                aria-label={t('common.ariaLabels.size').replace('{size}', item.selectedSize)}
                title={item.selectedSize}
              >
                {item.selectedSize}
              </span>
            ) : null}
            <span className={CHECKOUT_ORDER_ITEMS_QTY_CLASS}>
              ×{item.quantity}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Top-of-checkout preview — cart-style item cards. */
export function CheckoutOrderItemsPreview({
  cart,
  currency,
  onRemoveItem,
  t,
  className = '',
}: CheckoutOrderItemsPreviewProps) {
  const itemsLabel =
    cart.itemsCount === 1 ? t('common.cart.item') : t('common.cart.items');
  const currencyCode = currency as CurrencyCode;

  return (
    <section
      className={`${CHECKOUT_ORDER_ITEMS_PREVIEW_CARD_CLASS} ${className}`.trim()}
      aria-labelledby="checkout-order-items-preview-title"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="checkout-order-items-preview-title" className={CHECKOUT_ORDER_ITEMS_PREVIEW_TITLE_CLASS}>
          {t('checkout.orderItemsPreview.title')}
        </h2>
        <p className={CHECKOUT_ORDER_ITEMS_PREVIEW_COUNT_CLASS}>
          {cart.itemsCount} {itemsLabel}
        </p>
      </div>

      <div className={CHECKOUT_ORDER_ITEMS_PREVIEW_LIST_CLASS}>
        {cart.items.map((item) => (
          <CheckoutOrderItemPreview
            key={item.id}
            item={item}
            currency={currencyCode}
            onRemove={onRemoveItem}
            t={t}
          />
        ))}
      </div>
    </section>
  );
}
