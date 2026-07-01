'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import {
  CART_DRAWER_CLOSE_EVENT,
  CART_DRAWER_MAX_WIDTH_PX,
  CART_DRAWER_MOBILE_WIDTH_PERCENT,
  CART_DRAWER_OPEN_EVENT,
  CART_DRAWER_PANEL_TRANSITION_MS,
  CART_DRAWER_PANEL_Z_INDEX,
} from '../../constants/cart-drawer';
import type { Cart } from '../../app/cart/types';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/body-scroll-lock';
import { useDrawerTransition } from '../../lib/use-drawer-transition';
import { DrawerCloseTab } from '../drawer/DrawerCloseTab';
import { CartDrawerItemRow } from './CartDrawerItemRow';
import { CartDrawerSummary } from './CartDrawerSummary';
import { CartEmptyState } from './CartEmptyState';
import { useCartState } from './useCartState';

function formatItemsCount(count: number, t: (key: string) => string): string {
  const label = count === 1 ? t('common.cart.item') : t('common.cart.items');
  return `${count} ${label}`;
}

interface CartDrawerPanelProps {
  visible: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLDivElement>;
  cart: Cart | null;
  loading: boolean;
  currency: string;
  onRemoveItem: (itemId: string) => Promise<void>;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  t: (key: string) => string;
}

function CartDrawerPanel({
  visible,
  onClose,
  panelRef,
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
    <div className="fixed inset-0 z-[90] flex justify-end overscroll-none">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className={`fixed inset-0 rounded-none bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-in-out motion-reduce:transition-none ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className={`relative h-dvh max-h-dvh w-[var(--cart-drawer-mobile-width)] sm:w-full transition-transform duration-300 ease-in-out motion-reduce:transition-none motion-reduce:duration-0 ${
          visible ? 'translate-x-0' : 'translate-x-full motion-reduce:translate-x-0'
        }`}
        style={{
          maxWidth: CART_DRAWER_MAX_WIDTH_PX,
          ['--cart-drawer-mobile-width' as string]: `${CART_DRAWER_MOBILE_WIDTH_PERCENT}%`,
        }}
      >
        <DrawerCloseTab edge="start" onClose={onClose} closeLabel={t('common.buttons.close')} />
        <aside
          className="relative flex h-full w-full flex-col overflow-hidden rounded-l-3xl bg-white shadow-2xl"
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
  const panelRef = useRef<HTMLDivElement>(null);
  const { rendered, visible } = useDrawerTransition(open, CART_DRAWER_PANEL_TRANSITION_MS);
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
    if (!rendered) {
      return;
    }

    lockBodyScroll();

    const handleTouchMove = (event: TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (panelRef.current?.contains(target)) {
        return;
      }

      event.preventDefault();
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      unlockBodyScroll();
    };
  }, [rendered]);

  useEffect(() => {
    if (!rendered) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [rendered, handleClose]);

  if (!mounted || !rendered) {
    return null;
  }

  return createPortal(
    <CartDrawerPanel
      visible={visible}
      onClose={handleClose}
      panelRef={panelRef}
      {...cartPanelProps}
    />,
    document.body,
  );
}
