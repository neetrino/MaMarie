'use client';

import { DeliveryTermsSheetContent } from '@/components/legal/DeliveryTermsSheetContent';
import { PolicyDocumentPage } from '@/components/legal/PolicyDocumentPage';
import { useTranslation } from '../../lib/i18n-client';

/** Delivery and Shipping Terms page. */
export default function DeliveryTermsPage() {
  const { t } = useTranslation();
  return (
    <PolicyDocumentPage
      title={t('delivery-terms.title')}
      lastUpdatedLabel={t('delivery-terms.lastUpdated')}
    >
      <DeliveryTermsSheetContent />
    </PolicyDocumentPage>
  );
}
