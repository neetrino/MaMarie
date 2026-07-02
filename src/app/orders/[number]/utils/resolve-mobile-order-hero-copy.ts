import type { Order } from '../types';

interface MobileOrderHeroCopy {
  accent: string;
  title: string;
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
      accent: t('orders.mobile.ready.accent'),
      title: t('orders.mobile.ready.title'),
      subtitle: t('orders.mobile.ready.subtitle'),
    };
  }

  return {
    accent: t('orders.mobile.placed.accent'),
    title: t('orders.mobile.placed.title'),
    subtitle: t('orders.mobile.placed.subtitle'),
  };
}
