import { useRouter } from 'next/navigation';
import { MOBILE_ORDER_ASSETS } from '../../../constants/mobile-orders';
import { apiClient } from '../../../lib/api-client';
import { useTranslation } from '../../../lib/i18n-client';
import {
  preloadOrderSuccessIllustration,
  saveOrderSuccessPending,
} from '../../orders/[number]/utils/order-success-pending';
import { clearGuestCart } from '../checkoutUtils';
import type { CheckoutFormData, Cart, CartItem } from '../types';

interface UseOrderSubmissionProps {
  cart: Cart | null;
  isLoggedIn: boolean;
  deliveryPrice: number | null;
  setError: (error: string | null) => void;
}

export function useOrderSubmission({
  cart,
  isLoggedIn,
  deliveryPrice,
  setError,
}: UseOrderSubmissionProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const submitOrder = async (data: CheckoutFormData) => {
    setError(null);

    try {
      if (!cart) {
        throw new Error(t('checkout.errors.cartEmpty'));
      }

      let cartId = cart.id;
      let items = undefined;

      if (!isLoggedIn && cart.id === 'guest-cart') {
        items = cart.items.map((item: CartItem) => ({
          productId: item.variant.product.id,
          variantId: item.variant.id,
          quantity: item.quantity,
        }));
        cartId = 'guest-cart';
      }

      const shippingAddress = data.shippingMethod === 'delivery' && 
        data.shippingAddress && 
        data.shippingCity
        ? {
            address: data.shippingAddress,
            city: data.shippingCity,
          }
        : undefined;

      const shippingAmount = data.shippingMethod === 'delivery' && deliveryPrice !== null ? deliveryPrice : 0;

      const response = await apiClient.post<{
        order: {
          id: string;
          number: string;
          status: string;
          paymentStatus: string;
          total: number;
          currency: string;
        };
        payment: {
          provider: string;
          paymentUrl: string | null;
          expiresAt: string | null;
        };
        nextAction: string;
      }>('/api/v1/orders/checkout', {
        cartId: cartId,
        ...(items ? { items } : {}),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        shippingMethod: data.shippingMethod,
        ...(shippingAddress ? { shippingAddress } : {}),
        shippingAmount: shippingAmount,
        paymentMethod: data.paymentMethod,
      });

      if (!isLoggedIn) {
        clearGuestCart();
      }

      if (response.payment?.paymentUrl) {
        window.location.href = response.payment.paymentUrl;
        return;
      }

      preloadOrderSuccessIllustration(MOBILE_ORDER_ASSETS.readyBasket);
      saveOrderSuccessPending({
        number: response.order.number,
        status: response.order.status,
        paymentStatus: response.order.paymentStatus,
        fulfillmentStatus: 'unfulfilled',
      });

      router.push(`/orders/${response.order.number}`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || t('checkout.errors.failedToCreateOrder'));
    }
  };

  return { submitOrder };
}




