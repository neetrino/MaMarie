'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Cart, CartItem } from '../../cart/types';
import { CHECKOUT_ORDER_ITEMS_THUMB_SIZE_PX } from '../../../constants/checkout-page';
import { HOME_PRODUCT_CARD_ASSETS, HOME_PRODUCT_CARD_BG } from '../../../constants/home-sections';
import {
  CHECKOUT_ORDER_ITEMS_NAME_CLASS,
  CHECKOUT_ORDER_ITEMS_PREVIEW_CARD_CLASS,
  CHECKOUT_ORDER_ITEMS_PREVIEW_COUNT_CLASS,
  CHECKOUT_ORDER_ITEMS_PREVIEW_LIST_CLASS,
  CHECKOUT_ORDER_ITEMS_PREVIEW_TITLE_CLASS,
  CHECKOUT_ORDER_ITEMS_REMOVE_BUTTON_CLASS,
  CHECKOUT_ORDER_ITEMS_THUMB_FRAME_CLASS,
} from '../constants/checkout-ui';

interface CheckoutOrderItemsPreviewProps {
  cart: Cart;
  onRemoveItem: (itemId: string) => void;
  t: (key: string) => string;
  className?: string;
}

function CheckoutOrderItemPreview({
  item,
  onRemove,
  removeLabel,
}: {
  item: CartItem;
  onRemove: (itemId: string) => void;
  removeLabel: string;
}) {
  const rawImage = item.variant.product.image;
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    rawImage && !imageError ? rawImage : HOME_PRODUCT_CARD_ASSETS.placeholderImage;

  useEffect(() => {
    setImageError(false);
  }, [rawImage]);

  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="relative">
        <div
          className={CHECKOUT_ORDER_ITEMS_THUMB_FRAME_CLASS}
          style={{
            width: CHECKOUT_ORDER_ITEMS_THUMB_SIZE_PX,
            height: CHECKOUT_ORDER_ITEMS_THUMB_SIZE_PX,
            backgroundColor: HOME_PRODUCT_CARD_BG,
          }}
        >
          <Image
            src={imageSrc}
            alt={item.variant.product.title}
            fill
            className="object-contain p-1.5"
            sizes={`${CHECKOUT_ORDER_ITEMS_THUMB_SIZE_PX}px`}
            unoptimized
            onError={() => setImageError(true)}
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className={CHECKOUT_ORDER_ITEMS_REMOVE_BUTTON_CLASS}
          aria-label={removeLabel}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className={CHECKOUT_ORDER_ITEMS_NAME_CLASS}>{item.variant.product.title}</p>
    </div>
  );
}

/** Top-of-checkout preview — what the customer is ordering. */
export function CheckoutOrderItemsPreview({
  cart,
  onRemoveItem,
  t,
  className = '',
}: CheckoutOrderItemsPreviewProps) {
  const itemsLabel =
    cart.itemsCount === 1 ? t('common.cart.item') : t('common.cart.items');

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
            onRemove={onRemoveItem}
            removeLabel={t('common.ariaLabels.removeItem')}
          />
        ))}
      </div>
    </section>
  );
}
