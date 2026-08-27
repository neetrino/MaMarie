'use client';

import { Card } from '@shop/ui';
import { PrivacyPolicySheetContent } from '@/components/legal/PrivacyPolicySheetContent';
import { useTranslation } from '../../lib/i18n-client';

/**
 * Privacy Policy page - displays privacy policy information
 */
export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <div className="policy-page">
      <div className="policy-page-inner">
        <h1 className="text-4xl font-bold text-gray-900">{t('privacy.title')}</h1>
        <p className="text-gray-600">
          {t('privacy.lastUpdated')}{' '}
          {new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <PrivacyPolicySheetContent />
          </Card>
        </div>
      </div>
    </div>
  );
}
