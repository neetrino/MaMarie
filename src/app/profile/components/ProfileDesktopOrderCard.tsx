import Link from 'next/link';
import {
  PROFILE_DESKTOP_INNER_CARD_CLASS,
  PROFILE_DESKTOP_PENDING_BADGE_CLASS,
} from '../../../constants/profile-desktop-page';
import { formatPriceInCurrency, convertPrice, type CurrencyCode } from '../../../lib/currency';

interface ProfileOrderCardItem {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  itemsCount: number;
  createdAt: string;
  subtotal?: number;
  discountAmount?: number;
  taxAmount?: number;
  total: number;
  shippingAmount?: number;
}

interface ProfileDesktopOrderCardProps {
  order: ProfileOrderCardItem;
  currency: CurrencyCode;
  orderNumberLabel: string;
  itemLabel: string;
  placedOnLabel: string;
  viewDetailsLabel: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

function orderTotalDisplay(order: ProfileOrderCardItem, currency: CurrencyCode): string {
  if (order.subtotal !== undefined && order.discountAmount !== undefined && order.taxAmount !== undefined) {
    const subtotalAMD = convertPrice(order.subtotal, 'USD', 'AMD');
    const discountAMD = convertPrice(order.discountAmount, 'USD', 'AMD');
    const taxAMD = convertPrice(order.taxAmount, 'USD', 'AMD');
    const totalWithoutShippingAMD = subtotalAMD - discountAMD + taxAMD;
    const totalDisplay =
      currency === 'AMD' ? totalWithoutShippingAMD : convertPrice(totalWithoutShippingAMD, 'AMD', currency);
    return formatPriceInCurrency(totalDisplay, currency);
  }

  const totalAMD = convertPrice(order.total, 'USD', 'AMD');
  const shippingAMD = order.shippingAmount || 0;
  const totalWithoutShippingAMD = totalAMD - shippingAMD;
  const totalDisplay =
    currency === 'AMD' ? totalWithoutShippingAMD : convertPrice(totalWithoutShippingAMD, 'AMD', currency);
  return formatPriceInCurrency(totalDisplay, currency);
}

export function ProfileDesktopOrderCard({
  order,
  currency,
  orderNumberLabel,
  itemLabel,
  placedOnLabel,
  viewDetailsLabel,
  onClick,
}: ProfileDesktopOrderCardProps) {
  return (
    <Link
      href={`/orders/${order.number}`}
      onClick={onClick}
      className={`block p-5 ${PROFILE_DESKTOP_INNER_CARD_CLASS}`}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="text-base font-bold text-gray-900">
          {orderNumberLabel}
          {order.number}
        </h3>
        <p className="shrink-0 text-lg font-bold text-brand-pink">{orderTotalDisplay(order, currency)}</p>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <span className={PROFILE_DESKTOP_PENDING_BADGE_CLASS}>{order.status}</span>
        <span className={PROFILE_DESKTOP_PENDING_BADGE_CLASS}>{order.paymentStatus}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
        <p>
          {order.itemsCount} {itemLabel} • {placedOnLabel}{' '}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <span className="font-semibold text-brand-pink">{viewDetailsLabel}</span>
      </div>
    </Link>
  );
}
