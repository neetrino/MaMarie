import type { CheckoutData } from "../../types/checkout";
import type { CheckoutCartItem } from "./checkout-types";
import { resolveGuestCartItems } from "./resolve-guest-cart-items";
import { resolveUserCartItems } from "./resolve-user-cart-items";

/**
 * Resolves checkout line items from a user cart or guest payload.
 */
export async function resolveCheckoutCartItems(params: {
  userId?: string;
  cartId?: string;
  guestItems?: CheckoutData["items"];
}): Promise<CheckoutCartItem[]> {
  const { userId, cartId, guestItems } = params;

  let cartItems: CheckoutCartItem[] = [];

  if (userId && cartId && cartId !== "guest-cart") {
    cartItems = await resolveUserCartItems(userId, cartId);
  } else if (guestItems && Array.isArray(guestItems) && guestItems.length > 0) {
    cartItems = await resolveGuestCartItems(guestItems);
  } else {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Cart is empty",
      detail: "Cannot checkout with an empty cart",
    };
  }

  if (cartItems.length === 0) {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Cart is empty",
      detail: "Cannot checkout with an empty cart",
    };
  }

  return cartItems;
}
