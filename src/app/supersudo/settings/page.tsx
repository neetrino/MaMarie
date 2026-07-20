'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth/AuthContext';
import { Card, Button } from '@shop/ui';
import { apiClient } from '../../../lib/api-client';
import { invalidateAdminQuery } from '@/lib/admin/admin-fetch';
import { ADMIN_QUERY_KEYS } from '@/lib/admin/admin-query-keys';
import { useTranslation } from '../../../lib/i18n-client';
import { clearCurrencyRatesCache } from '../../../lib/currency';
import { logger } from "@/lib/utils/logger";
import { ClaySelect } from '../../../components/ClaySelect';
import { useAdminSettingsReference } from '../providers/AdminReferenceDataProvider';
import { showToast } from '../../../components/Toast';

interface Settings {
  defaultCurrency?: string;
  globalDiscount?: number;
  categoryDiscounts?: Record<string, number>;
  brandDiscounts?: Record<string, number>;
  currencyRates?: Record<string, number>;
}

const DEFAULT_CURRENCY_RATES = {
  USD: 1,
  AMD: 400,
  EUR: 0.92,
  RUB: 90,
  GEL: 2.7,
};

export default function SettingsPage() {
  const { t } = useTranslation();
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const { settings: sharedSettings, loading: sharedLoading, refetchSettings } =
    useAdminSettingsReference();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    defaultCurrency: 'AMD',
    currencyRates: DEFAULT_CURRENCY_RATES,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || !isAdmin) {
        router.push('/supersudo');
        return;
      }
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  useEffect(() => {
    if (!sharedSettings) {
      return;
    }

    setSettings({
      defaultCurrency: sharedSettings.defaultCurrency || 'AMD',
      globalDiscount: sharedSettings.globalDiscount,
      categoryDiscounts: sharedSettings.categoryDiscounts,
      brandDiscounts: sharedSettings.brandDiscounts,
      currencyRates: sharedSettings.currencyRates || DEFAULT_CURRENCY_RATES,
    });
    logger.debug('✅ [ADMIN] Settings loaded from reference provider:', sharedSettings);
  }, [sharedSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      logger.debug('⚙️ [ADMIN] Saving settings...', settings);

      // Ensure all currency rates have valid values before saving
      const currencyRatesToSave = {
        USD: 1,
        AMD: settings.currencyRates?.AMD ?? 400,
        EUR: settings.currencyRates?.EUR ?? 0.92,
        RUB: settings.currencyRates?.RUB ?? 90,
        GEL: settings.currencyRates?.GEL ?? 2.7,
      };

      await apiClient.put('/api/v1/admin/settings', {
        defaultCurrency: settings.defaultCurrency,
        currencyRates: currencyRatesToSave,
      });

      invalidateAdminQuery(ADMIN_QUERY_KEYS.settings);
      await refetchSettings();
      
      // Clear currency rates cache to force reload
      logger.debug('🔄 [ADMIN] Clearing currency rates cache...');
      clearCurrencyRatesCache();
      
      // Wait a bit to ensure cache is cleared, then dispatch event again
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          logger.debug('🔄 [ADMIN] Dispatching currency-rates-updated event...');
          window.dispatchEvent(new Event('currency-rates-updated'));
        }
      }, 100);
      
      showToast(t('admin.settings.savedSuccess'), 'success');
      logger.debug('✅ [ADMIN] Settings saved, currency rates:', currencyRatesToSave);
    } catch (err: any) {
      console.error('❌ [ADMIN] Error saving settings:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to save settings';
      showToast(t('admin.settings.errorSaving').replace('{message}', errorMessage), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || (sharedLoading && !sharedSettings)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="text-gray-600">{t('admin.common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('admin.settings.generalSettings')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.settings.siteName')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={t('admin.settings.siteNamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.settings.siteDescription')}
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                defaultValue={t('admin.settings.siteDescriptionPlaceholder')}
              />
            </div>
          </div>
        </Card>

        {/* Payment Settings */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('admin.settings.paymentSettings')}</h2>
          <div className="space-y-4">
            <ClaySelect
              label={t('admin.settings.defaultCurrency')}
              value={settings.defaultCurrency || 'AMD'}
              onChange={(value) => setSettings({ ...settings, defaultCurrency: value })}
              placeholder={t('admin.settings.amd')}
              options={[
                { value: 'AMD', label: t('admin.settings.amd') },
                { value: 'USD', label: t('admin.settings.usd') },
                { value: 'EUR', label: t('admin.settings.eur') },
              ]}
            />
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">{t('admin.settings.enableOnlinePayments')}</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Currency Exchange Rates */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('admin.settings.currencyRates')}</h2>
          <p className="text-sm text-gray-600 mb-4">{t('admin.settings.currencyRatesDescription')}</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  USD (US Dollar)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.currencyRates?.USD || 1}
                  onChange={(e) => setSettings({
                    ...settings,
                    currencyRates: {
                      ...settings.currencyRates,
                      USD: parseFloat(e.target.value) || 1,
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">{t('admin.settings.baseCurrency')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AMD (Armenian Dram)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.currencyRates?.AMD ?? ''}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      setSettings({
                        ...settings,
                        currencyRates: {
                          ...settings.currencyRates,
                          AMD: undefined as any,
                        },
                      });
                    } else {
                      const numValue = parseFloat(inputValue);
                      if (!isNaN(numValue) && numValue > 0) {
                        setSettings({
                          ...settings,
                          currencyRates: {
                            ...settings.currencyRates,
                            AMD: numValue,
                          },
                        });
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' && settings.currencyRates?.AMD === undefined) {
                      setSettings({
                        ...settings,
                        currencyRates: {
                          ...settings.currencyRates,
                          AMD: 400,
                        },
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="400"
                />
                <p className="text-xs text-gray-500 mt-1">{t('admin.settings.rateToUSD')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EUR (Euro)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.currencyRates?.EUR ?? ''}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      setSettings({
                        ...settings,
                        currencyRates: {
                          ...settings.currencyRates,
                          EUR: undefined as any,
                        },
                      });
                    } else {
                      const numValue = parseFloat(inputValue);
                      if (!isNaN(numValue) && numValue > 0) {
                        setSettings({
                          ...settings,
                          currencyRates: {
                            ...settings.currencyRates,
                            EUR: numValue,
                          },
                        });
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' && settings.currencyRates?.EUR === undefined) {
                      setSettings({
                        ...settings,
                        currencyRates: {
                          ...settings.currencyRates,
                          EUR: 0.92,
                        },
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.92"
                />
                <p className="text-xs text-gray-500 mt-1">{t('admin.settings.rateToUSD')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RUB (Russian Ruble)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.currencyRates?.RUB ?? ''}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      setSettings({
                        ...settings,
                        currencyRates: {
                          ...settings.currencyRates,
                          RUB: undefined as any,
                        },
                      });
                    } else {
                      const numValue = parseFloat(inputValue);
                      if (!isNaN(numValue) && numValue > 0) {
                        setSettings({
                          ...settings,
                          currencyRates: {
                            ...settings.currencyRates,
                            RUB: numValue,
                          },
                        });
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' && settings.currencyRates?.RUB === undefined) {
                      setSettings({
                        ...settings,
                        currencyRates: {
                          ...settings.currencyRates,
                          RUB: 90,
                        },
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="90"
                />
                <p className="text-xs text-gray-500 mt-1">{t('admin.settings.rateToUSD')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GEL (Georgian Lari)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.currencyRates?.GEL ?? ''}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      setSettings({
                        ...settings,
                        currencyRates: {
                          ...settings.currencyRates,
                          GEL: undefined as any,
                        },
                      });
                    } else {
                      const numValue = parseFloat(inputValue);
                      if (!isNaN(numValue) && numValue > 0) {
                        setSettings({
                          ...settings,
                          currencyRates: {
                            ...settings.currencyRates,
                            GEL: numValue,
                          },
                        });
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' && settings.currencyRates?.GEL === undefined) {
                      setSettings({
                        ...settings,
                        currencyRates: {
                          ...settings.currencyRates,
                          GEL: 2.7,
                        },
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2.7"
                />
                <p className="text-xs text-gray-500 mt-1">{t('admin.settings.rateToUSD')}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? t('admin.settings.saving') : t('admin.settings.saveSettings')}
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push('/supersudo')}
            disabled={saving}
          >
            {t('admin.settings.cancel')}
          </Button>
        </div>
    </div>
  );
}

