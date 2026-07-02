'use client';

import type { Order } from '../types';
import { OrderPageShell } from './OrderPageShell';
import { OrderReadyHero } from './OrderReadyHero';

interface OrderPageContentProps {
  order: Order;
}

export function OrderPageContent({ order }: OrderPageContentProps) {
  return (
    <OrderPageShell>
      <OrderReadyHero order={order} />
    </OrderPageShell>
  );
}
