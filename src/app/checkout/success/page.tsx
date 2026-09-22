'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { MOBILE_ORDER_ASSETS } from '../../../constants/mobile-orders';
import { clearGuestCart } from '../checkoutUtils';
import { CheckoutPageShell } from '../components/CheckoutPageShell';
import { preloadOrderSuccessIllustration } from '../../orders/[number]/utils/order-success-pending';
import { CheckoutPaymentSuccessHero } from './CheckoutPaymentSuccessHero';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  useEffect(() => {
    clearGuestCart();
    preloadOrderSuccessIllustration(MOBILE_ORDER_ASSETS.readyBasket);
  }, []);

  return (
    <CheckoutPageShell>
      <CheckoutPaymentSuccessHero orderNumber={orderNumber} />
    </CheckoutPageShell>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
