'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CART_DRAWER_CLOSE_EVENT,
  CART_DRAWER_MAX_WIDTH_PX,
  CART_DRAWER_OPEN_EVENT,
  CART_DRAWER_Z_INDEX,
} from '../../constants/cart-drawer';
import type { Cart } from '../../app/cart/types';
import { CartDrawerItemRow } from './CartDrawerItemRow';
import { CartDrawerSummary } from './CartDrawerSummary';
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
      <aside
        className="flex h-dvh max-h-dvh w-full max-w-full flex-col overflow-hidden bg-white shadow-2xl max-sm:rounded-none sm:rounded-l-3xl"
        style={{ maxWidth: CART_DRAWER_MAX_WIDTH_PX }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 id="cart-drawer-title" className="text-xl font-bold text-gray-900">
              {t('common.cart.title')}
            </h2>
            {headerItemsCount > 0 ? (
              <p className="mt-1 text-sm text-gray-500">
                {formatItemsCount(headerItemsCount, t)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
            aria-label={t('common.buttons.close')}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
              <p className="text-lg font-semibold text-gray-900">{t('common.cart.empty')}</p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-6 rounded-2xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                {t('common.buttons.browseProducts')}
              </Link>
            </div>
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
