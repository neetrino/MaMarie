import Link from 'next/link';
import {
  PROFILE_DESKTOP_ORDER_CARD_CLASS,
  PROFILE_DESKTOP_ORDER_CARD_SEPARATOR_CLASS,
  PROFILE_DESKTOP_PENDING_BADGE_CLASS,
} from '../../../constants/profile-desktop-page';
import { PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS } from '../../../constants/profile-mobile-page';
import { formatPriceInCurrency, convertPrice, type CurrencyCode } from '../../../lib/currency';
import { formatProfileOrderDate } from '../utils';
import { ProfileOrderViewDetailsCta } from './ProfileOrderViewDetailsCta';

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

function ProfileOrderShoppingBagIcon() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fdeef2] text-brand-pink">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    </div>
  );
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
      className={`flex h-full flex-col p-4 sm:p-5 ${PROFILE_DESKTOP_ORDER_CARD_CLASS} ${PROFILE_MOBILE_ORDER_CARD_SHADOW_CLASS}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-base font-bold text-gray-900">
          {orderNumberLabel}
          {order.number}
        </h3>
        <span className={`${PROFILE_DESKTOP_PENDING_BADGE_CLASS} shrink-0`}>{order.status}</span>
      </div>
      <p className="mt-2 text-lg font-bold leading-none text-brand-pink sm:text-xl">
        {orderTotalDisplay(order, currency)}
      </p>

      <div className={PROFILE_DESKTOP_ORDER_CARD_SEPARATOR_CLASS} aria-hidden />

      <div className="flex items-start gap-3">
        <ProfileOrderShoppingBagIcon />
        <div className="min-w-0 pt-0.5 text-sm leading-relaxed text-gray-600">
          <p>
            {order.itemsCount} {itemLabel} •
          </p>
          <p>
            {placedOnLabel} {formatProfileOrderDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <ProfileOrderViewDetailsCta label={viewDetailsLabel} />
      </div>
    </Link>
  );
}
