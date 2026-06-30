'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CART_DRAWER_CLOSE_BUTTON_TOP_PX,
  CART_DRAWER_CLOSE_EVENT,
  CART_DRAWER_CLOSE_ICON_OFFSET_X_PX,
  CART_DRAWER_CLOSE_ICON_SIZE_PX,
  CART_DRAWER_CLOSE_ICON_STROKE_WIDTH,
  CART_DRAWER_CLOSE_TAB_HEIGHT_PX,
  CART_DRAWER_CLOSE_TAB_WIDTH_PX,
  CART_DRAWER_CLOSE_TAB_Z_INDEX,
  CART_DRAWER_MAX_WIDTH_PX,
  CART_DRAWER_OPEN_EVENT,
  CART_DRAWER_PANEL_Z_INDEX,
  CART_DRAWER_Z_INDEX,
} from '../../constants/cart-drawer';
import type { Cart } from '../../app/cart/types';
import { CartDrawerItemRow } from './CartDrawerItemRow';
import { CartDrawerSummary } from './CartDrawerSummary';
import { CartEmptyState } from './CartEmptyState';
import { useCartState } from './useCartState';

function formatItemsCount(count: number, t: (key: string) => string): string {
  const label = count === 1 ? t('common.cart.item') : t('common.cart.items');
  return `${count} ${label}`;
}

interface CartDrawerPanelProps {
  onClose: () => void;
  cart: Cart | null;
  loading: boolean;
  currency: string;
  onRemoveItem: (itemId: string) => Promise<void>;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  t: (key: string) => string;
}

function CartDrawerCloseTab({
  onClose,
  closeLabel,
}: {
  onClose: () => void;
  closeLabel: string;
}) {
  const tabRadiusPx = CART_DRAWER_CLOSE_TAB_HEIGHT_PX / 2;

  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute flex items-center justify-center bg-brand-pink text-white"
      style={{
        top: CART_DRAWER_CLOSE_BUTTON_TOP_PX,
        left: 0,
        zIndex: CART_DRAWER_CLOSE_TAB_Z_INDEX,
        width: CART_DRAWER_CLOSE_TAB_WIDTH_PX,
        height: CART_DRAWER_CLOSE_TAB_HEIGHT_PX,
        transform: 'translateX(-50%)',
        borderRadius: tabRadiusPx,
        paddingRight: CART_DRAWER_CLOSE_TAB_WIDTH_PX / 2,
      }}
      aria-label={closeLabel}
    >
      <svg
        width={CART_DRAWER_CLOSE_ICON_SIZE_PX}
        height={CART_DRAWER_CLOSE_ICON_SIZE_PX}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={CART_DRAWER_CLOSE_ICON_STROKE_WIDTH}
        aria-hidden
        style={{ transform: `translateX(${CART_DRAWER_CLOSE_ICON_OFFSET_X_PX}px)` }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

function CartDrawerPanel({
  onClose,
  cart,
  loading,
  currency,
  onRemoveItem,
  onUpdateQuantity,
  t,
}: CartDrawerPanelProps) {
  const hasItems = Boolean(cart && cart.items.length > 0);
  const showLoading = loading && !hasItems;
  const headerItemsCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <div
      className="fixed inset-0 flex justify-end bg-black/40 backdrop-blur-sm"
      style={{ zIndex: CART_DRAWER_Z_INDEX }}
      onClick={onClose}
    >
      <div
        className="relative h-dvh max-h-dvh w-full"
        style={{ maxWidth: CART_DRAWER_MAX_WIDTH_PX }}
      >
        <CartDrawerCloseTab onClose={onClose} closeLabel={t('common.buttons.close')} />
        <aside
          className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl max-sm:rounded-none sm:rounded-l-3xl"
          style={{ zIndex: CART_DRAWER_PANEL_Z_INDEX }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          onClick={(event) => event.stopPropagation()}
        >
        <header className="flex items-center border-b border-gray-100 px-6 py-5">
          <div className="flex min-h-10 flex-col justify-center">
            <h2 id="cart-drawer-title" className="text-xl font-bold leading-tight text-gray-900">
              {t('common.cart.title')}
            </h2>
            {headerItemsCount > 0 ? (
              <p className="mt-1 text-sm text-gray-500">
                {formatItemsCount(headerItemsCount, t)}
              </p>
            ) : null}
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          {showLoading ? (
            <div className="flex-1 px-6 py-8">
              <div className="animate-pulse space-y-6">
                <div className="h-20 rounded-xl bg-gray-100" />
                <div className="h-20 rounded-xl bg-gray-100" />
              </div>
            </div>
          ) : !hasItems ? (
            <CartEmptyState t={t} onCtaClick={onClose} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart?.items.map((item) => (
                  <CartDrawerItemRow
                    key={item.id}
                    item={item}
                    currency={currency}
                    onRemove={onRemoveItem}
                    onUpdateQuantity={onUpdateQuantity}
                    t={t}
                  />
                ))}
              </div>
              {cart ? <CartDrawerSummary cart={cart} currency={currency} t={t} /> : null}
            </>
          )}
        </div>
      </aside>
      </div>
    </div>
  );
}

/** Global cart drawer — slides in from the right when `openCartDrawer()` is called. */
export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartState = useCartState({ enabled: true });
  const { refreshCart, ...cartPanelProps } = cartState;

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    const handleCloseEvent = () => setOpen(false);

    window.addEventListener(CART_DRAWER_OPEN_EVENT, handleOpen);
    window.addEventListener(CART_DRAWER_CLOSE_EVENT, handleCloseEvent);

    return () => {
      window.removeEventListener(CART_DRAWER_OPEN_EVENT, handleOpen);
      window.removeEventListener(CART_DRAWER_CLOSE_EVENT, handleCloseEvent);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    refreshCart(false);
  }, [open, refreshCart]);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, handleClose]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <CartDrawerPanel onClose={handleClose} {...cartPanelProps} />,
    document.body,
  );
}
