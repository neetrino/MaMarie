/**
 * Order utilities - helper functions for order status colors and formatting
 */

export type CheckoutPaymentMethodKey = 'cashOnDelivery' | 'idram' | 'arca';

/** Order amounts are stored in AMD. */
export function computeOrderTotalAmd(totals: {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
}): number {
  return totals.subtotal - totals.discount + totals.shipping + totals.tax;
}

/** i18n segment under `checkout.payment.*`, or empty if unknown (caller shows raw method). */
export function getCheckoutPaymentMethodKey(
  method: string | null | undefined
): CheckoutPaymentMethodKey | '' {
  const m = method?.trim().toLowerCase() ?? '';
  switch (m) {
    case 'cash_on_delivery':
      return 'cashOnDelivery';
    case 'idram':
      return 'idram';
    case 'arca':
    case 'ameriabank':
      return 'arca';
    default:
      return '';
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return '!border-yellow-200 !bg-yellow-100 !text-yellow-800';
    case 'processing':
      return '!border-blue-200 !bg-blue-100 !text-blue-800';
    case 'completed':
      return '!border-green-200 !bg-green-100 !text-green-800';
    case 'cancelled':
      return '!border-red-200 !bg-red-100 !text-red-800';
    default:
      return '!border-gray-200 !bg-gray-100 !text-gray-800';
  }
}

export function getPaymentStatusColor(paymentStatus: string): string {
  switch (paymentStatus.toLowerCase()) {
    case 'paid':
      return '!border-green-200 !bg-green-100 !text-green-800';
    case 'pending':
      return '!border-yellow-200 !bg-yellow-100 !text-yellow-800';
    case 'failed':
      return '!border-red-200 !bg-red-100 !text-red-800';
    case 'refunded':
      return '!border-purple-200 !bg-purple-100 !text-purple-800';
    case 'cancelled':
      return '!border-red-200 !bg-red-100 !text-red-800';
    default:
      return '!border-gray-200 !bg-gray-100 !text-gray-800';
  }
}

const ADMIN_PAYMENT_STATUS_I18N_KEYS: Record<string, string> = {
  paid: 'admin.orders.paid',
  pending: 'admin.orders.pendingPayment',
  failed: 'admin.orders.failed',
  refunded: 'admin.orders.refunded',
  cancelled: 'admin.orders.paymentCancelled',
};

/** Admin UI label for order payment status (paid / pending / failed). */
export function translateAdminPaymentStatus(
  paymentStatus: string,
  t: (key: string) => string
): string {
  const normalized = paymentStatus.trim().toLowerCase();
  const key = ADMIN_PAYMENT_STATUS_I18N_KEYS[normalized];
  if (key) {
    return t(key);
  }

  const fallback = paymentStatus.trim();
  if (!fallback) {
    return fallback;
  }

  return fallback.charAt(0).toUpperCase() + fallback.slice(1);
}

export function getAdminPaymentStatusSelectOptions(
  t: (key: string) => string
): Array<{ value: string; label: string }> {
  return [
    { value: 'paid', label: t('admin.orders.paid') },
    { value: 'pending', label: t('admin.orders.pendingPayment') },
    { value: 'failed', label: t('admin.orders.failed') },
    { value: 'cancelled', label: t('admin.orders.paymentCancelled') },
    { value: 'refunded', label: t('admin.orders.refunded') },
  ];
}

export function getAdminPaymentStatusFilterOptions(
  t: (key: string) => string
): Array<{ value: string; label: string }> {
  return [
    { value: '', label: t('admin.orders.allPaymentStatuses') },
    ...getAdminPaymentStatusSelectOptions(t),
  ];
}

/**
 * Helper function to get color hex/rgb from color name
 */
export function getColorValue(colorName: string): string {
  const colorMap: Record<string, string> = {
    'beige': '#F5F5DC', 'black': '#000000', 'blue': '#0000FF', 'brown': '#A52A2A',
    'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'red': '#FF0000',
    'white': '#FFFFFF', 'yellow': '#FFFF00', 'orange': '#FFA500', 'pink': '#FFC0CB',
    'purple': '#800080', 'navy': '#000080', 'maroon': '#800000', 'olive': '#808000',
    'teal': '#008080', 'cyan': '#00FFFF', 'magenta': '#FF00FF', 'lime': '#00FF00',
    'silver': '#C0C0C0', 'gold': '#FFD700',
  };
  const normalizedName = colorName.toLowerCase().trim();
  return colorMap[normalizedName] || '#CCCCCC';
}

