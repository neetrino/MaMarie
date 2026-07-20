'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOBILE_ORDER_ASSETS } from '../../../constants/mobile-orders';
import { apiClient } from '../../../lib/api-client';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import { ErrorState } from './components/ErrorState';
import { OrderPageContent } from './components/OrderPageContent';
import { OrderPageLoadingState } from './components/OrderPageLoadingState';
import { OrderPageShell } from './components/OrderPageShell';
import type { Order } from './types';
import {
  clearOrderSuccessPending,
  createPendingOrderStub,
  preloadOrderSuccessIllustration,
  readOrderSuccessPending,
} from './utils/order-success-pending';

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const { t } = useTranslation();
  const orderNumber = String(params.number ?? '');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    preloadOrderSuccessIllustration(MOBILE_ORDER_ASSETS.readyBasket);
  }, []);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!orderNumber) {
      setError(t('orders.notFound.description'));
      setLoading(false);
      return;
    }

    const pending = readOrderSuccessPending(orderNumber);
    const hasOptimisticHero = pending !== null;
    if (pending) {
      setOrder(createPendingOrderStub(pending));
      setLoading(false);
    } else {
      setLoading(true);
    }

    let cancelled = false;

    async function fetchOrder() {
      try {
        const response = await apiClient.get<Order>(`/api/v1/orders/${orderNumber}`);
        if (cancelled) {
          return;
        }
        setOrder(response);
        clearOrderSuccessPending();
        setError(null);
      } catch (err: unknown) {
        if (cancelled || hasOptimisticHero) {
          return;
        }
        const errorMessage =
          err instanceof Error ? err.message : t('orders.notFound.description');
        setError(errorMessage);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [isAuthLoading, isLoggedIn, orderNumber, router, t]);

  if (isAuthLoading || (loading && !order)) {
    return <OrderPageLoadingState />;
  }

  if (!order) {
    return (
      <OrderPageShell>
        <ErrorState error={error} />
      </OrderPageShell>
    );
  }

  return <OrderPageContent order={order} />;
}
