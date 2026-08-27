'use client';

import { PolicyDocumentPage } from '@/components/legal/PolicyDocumentPage';
import { RefundPolicySheetContent } from '@/components/legal/RefundPolicySheetContent';
import { useTranslation } from '../../lib/i18n-client';

/** Return and Exchange Policy page. */
export default function RefundPolicyPage() {
  const { t } = useTranslation();
  return (
    <PolicyDocumentPage
      title={t('refund-policy.title')}
      lastUpdatedLabel={t('refund-policy.lastUpdated')}
    >
      <RefundPolicySheetContent />
    </PolicyDocumentPage>
  );
}
