'use client';

import { Card } from '@shop/ui';
import { TermsPolicySheetContent } from '@/components/legal/TermsPolicySheetContent';
import { useTranslation } from '../../lib/i18n-client';

/**
 * Terms of Service page - displays terms and conditions
 */
export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <div className="policy-page">
      <div className="policy-page-inner">
        <h1 className="text-4xl font-bold text-gray-900">{t('terms.title')}</h1>
        <p className="text-gray-600">
          {t('terms.lastUpdated')}{' '}
          {new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <TermsPolicySheetContent />
          </Card>
        </div>
      </div>
    </div>
  );
}
