'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCart } from '../../app/cart/cart-fetcher';
import { handleRemoveItem, handleUpdateQuantity } from '../../app/cart/cart-handlers';
import type { Cart, CartItem } from '../../app/cart/types';
import type { CartUpdatedDetail } from '../../lib/cart-events';
import { CART_UPDATED_EVENT, dispatchCartUpdated } from '../../lib/cart-events';
import { getStoredCurrency, DEFAULT_CURRENCY } from '../../lib/currency';
import {
  getInstantCartDisplay,
  getGuestCartFromStorage,
  readCartSnapshot,
  writeCartSnapshot,
} from '../../lib/guest-cart-storage';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';

interface UseCartStateOptions {
  enabled: boolean;
}

function buildSingleItemCart(item: CartItem, cartSummary?: CartUpdatedDetail['cartSummary']): Cart {
  const subtotal = cartSummary?.total ?? item.total;
  return {
    id: 'optimistic-cart',
    items: [item],
    totals: {
      subtotal,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: subtotal,
      currency: 'AMD',
    },
    itemsCount: cartSummary?.itemsCount ?? item.quantity,
  };
}

function isSameCartLine(item: CartItem, optimisticItem: CartItem): boolean {
  return (
    item.id === optimisticItem.id ||
    (
      item.variant.id === optimisticItem.variant.id &&
      item.variant.product.id === optimisticItem.variant.product.id
    )
  );
}

