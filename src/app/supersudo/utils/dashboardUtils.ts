/**
 * Dashboard utility functions
 */

import {
  CURRENCIES,
  formatPriceInCurrency,
  type CurrencyCode,
} from '../../../lib/currency';

/**
 * Formats currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  if (currency in CURRENCIES) {
    return formatPriceInCurrency(amount, currency as CurrencyCode);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Dashboard money is stored in AMD. */
export function formatDashboardAmdFromUsd(amountAmd: number): string {
  return formatPriceInCurrency(amountAmd, 'AMD');
}

/**
 * Formats date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('hy-AM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

