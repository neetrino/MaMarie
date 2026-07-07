'use client';

import { Button, Input } from '@shop/ui';
import { type ChangeEvent } from 'react';
import { useTranslation } from '../../../../lib/i18n-client';
import type { Category, CategoryFormData } from '../types';
import { ParentCategorySelector } from './ParentCategorySelector';
import { ClaySelect } from '../../../../components/ClaySelect';
import { AdminSideSheet } from '../../components/AdminSideSheet';
import { ADMIN_OUTLINE_BUTTON_CLASS, ADMIN_PRIMARY_BUTTON_CLASS } from '../../../../constants/admin-ui-classes';

interface AddCategoryModalProps {
  isOpen: boolean;
  formData: CategoryFormData;
  categories: Category[];
  saving: boolean;
  imageUploading: boolean;
  onClose: () => void;
  onFormDataChange: (data: CategoryFormData) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveImage: () => void;
  onSubmit: () => Promise<void>;
}

export function AddCategoryModal({
  isOpen,
  formData,
  categories,
  saving,
  imageUploading,
  onClose,
  onFormDataChange,
  onImageUpload,
  onRemoveImage,
  onSubmit,
}: AddCategoryModalProps) {
  const { t } = useTranslation();

  const footer = (
    <div className="flex gap-3">
      <Button
        variant="primary"
        onClick={onSubmit}
        disabled={saving || imageUploading || !formData.title.trim()}
        className={`flex-1 ${ADMIN_PRIMARY_BUTTON_CLASS}`}
      >
        {saving ? t('admin.categories.creating') : t('admin.categories.createCategory')}
      </Button>
      <Button variant="outline" onClick={onClose} disabled={saving} className={ADMIN_OUTLINE_BUTTON_CLASS}>
        {t('admin.common.cancel')}
      </Button>
    </div>
  );

  return (
    <AdminSideSheet
      isOpen={isOpen}
      title={t('admin.categories.addCategory')}
      closeLabel={t('admin.common.close')}
      onClose={onClose}
      footer={footer}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t('admin.categories.categoryTitle')} *
          </label>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
            placeholder={t('admin.categories.categoryTitlePlaceholder')}
            className="w-full"
          />
        </div>
        <ParentCategorySelector
          categories={categories}
          selectedParentIds={formData.parentIds}
          onChange={(parentIds) => onFormDataChange({ ...formData, parentIds })}
        />
        <ClaySelect
          label={t('admin.categories.status')}
          value={formData.published}
          onChange={(value) =>
            onFormDataChange({
              ...formData,
              published: value as CategoryFormData['published'],
            })
          }
          placeholder={t('admin.categories.published')}
          options={[
            { value: 'published', label: t('admin.categories.published') },
            { value: 'draft', label: t('admin.categories.draft') },
          ]}
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('admin.categories.image')}
          </label>
          {formData.imageUrl ? (
            <div className="space-y-3">
              <div className="relative inline-block">
                <img
                  src={formData.imageUrl}
                  alt={t('admin.categories.imagePreview')}
                  className="h-24 w-24 rounded-lg border border-gray-300 object-cover"
                />
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
                  title={t('admin.categories.removeImage')}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : null}
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200">
            {imageUploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                {t('admin.categories.uploadingImage')}
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {formData.imageUrl ? t('admin.categories.changeImage') : t('admin.categories.uploadImage')}
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void onImageUpload(event);
              }}
              disabled={imageUploading}
            />
          </label>
        </div>
        <div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={formData.requiresSizes}
              onChange={(e) => onFormDataChange({ ...formData, requiresSizes: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{t('admin.categories.requiresSizes')}</span>
          </label>
        </div>
      </div>
    </AdminSideSheet>
  );
}
