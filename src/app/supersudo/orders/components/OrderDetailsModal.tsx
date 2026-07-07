'use client';

import { useTranslation } from '../../../../lib/i18n-client';
import { CurrencyCode } from '../../../../lib/currency';
import { OrderDetailsSummary } from './OrderDetailsSummary';
import { OrderDetailsAddresses } from './OrderDetailsAddresses';
import { OrderDetailsTotals } from './OrderDetailsTotals';
import { OrderDetailsItems } from './OrderDetailsItems';
import type { OrderDetails } from '../useOrders';
import { AdminSideSheet } from '../../components/AdminSideSheet';

interface OrderDetailsModalProps {
  isOpen: boolean;
  orderDetails: OrderDetails | null;
  previewNumber?: string;
  loading: boolean;
  currency: string;
  onClose: () => void;
  formatCurrency: (amount: number, orderCurrency?: string, fromCurrency?: CurrencyCode) => string;
}

export function OrderDetailsModal({
  isOpen,
  orderDetails,
  previewNumber,
  loading,
  currency,
  onClose,
  formatCurrency,
}: OrderDetailsModalProps) {
  const { t } = useTranslation();
  const subtitleNumber = orderDetails?.number ?? previewNumber;

  return (
    <AdminSideSheet
      isOpen={isOpen}
      title={t('admin.orders.orderDetails.title')}
      subtitle={subtitleNumber ? `#${subtitleNumber}` : undefined}
      closeLabel={t('admin.common.close')}
      onClose={onClose}
    >
      {loading ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="text-gray-600">{t('admin.orders.orderDetails.loadingOrderDetails')}</p>
        </div>
      ) : orderDetails ? (
        <div className="space-y-8">
          <OrderDetailsSummary
            orderDetails={orderDetails}
            currency={currency}
            formatCurrency={formatCurrency}
          />
          <OrderDetailsAddresses orderDetails={orderDetails} formatCurrency={formatCurrency} />
          <OrderDetailsTotals
            orderDetails={orderDetails}
            currency={currency}
            formatCurrency={formatCurrency}
          />
          <OrderDetailsItems orderDetails={orderDetails} formatCurrency={formatCurrency} />
        </div>
      ) : null}
    </AdminSideSheet>
  );
}
