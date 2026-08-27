'use client';

import { useTranslation } from '../../../lib/i18n-client';
import { ColorPaletteSelector } from '../../../components/ColorPaletteSelector';
import {
  AdminSideSheetCancelButton,
  AdminSideSheetFooter,
  AdminSideSheetPrimaryButton,
} from '../components/AdminSideSheetActions';
import { AttributeLocaleSwitcher } from './AttributeLocaleSwitcher';
import type { AttributeLocaleTextMap } from '@/lib/admin/attribute-locale-helpers';
import { pickPrimaryAttributeText } from '@/lib/admin/attribute-locale-helpers';
import type { ProductContentLocale } from '@/constants/product-content-locales';

interface ValueEditFormProps {
  attributeKey: string;
  contentLocale: ProductContentLocale;
  editingLabels: AttributeLocaleTextMap;
  editingColors: string[];
  editingImageUrl: string | null;
  savingValue: boolean;
  imageUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onContentLocaleChange: (locale: ProductContentLocale) => void;
  onLabelChange: (locale: ProductContentLocale, label: string) => void;
  onColorsChange: (colors: string[]) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ValueEditForm({
  attributeKey,
  editingLabels,
  contentLocale,
  editingColors,
  editingImageUrl,
  savingValue,
  imageUploading,
  fileInputRef,
  onContentLocaleChange,
  onLabelChange,
  onColorsChange,
  onImageUpload,
  onRemoveImage,
  onSave,
  onCancel,
}: ValueEditFormProps) {
  const { t } = useTranslation();
  const isColorAttribute = attributeKey === 'color';
  const canSave = pickPrimaryAttributeText(editingLabels).length > 0;

  return (
    <div className="space-y-4 border-t border-gray-200 bg-gray-50 p-4">
      <AttributeLocaleSwitcher
        value={contentLocale}
        onChange={onContentLocaleChange}
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {t('admin.attributes.valueModal.label')}
        </label>
        <input
          type="text"
          value={editingLabels[contentLocale]}
          onChange={(e) => onLabelChange(contentLocale, e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900"
          placeholder={t('admin.attributes.valueModal.labelPlaceholder')}
        />
      </div>

      {isColorAttribute ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              {t('admin.attributes.valueModal.colors')}
            </label>
            <ColorPaletteSelector colors={editingColors} onColorsChange={onColorsChange} />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              {t('admin.attributes.valueModal.image')}
            </label>
            {editingImageUrl ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={editingImageUrl}
                    alt={t('admin.attributes.valueModal.imagePreview')}
                    className="h-32 w-32 rounded-lg border border-gray-300 object-cover"
                  />
                  <button
                    type="button"
                    onClick={onRemoveImage}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
                    title={t('admin.attributes.valueModal.removeImage')}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {imageUploading
                    ? t('admin.attributes.valueModal.uploading')
                    : t('admin.attributes.valueModal.changeImage')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {imageUploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                    {t('admin.attributes.valueModal.uploading')}
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('admin.attributes.valueModal.uploadImage')}
                  </>
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageUpload}
            />
          </div>
        </div>
      ) : null}

      <div className="border-t border-gray-200 pt-2">
        <AdminSideSheetFooter>
          <AdminSideSheetCancelButton type="button" onClick={onCancel} disabled={savingValue}>
            {t('admin.attributes.valueModal.cancel')}
          </AdminSideSheetCancelButton>
          <AdminSideSheetPrimaryButton
            type="button"
            onClick={onSave}
            disabled={savingValue || !canSave}
            className="flex items-center gap-2"
          >
            {savingValue ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('admin.attributes.valueModal.saving')}
              </>
            ) : (
              t('admin.attributes.valueModal.save')
            )}
          </AdminSideSheetPrimaryButton>
        </AdminSideSheetFooter>
      </div>
    </div>
  );
}
