import type { Cart, CartItem } from '../../app/cart/types';
import type { CartUpdatedDetail } from '../../lib/cart-events';

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

/** Shows the line the user just added until the database cart replaces it. */
export function upsertOptimisticCartItem(
  cart: Cart | null,
  optimisticItem: CartItem,
  cartSummary?: CartUpdatedDetail['cartSummary'],
): Cart {
  if (!cart) {
    return buildSingleItemCart(optimisticItem, cartSummary);
  }

  const hasItem = cart.items.some((item) => isSameCartLine(item, optimisticItem));
  const items = hasItem
    ? cart.items.map((item) => replaceOptimisticLine(item, optimisticItem))
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

function replaceOptimisticLine(item: CartItem, optimisticItem: CartItem): CartItem {
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
}
