'use client';

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { fetchCart } from '../../app/cart/cart-fetcher';
import { handleRemoveItem, handleUpdateQuantity } from '../../app/cart/cart-handlers';
import type { Cart, CartItem } from '../../app/cart/types';
import type { CartUpdatedDetail } from '../../lib/cart-events';
import { CART_UPDATED_EVENT, dispatchCartUpdated } from '../../lib/cart-events';
import { getStoredCurrency, DEFAULT_CURRENCY } from '../../lib/currency';
import {
  clearLegacyCartProductSnapshot,
  filterRemovedCartItems,
  getInstantCartDisplay,
  getGuestCartFromStorage,
  persistCartBadgeFromCart,
  clearGuestCartItems,
} from '../../lib/guest-cart-storage';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { getCartDisplayEpoch, writeLoggedInCartDisplay } from '../../lib/cart-display-cache';
import { upsertOptimisticCartItem } from './optimistic-cart';

interface UseCartStateOptions {
  enabled: boolean;
}

type SetCart = Dispatch<SetStateAction<Cart | null>>;
type SetLoading = Dispatch<SetStateAction<boolean>>;

interface CartRequest {
  silent: boolean;
  isCurrent: () => boolean;
  setLoading: SetLoading;
  clearOptimistic: () => void;
}

async function loadGuestCartView(
  request: CartRequest,
  productLabel: string,
  setCart: SetCart,
  syncLocal: () => void,
  translate: (key: string) => string,
): Promise<void> {
  syncLocal();
  const instantCart = getGuestCartFromStorage(productLabel);
  if (!request.silent && !instantCart) {
    request.setLoading(true);
  }

  try {
    const cartData = await fetchCart(false, translate);
    if (!request.isCurrent()) {
      return;
    }

    setCart(cartData);
    dispatchCartUpdated({
      localOnly: true,
      cartSummary: {
        itemsCount: cartData?.itemsCount ?? 0,
        total: cartData?.totals.total ?? 0,
      },
    });
  } catch {
    if (request.isCurrent()) {
      syncLocal();
    }
  } finally {
    finishCartRequest(request);
  }
}

async function loadLoggedInCartView(
  request: CartRequest,
  setCartFromServer: (cart: Cart) => void,
  translate: (key: string) => string,
): Promise<void> {
  const epoch = getCartDisplayEpoch();
  if (!request.silent) {
    request.setLoading(true);
  }

  try {
    const cartData = await fetchCart(true, translate);
    const isStale = !request.isCurrent() || getCartDisplayEpoch() !== epoch;
    if (isStale || !cartData) {
      return;
    }

    setCartFromServer(cartData);
  } catch {
    return;
  } finally {
    finishCartRequest(request);
  }
}

function finishCartRequest(request: CartRequest): void {
  if (!request.isCurrent()) {
    return;
  }

  if (!request.silent) {
    request.setLoading(false);
  }
  request.clearOptimistic();
}

export function useCartState({ enabled }: UseCartStateOptions) {
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const productLabel = t('common.messages.product');

  const [cart, setCart] = useState<Cart | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return getInstantCartDisplay(isLoggedIn, productLabel);
  });
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const cartLoadRequestRef = useRef(0);
  const hasPendingOptimisticCartRef = useRef(false);
  const pendingRemovedItemIdsRef = useRef(new Set<string>());

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


  const applyServerCart = useCallback((cartData: Cart) => {
    const filtered = filterRemovedCartItems(cartData, pendingRemovedItemIdsRef.current);
    for (const id of [...pendingRemovedItemIdsRef.current]) {
      if (!cartData.items.some((item) => item.id === id)) {
        pendingRemovedItemIdsRef.current.delete(id);
      }
    }
    clearGuestCartItems();
    setCart(filtered);
    writeLoggedInCartDisplay(filtered);
    persistCartBadgeFromCart(filtered);
    dispatchCartUpdated({
      localOnly: true,
      cartSummary: {
        itemsCount: filtered.itemsCount,
        total: filtered.totals.total,
      },
    });
  }, []);

  const loadCart = useCallback(
    async (silent = false) => {
      const requestId = cartLoadRequestRef.current + 1;
      cartLoadRequestRef.current = requestId;
      const request: CartRequest = {
        silent,
        isCurrent: () => cartLoadRequestRef.current === requestId,
        setLoading,
        clearOptimistic: () => {
          hasPendingOptimisticCartRef.current = false;
        },
      };

      if (!isLoggedIn) {
        await loadGuestCartView(request, productLabel, setCart, syncCartFromLocal, t);
        return;
      }

      await loadLoggedInCartView(request, applyServerCart, t);
    },
    [applyServerCart, isLoggedIn, productLabel, syncCartFromLocal, t],
  );

  const refreshCart = useCallback((silent = true) => {
    if (isLoggedIn && hasPendingOptimisticCartRef.current) {
      void loadCart(silent);
      return;
    }

    const instantCart = syncCartFromLocal();
    void loadCart(silent || Boolean(instantCart));
  }, [isLoggedIn, loadCart, syncCartFromLocal]);

  useEffect(() => {
    setCurrency(getStoredCurrency());
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (isLoggedIn) {
      clearLegacyCartProductSnapshot();
    } else {
      const instantCart = getGuestCartFromStorage(productLabel);
      if (instantCart) {
        setCart(instantCart);
      }
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

      if (detail?.optimisticItem) {
        hasPendingOptimisticCartRef.current = true;
        setCart((prevCart) => upsertOptimisticCartItem(
          prevCart,
          detail.optimisticItem as CartItem,
          detail.cartSummary,
        ));
      } else {
        syncCartFromLocal();
      }

      if (isLoggedIn) {
        void loadCart(Boolean(detail?.optimisticItem));
      }
    };

    const handleAuthUpdate = () => {
      if (!isLoggedIn) {
        setCart(getGuestCartFromStorage(productLabel));
      }
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
    if (isLoggedIn) {
      pendingRemovedItemIdsRef.current.add(itemId);
    }
    cartLoadRequestRef.current += 1;
    const removed = await handleRemoveItem(itemId, isLoggedIn, setCart, () => loadCart(true), productLabel);
    if (!removed && isLoggedIn) {
      pendingRemovedItemIdsRef.current.delete(itemId);
      void loadCart(true);
    }
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
