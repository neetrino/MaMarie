'use client';

import { Card } from '@shop/ui';
import { DeliveryTermsSheetContent } from '@/components/legal/DeliveryTermsSheetContent';
import { useTranslation } from '../../lib/i18n-client';

/**
 * Delivery Terms page - describes shipping and delivery conditions
 */
export default function DeliveryTermsPage() {
  const { t } = useTranslation();
  return (
    <div className="policy-page">
      <div className="policy-page-inner">
        <h1 className="text-4xl font-bold text-gray-900">{t('delivery-terms.title')}</h1>
        <p className="text-gray-600">
          {t('delivery-terms.lastUpdated')}{' '}
          {new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <DeliveryTermsSheetContent />
          </Card>
        </div>
      </div>
    </div>
  );
}
