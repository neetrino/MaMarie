'use client';

import { PolicyDocumentPage } from '@/components/legal/PolicyDocumentPage';
import { TermsPolicySheetContent } from '@/components/legal/TermsPolicySheetContent';
import { useTranslation } from '../../lib/i18n-client';

/** Terms of Service page. */
export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <PolicyDocumentPage title={t('terms.title')} lastUpdatedLabel={t('terms.lastUpdated')}>
      <TermsPolicySheetContent />
    </PolicyDocumentPage>
  );
}
