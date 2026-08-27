import type { CheckoutData } from "../../types/checkout";
import type { ValidatedCheckoutFields } from "./checkout-types";

const ALLOWED_CASH_CHANGE_FOR = new Set([
  "none",
  "2000",
  "5000",
  "10000",
  "20000",
  "50000",
  "100000",
]);

/**
 * Validates required checkout contact fields and cash-on-delivery change option.
 */
export function validateCheckoutFields(params: {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  paymentMethod: string;
  cashChangeFor: CheckoutData["cashChangeFor"];
  shippingAddress: CheckoutData["shippingAddress"];
}): ValidatedCheckoutFields {
  const {
    firstName,
    lastName,
    email,
    phone,
    paymentMethod,
    cashChangeFor,
    shippingAddress,
  } = params;

  const trimmedFirstName = firstName?.trim() ?? "";
  const trimmedLastName = lastName?.trim() ?? "";

  if (!trimmedFirstName || !trimmedLastName) {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Validation Error",
      detail: "First name and last name are required",
    };
  }

  if (!email || !phone) {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Validation Error",
      detail: "Email and phone are required",
    };
  }

  if (
    paymentMethod === "cash_on_delivery" &&
    cashChangeFor !== undefined &&
    !ALLOWED_CASH_CHANGE_FOR.has(cashChangeFor)
  ) {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Validation Error",
      detail: "Invalid cash change option",
    };
  }

  const contactAddress = {
    firstName: trimmedFirstName,
    lastName: trimmedLastName,
    phone,
    email,
  };

  const persistedShippingAddress = shippingAddress
    ? {
        ...shippingAddress,
        firstName: shippingAddress.firstName?.trim() || trimmedFirstName,
        lastName: shippingAddress.lastName?.trim() || trimmedLastName,
        phone: shippingAddress.phone || phone,
      }
    : null;

  return {
    trimmedFirstName,
    trimmedLastName,
    contactAddress,
    persistedShippingAddress,
  };
}
