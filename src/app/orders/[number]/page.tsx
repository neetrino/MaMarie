'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import { ErrorState } from './components/ErrorState';
import { OrderPageContent } from './components/OrderPageContent';
import { OrderPageLoadingState } from './components/OrderPageLoadingState';
import { OrderPageShell } from './components/OrderPageShell';
import type { Order } from './types';

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    fetchOrder();
  }, [isLoggedIn, params.number, router]);

  async function fetchOrder() {
    try {
      setLoading(true);
      const response = await apiClient.get<Order>(`/api/v1/orders/${params.number}`);
      setOrder(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('orders.notFound.description');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <OrderPageLoadingState />;
  }

  if (error || !order) {
    return (
      <OrderPageShell>
        <ErrorState error={error} />
      </OrderPageShell>
    );
  }

  return <OrderPageContent order={order} />;
}
