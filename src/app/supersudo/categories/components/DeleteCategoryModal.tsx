'use client';

import { useTranslation } from '../../../../lib/i18n-client';
import { AdminDeleteModal } from '../../components/AdminDeleteModal';

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

  return (
    <AdminDeleteModal
      isOpen={isOpen}
      title={t('admin.common.delete')}
      message={t('admin.categories.deleteConfirm').replace('{name}', categoryTitle)}
      confirming={deleting}
      onCancel={onCancel}
      onConfirm={() => {
        void onConfirm();
      }}
    />
  );
}
