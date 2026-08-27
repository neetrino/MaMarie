'use client';

import { PrivacyPolicySheetContent } from '@/components/legal/PrivacyPolicySheetContent';
import { PolicyDocumentPage } from '@/components/legal/PolicyDocumentPage';
import { useTranslation } from '../../lib/i18n-client';

/** Privacy Policy page. */
export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <PolicyDocumentPage title={t('privacy.title')} lastUpdatedLabel={t('privacy.lastUpdated')}>
      <PrivacyPolicySheetContent />
    </PolicyDocumentPage>
  );
}
