'use client';

import { Card } from '@shop/ui';
import { RefundPolicySheetContent } from '@/components/legal/RefundPolicySheetContent';
import { useTranslation } from '../../lib/i18n-client';

/**
 * Returns page - displays return and exchange policy
 */
export default function ReturnsPage() {
  const { t } = useTranslation();
  return (
    <div className="policy-page">
      <div className="policy-page-inner">
        <h1 className="text-4xl font-bold text-gray-900">{t('refund-policy.title')}</h1>
        <p className="text-gray-600">
          {t('refund-policy.lastUpdated')}{' '}
          {new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <RefundPolicySheetContent />
          </Card>
        </div>
      </div>
    </div>
  );
}
