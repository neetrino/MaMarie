import { useState, useEffect } from 'react';
import { DEFAULT_CURRENCY, getStoredCurrency, type CurrencyCode } from '../../../lib/currency';
import { logger } from '@/lib/utils/logger';

export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    const updateCurrency = () => {
      const newCurrency = getStoredCurrency();
      logger.debug('💱 [PROFILE] Currency updated to:', newCurrency);
      setCurrency(newCurrency);
    };

    updateCurrency();

    window.addEventListener('currency-updated', updateCurrency);
    const handleCurrencyRatesUpdate = () => {
      logger.debug('💱 [PROFILE] Currency rates updated, refreshing currency...');
      updateCurrency();
    };
    window.addEventListener('currency-rates-updated', handleCurrencyRatesUpdate);

    return () => {
      window.removeEventListener('currency-updated', updateCurrency);
      window.removeEventListener('currency-rates-updated', handleCurrencyRatesUpdate);
    };
  }, []);

  return {
    currency,
  };
}