function upsertOptimisticCartItem(
  cart: Cart | null,
  optimisticItem: CartItem,
  cartSummary?: CartUpdatedDetail['cartSummary'],
): Cart {
  if (!cart) {
    return buildSingleItemCart(optimisticItem, cartSummary);
  }

  const hasItem = cart.items.some((item) => isSameCartLine(item, optimisticItem));
  const items = hasItem
    ? cart.items.map((item) => {
      if (!isSameCartLine(item, optimisticItem)) {
        return item;
      }

      if (!optimisticItem.id.startsWith('optimistic-')) {
        return optimisticItem;
      }

      const quantity = item.quantity + optimisticItem.quantity;
      return {
        ...optimisticItem,
        id: item.id,
        quantity,
        total: optimisticItem.price * quantity,
      };
    })
    : [...cart.items, optimisticItem];
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return {
    ...cart,
    items,
    totals: {
      ...cart.totals,
      subtotal,
      total: subtotal + cart.totals.tax + cart.totals.shipping - cart.totals.discount,
    },
    itemsCount: cartSummary?.itemsCount ?? items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function useCartState({ enabled }: UseCartStateOptions) {
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const productLabel = t('common.messages.product');

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const cartLoadRequestRef = useRef(0);
  const hasPendingOptimisticCartRef = useRef(false);

  const syncCartFromLocal = useCallback(() => {
    const localCart = getInstantCartDisplay(isLoggedIn, productLabel);
    if (localCart) {
      setCart(localCart);
      return localCart;
    }

    if (!isLoggedIn) {
      setCart(null);
    }

    return null;
  }, [isLoggedIn, productLabel]);

  const loadCart = useCallback(
    async (silent = false, skipInstantSync = false) => {
      const requestId = cartLoadRequestRef.current + 1;
      cartLoadRequestRef.current = requestId;
      const isCurrentRequest = () => cartLoadRequestRef.current === requestId;

      if (!isLoggedIn) {
        syncCartFromLocal();

        if (silent) {
          return;
        }

        const instantCart = getGuestCartFromStorage(productLabel);
        if (!instantCart) {
          setLoading(true);
        }

        try {
          const cartData = await fetchCart(isLoggedIn, t);
          if (!isCurrentRequest()) {
            return;
          }

          if (cartData) {
            setCart(cartData);
          } else {
            syncCartFromLocal();
          }
        } catch {
          if (!isCurrentRequest()) {
            return;
          }

          syncCartFromLocal();
        } finally {
          if (isCurrentRequest()) {
            setLoading(false);
            hasPendingOptimisticCartRef.current = false;
          }
        }

        return;
      }

      const instantCart = getInstantCartDisplay(isLoggedIn, productLabel);

      if (instantCart && !skipInstantSync) {
        setCart(instantCart);
      } else if (!silent) {
        setLoading(true);
      }

      try {
        const cartData = await fetchCart(isLoggedIn, t);
        if (!isCurrentRequest()) {
          return;
        }

        if (cartData) {
          setCart(cartData);
          writeCartSnapshot(cartData);
          dispatchCartUpdated({ localOnly: true, cartSummary: {
            itemsCount: cartData.itemsCount,
            total: cartData.totals.total,
          } });
        } else if (instantCart) {
          setCart(instantCart);
        } else {
          writeCartSnapshot(null);
          dispatchCartUpdated({ localOnly: true, cartSummary: { itemsCount: 0, total: 0 } });
          syncCartFromLocal();
        }
      } catch {
        if (!isCurrentRequest()) {
          return;
        }

        if (instantCart) {
          setCart(instantCart);
        } else {
          syncCartFromLocal();
        }
      } finally {
        if (!silent && isCurrentRequest()) {
          setLoading(false);
        }
        if (isCurrentRequest()) {
          hasPendingOptimisticCartRef.current = false;
        }
      }
    },
    [isLoggedIn, productLabel, syncCartFromLocal, t],
  );

  const refreshCart = useCallback((silent = true) => {
    if (isLoggedIn && hasPendingOptimisticCartRef.current) {
      void loadCart(silent, true);
      return;
    }

    const instantCart = syncCartFromLocal();
    if (isLoggedIn) {
      void loadCart(silent && Boolean(instantCart));
    }
  }, [isLoggedIn, loadCart, syncCartFromLocal]);

  useEffect(() => {
    setCurrency(getStoredCurrency());
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const instantCart = getInstantCartDisplay(isLoggedIn, productLabel);
    if (instantCart) {
      setCart(instantCart);
    }

    void loadCart(true);
  }, [enabled, isLoggedIn, productLabel, loadCart]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleCurrencyUpdate = () => {
      setCurrency(getStoredCurrency());
    };

    const handleCartUpdate = (event: Event) => {
      const detail = (event as CustomEvent<CartUpdatedDetail | null>).detail;
      if (detail?.localOnly) {
        return;
      }

      let instantCart: Cart | null = null;
      if (detail?.optimisticItem) {
        hasPendingOptimisticCartRef.current = true;
        setCart((prevCart) => upsertOptimisticCartItem(
          prevCart,
          detail.optimisticItem as CartItem,
          detail.cartSummary,
        ));
      } else {
        instantCart = syncCartFromLocal();
      }

      if (isLoggedIn) {
        void loadCart(Boolean(instantCart || detail?.optimisticItem), Boolean(detail?.optimisticItem));
      }
    };

    const handleAuthUpdate = () => {
      const instantCart = getInstantCartDisplay(isLoggedIn, productLabel);
      setCart(instantCart);
      void loadCart(true);
    };

    window.addEventListener('currency-updated', handleCurrencyUpdate);
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    window.addEventListener('auth-updated', handleAuthUpdate);

    return () => {
      window.removeEventListener('currency-updated', handleCurrencyUpdate);
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
      window.removeEventListener('auth-updated', handleAuthUpdate);
    };
  }, [enabled, isLoggedIn, productLabel, loadCart, syncCartFromLocal]);

  const onRemoveItem = async (itemId: string) => {
    cartLoadRequestRef.current += 1;
    await handleRemoveItem(itemId, isLoggedIn, setCart, () => loadCart(true), productLabel);
  };

  const onUpdateQuantity = (itemId: string, quantity: number) => {
    cartLoadRequestRef.current += 1;
    handleUpdateQuantity(
      itemId,
      quantity,
      isLoggedIn,
      setCart,
      loadCart,
      t,
      productLabel,
    );
  };

  return {
    cart,
    loading,
    currency,
    onRemoveItem,
    onUpdateQuantity,
    refreshCart,
    t,
  };
}
