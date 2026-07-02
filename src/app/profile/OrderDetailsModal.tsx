'use client';

import { useRef } from 'react';
import {
  PROFILE_DESKTOP_PENDING_BADGE_CLASS,
  PROFILE_DESKTOP_SECTION_TITLE_CLASS,
} from '../../constants/profile-desktop-page';
import { formatPriceInCurrency, convertPrice, type CurrencyCode } from '../../lib/currency';
import { getColorValue } from './utils';
import type { OrderDetails } from './types';
import { ProfileClayButton } from './components/ProfileClayButton';
import { ProfileSectionCard } from './components/ProfileSectionCard';
import { ProfileSideSheet } from './components/ProfileSideSheet';

interface OrderDetailsModalProps {
  isOpen: boolean;
  selectedOrder: OrderDetails | null;
  orderDetailsLoading: boolean;
  orderDetailsError: string | null;
  isReordering: boolean;
  currency: CurrencyCode;
  onClose: () => void;
  onReOrder: () => void;
  t: (key: string) => string;
}

function getAttributeLabel(key: string, t: (key: string) => string): string {
  if (key === 'color' || key === 'colour') return t('profile.orderDetails.color');
  if (key === 'size') return t('profile.orderDetails.size');
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function getColorsArray(colors: unknown): string[] {
  if (!colors) return [];
  if (Array.isArray(colors)) return colors.filter((c): c is string => typeof c === 'string');
  if (typeof colors === 'string') {
    try {
      const parsed: unknown = JSON.parse(colors);
      return Array.isArray(parsed) ? parsed.filter((c): c is string => typeof c === 'string') : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function OrderDetailsModal({
  isOpen,
  selectedOrder,
  orderDetailsLoading,
  orderDetailsError,
  isReordering,
  currency,
  onClose,
  onReOrder,
  t,
}: OrderDetailsModalProps) {
  const displayedOrderRef = useRef<OrderDetails | null>(null);
  if (selectedOrder) {
    displayedOrderRef.current = selectedOrder;
  }

  const order = displayedOrderRef.current;
  if (!order) {
    return null;
  }

  const headerActions = (
    <ProfileClayButton
      type="button"
      onClick={onReOrder}
      disabled={isReordering}
      variant="primary"
      className="w-full shrink-0 md:w-auto"
    >
      {isReordering ? t('profile.orderDetails.adding') : t('profile.orderDetails.reorder')}
    </ProfileClayButton>
  );

  return (
    <ProfileSideSheet
      isOpen={isOpen}
      title={`${t('profile.orderDetails.title')}${order.number}`}
      subtitle={`${t('profile.orderDetails.placedOn')} ${new Date(order.createdAt).toLocaleDateString()}`}
      headerActions={headerActions}
      closeLabel={t('profile.orderDetails.close')}
      onClose={onClose}
    >
      {orderDetailsLoading ? (
        <div className="flex flex-col items-center py-12">
          <div className="mb-4 h-11 w-11 animate-spin rounded-full border-2 border-[#fdeef2] border-t-brand-pink" />
          <p className="text-sm text-gray-600">{t('profile.orderDetails.loading')}</p>
        </div>
      ) : orderDetailsError ? (
        <div className="flex flex-col items-center py-12 text-center">
          <p className="mb-4 text-sm text-red-600">{orderDetailsError}</p>
          <ProfileClayButton type="button" onClick={onClose} variant="secondary" className="w-full sm:w-auto">
            {t('profile.orderDetails.close')}
          </ProfileClayButton>
        </div>
      ) : (
        <div className="space-y-4">
          <ProfileSectionCard className="p-4 sm:p-5">
            <h3 className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} mb-4 text-base`}>
              {t('profile.orderDetails.orderStatus')}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className={PROFILE_DESKTOP_PENDING_BADGE_CLASS}>{order.status}</span>
              <span className={PROFILE_DESKTOP_PENDING_BADGE_CLASS}>
                {t('profile.orderDetails.payment')}: {order.paymentStatus}
              </span>
            </div>
          </ProfileSectionCard>

          <ProfileSectionCard className="p-4 sm:p-5">
            <h3 className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} mb-4 text-base`}>
              {t('profile.orderDetails.orderItems')}
            </h3>
            <div className="space-y-4">
              {order.items.map((item, index) => {
                const allOptions = item.variantOptions || [];

                return (
                  <div
                    key={index}
                    className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    {item.imageUrl ? (
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-gray-100">
                        <img src={item.imageUrl} alt={item.productTitle} className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{item.productTitle}</h4>
                      {allOptions.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {allOptions.map((opt, optIndex) => {
                            if (!opt.attributeKey || !opt.value) return null;

                            const attributeKey = opt.attributeKey.toLowerCase().trim();
                            const isColor = attributeKey === 'color' || attributeKey === 'colour';
                            const displayLabel = opt.label || opt.value;
                            const hasImage = opt.imageUrl && opt.imageUrl.trim() !== '';
                            const colors = getColorsArray(opt.colors);
                            const colorHex =
                              colors.length > 0 ? colors[0] : isColor ? getColorValue(opt.value) : null;

                            return (
                              <div key={optIndex} className="flex items-center gap-1.5 text-xs text-gray-700">
                                <span className="font-medium">{getAttributeLabel(opt.attributeKey, t)}:</span>
                                {hasImage ? (
                                  <img
                                    src={opt.imageUrl!}
                                    alt={displayLabel}
                                    className="h-5 w-5 rounded border border-gray-200 object-cover"
                                  />
                                ) : isColor && colorHex ? (
                                  <span
                                    className="inline-block h-4 w-4 rounded-full border border-gray-200"
                                    style={{ backgroundColor: colorHex }}
                                    title={displayLabel}
                                  />
                                ) : null}
                                <span className="capitalize text-gray-900">{displayLabel}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                      <p className="mt-1 text-xs text-gray-500">
                        {t('profile.orderDetails.sku')}: {item.sku}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        {t('profile.orderDetails.quantity')}: {item.quantity} ×{' '}
                        {formatPriceInCurrency(
                          currency === 'AMD'
                            ? convertPrice(item.price, 'USD', 'AMD')
                            : convertPrice(convertPrice(item.price, 'USD', 'AMD'), 'AMD', currency),
                          currency,
                        )}{' '}
                        ={' '}
                        {formatPriceInCurrency(
                          currency === 'AMD'
                            ? convertPrice(item.total, 'USD', 'AMD')
                            : convertPrice(convertPrice(item.total, 'USD', 'AMD'), 'AMD', currency),
                          currency,
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ProfileSectionCard>

          <ProfileSectionCard className="p-4 sm:p-5">
            <h3 className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} mb-4 text-base`}>
              {t('profile.orderDetails.orderSummary')}
            </h3>
            {order.totals ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{t('profile.orderDetails.subtotal')}</span>
                  <span>
                    {formatPriceInCurrency(
                      currency === 'AMD'
                        ? convertPrice(order.totals.subtotal, 'USD', 'AMD')
                        : convertPrice(
                            convertPrice(order.totals.subtotal, 'USD', 'AMD'),
                            'AMD',
                            currency,
                          ),
                      currency,
                    )}
                  </span>
                </div>
                {order.totals.discount > 0 ? (
                  <div className="flex justify-between text-gray-600">
                    <span>{t('profile.orderDetails.discount')}</span>
                    <span>
                      -
                      {formatPriceInCurrency(
                        currency === 'AMD'
                          ? convertPrice(order.totals.discount, 'USD', 'AMD')
                          : convertPrice(
                              convertPrice(order.totals.discount, 'USD', 'AMD'),
                              'AMD',
                              currency,
                            ),
                        currency,
                      )}
                    </span>
                  </div>
                ) : null}
                <div className="flex justify-between text-gray-600">
                  <span>{t('profile.orderDetails.shipping')}</span>
                  <span>
                    {order.shippingMethod === 'pickup'
                      ? t('checkout.shipping.freePickup')
                      : formatPriceInCurrency(
                          currency === 'AMD'
                            ? order.totals.shipping
                            : convertPrice(order.totals.shipping, 'AMD', currency),
                          currency,
                        ) +
                        (order.shippingAddress?.city
                          ? ` (${order.shippingAddress.city})`
                          : '')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('profile.orderDetails.tax')}</span>
                  <span>
                    {formatPriceInCurrency(
                      currency === 'AMD'
                        ? convertPrice(order.totals.tax, 'USD', 'AMD')
                        : convertPrice(convertPrice(order.totals.tax, 'USD', 'AMD'), 'AMD', currency),
                      currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                  <span>{t('profile.orderDetails.total')}</span>
                  <span>
                    {(() => {
                      const subtotalAMD = convertPrice(order.totals.subtotal, 'USD', 'AMD');
                      const discountAMD = convertPrice(order.totals.discount, 'USD', 'AMD');
                      const totalAMD =
                        subtotalAMD - discountAMD + order.totals.shipping + convertPrice(order.totals.tax, 'USD', 'AMD');
                      const totalDisplay =
                        currency === 'AMD' ? totalAMD : convertPrice(totalAMD, 'AMD', currency);
                      return formatPriceInCurrency(totalDisplay, currency);
                    })()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">{t('profile.orderDetails.loadingTotals')}</p>
            )}
          </ProfileSectionCard>

          <ProfileSectionCard className="p-4 sm:p-5">
            <h3 className={`${PROFILE_DESKTOP_SECTION_TITLE_CLASS} mb-4 text-base`}>
              {t('profile.orderDetails.shippingMethod')}
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-medium">{t('profile.orderDetails.method')}: </span>
                <span className="capitalize">
                  {order.shippingMethod === 'delivery'
                    ? t('profile.orderDetails.delivery')
                    : order.shippingMethod === 'pickup'
                      ? t('profile.orderDetails.pickup')
                      : order.shippingMethod || t('profile.orderDetails.notSpecified')}
                </span>
              </p>
              {order.shippingMethod === 'delivery' && order.shippingAddress ? (
                <div className="border-t border-gray-100 pt-3 text-gray-600">
                  <p className="mb-2 font-medium text-gray-900">{t('profile.orderDetails.deliveryAddress')}:</p>
                  {order.shippingAddress.firstName && order.shippingAddress.lastName ? (
                    <p>
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                  ) : null}
                  {order.shippingAddress.addressLine1 ? (
                    <p>{order.shippingAddress.addressLine1}</p>
                  ) : null}
                  {order.shippingAddress.addressLine2 ? (
                    <p>{order.shippingAddress.addressLine2}</p>
                  ) : null}
                  {order.shippingAddress.city ? (
                    <p>
                      {order.shippingAddress.city}
                      {order.shippingAddress.postalCode
                        ? `, ${order.shippingAddress.postalCode}`
                        : ''}
                    </p>
                  ) : null}
                  {order.shippingAddress.countryCode ? (
                    <p>{order.shippingAddress.countryCode}</p>
                  ) : null}
                  {order.shippingAddress.phone ? (
                    <p className="mt-2">
                      {t('profile.orderDetails.phone')}: {order.shippingAddress.phone}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </ProfileSectionCard>
        </div>
      )}
    </ProfileSideSheet>
  );
}
