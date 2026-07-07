'use client';

import { Button } from '@shop/ui';
import { useTranslation } from '../../../../lib/i18n-client';
import { AdminSideSheet } from '../../components/AdminSideSheet';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  categoryTitle: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteCategoryModal({
  isOpen,
  categoryTitle,
  deleting,
  onCancel,
  onConfirm,
}: DeleteCategoryModalProps) {
  const { t } = useTranslation();

  const footer = (
    <div className="flex items-center justify-end gap-3">
      <Button variant="outline" onClick={onCancel} disabled={deleting} className="min-w-24">
        {t('admin.common.cancel')}
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          void onConfirm();
        }}
        disabled={deleting}
        className="min-w-24 !bg-red-600 !text-white hover:!bg-red-700 focus:!ring-red-600"
      >
        {deleting ? `${t('admin.common.delete')}...` : t('admin.common.delete')}
      </Button>
    </div>
  );

  return (
    <AdminSideSheet
      isOpen={isOpen}
      title={t('admin.common.delete')}
      closeLabel={t('admin.common.close')}
      onClose={onCancel}
      footer={footer}
    >
      <p className="text-sm leading-6 text-gray-600">
        {t('admin.categories.deleteConfirm').replace('{name}', categoryTitle)}
      </p>
    </AdminSideSheet>
  );
}
