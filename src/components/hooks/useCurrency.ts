'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_CURRENCY, getStoredCurrency } from '../../lib/currency';

/**
 * Hook for managing currency state.
 * Initializes with {@link DEFAULT_CURRENCY} to avoid SSR/client hydration mismatch,
 * then syncs from localStorage after mount.
 */
export function useCurrency() {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    setCurrency(getStoredCurrency());

    const handleCurrencyUpdate = () => {
      setCurrency(getStoredCurrency());
    };

    window.addEventListener('currency-updated', handleCurrencyUpdate);
    window.addEventListener('currency-rates-updated', handleCurrencyUpdate);

    return () => {
      window.removeEventListener('currency-updated', handleCurrencyUpdate);
      window.removeEventListener('currency-rates-updated', handleCurrencyUpdate);
    };
  }, []);

  return currency;
}
