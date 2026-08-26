'use client';

import { Suspense } from 'react';
import { useTranslation } from '../../lib/i18n-client';
import { ProductsCatalogFilterFields } from './ProductsCatalogFilterFields';

export function MobileCatalogFilters() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5">
      <Suspense fallback={<div>{t('common.messages.loadingFilters')}</div>}>
        <ProductsCatalogFilterFields />
      </Suspense>
    </div>
  );
}
