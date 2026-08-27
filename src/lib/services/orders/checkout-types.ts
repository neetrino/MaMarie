import type { CheckoutData } from "../../types/checkout";

export type CheckoutCartItem = {
  variantId: string;
  productId: string;
  quantity: number;
  price: number;
  productTitle: string;
  variantTitle?: string;
  sku: string;
  imageUrl?: string;
};

export type CheckoutContactAddress = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type CheckoutShippingAddress = NonNullable<CheckoutData["shippingAddress"]> & {
  firstName: string;
  lastName: string;
  phone: string;
};

export type ValidatedCheckoutFields = {
  trimmedFirstName: string;
  trimmedLastName: string;
  contactAddress: CheckoutContactAddress;
  persistedShippingAddress: CheckoutShippingAddress | null;
};
