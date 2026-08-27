'use client';

import { PolicyDocumentPage } from '@/components/legal/PolicyDocumentPage';
import { RefundPolicySheetContent } from '@/components/legal/RefundPolicySheetContent';
import { useTranslation } from '../../lib/i18n-client';

/** Returns page — same Return and Exchange Policy as refund-policy. */
export default function ReturnsPage() {
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
