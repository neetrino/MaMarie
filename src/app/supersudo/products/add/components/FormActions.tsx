'use client';

import { Button } from '@shop/ui';
import { useTranslation } from '../../../../../lib/i18n-client';
import { useRouter } from 'next/navigation';

interface FormActionsProps {
  loading: boolean;
  isEditMode: boolean;
}

export function FormActions({ loading, isEditMode }: FormActionsProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:gap-4">
      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="order-2 w-full flex-1 sm:order-1 sm:w-auto"
      >
        {loading
          ? isEditMode
            ? t('admin.products.add.updating')
            : t('admin.products.add.creating')
          : isEditMode
            ? t('admin.products.add.updateProduct')
            : t('admin.products.add.createProduct')}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push('/supersudo/products')}
        className="order-1 w-full sm:order-2 sm:w-auto"
      >
        {t('admin.common.cancel')}
      </Button>
    </div>
  );
}
