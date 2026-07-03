import type { Order } from '../types';

interface MobileOrderHeroCopy {
  variant: 'ready' | 'placed';
  accent: string;
  titleLines: readonly string[];
  subtitle: string;
}

type TranslateFn = (key: string) => string;

function isReadyForDelivery(order: Order): boolean {
  const status = order.status.toLowerCase();
  const fulfillment = order.fulfillmentStatus.toLowerCase();

  return (
    fulfillment === 'shipped'
    || fulfillment === 'fulfilled'
    || fulfillment === 'delivered'
    || status === 'shipped'
    || status === 'delivered'
    || status === 'completed'
  );
}

/** Maps order status to Figma `66:432` hero copy keys. */
export function resolveMobileOrderHeroCopy(order: Order, t: TranslateFn): MobileOrderHeroCopy {
  if (isReadyForDelivery(order)) {
    return {
      variant: 'ready',
      accent: t('orders.mobile.ready.accent'),
      titleLines: [t('orders.mobile.ready.title')],
      subtitle: t('orders.mobile.ready.subtitle'),
    };
  }

  return {
    variant: 'placed',
    accent: t('orders.mobile.placed.accent'),
    titleLines: [
      t('orders.mobile.placed.titleLine1'),
      t('orders.mobile.placed.titleLine2'),
    ],
    subtitle: t('orders.mobile.placed.subtitle'),
  };
}
