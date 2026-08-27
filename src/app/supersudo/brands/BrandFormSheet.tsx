'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useTranslation } from '../../../lib/i18n-client';
import { ClaySelect } from '../../../components/ClaySelect';
import { AdminSideSheet } from '../components/AdminSideSheet';
import {
  AdminSideSheetCancelButton,
  AdminSideSheetFooter,
  AdminSideSheetPrimaryButton,
} from '../components/AdminSideSheetActions';
import { AttributeLocaleSwitcher } from '../attributes/AttributeLocaleSwitcher';
import {
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  type ProductContentLocale,
} from '@/constants/product-content-locales';
import type { BrandLocaleNameMap } from '@/lib/admin/brand-locale-helpers';
import { pickPrimaryBrandName } from '@/lib/admin/brand-locale-helpers';

export interface BrandFormState {
  names: BrandLocaleNameMap;
  slug: string;
  logoUrl: string;
  published: 'published' | 'draft';
}

interface BrandFormSheetProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: BrandFormState;
  contentLocale: ProductContentLocale;
  submitting: boolean;
  imageUploading: boolean;
  incompleteLocales?: ReadonlySet<ProductContentLocale>;
  onClose: () => void;
  onContentLocaleChange: (locale: ProductContentLocale) => void;
  onNameChange: (locale: ProductContentLocale, value: string) => void;
  onSlugChange: (value: string) => void;
  onPublishedChange: (value: BrandFormState['published']) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSubmit: (event: FormEvent) => void;
}

export function BrandFormSheet({
  isOpen,
  isEditing,
  formData,
  contentLocale,
  submitting,
  imageUploading,
  incompleteLocales,
  onClose,
  onContentLocaleChange,
  onNameChange,
  onSlugChange,
  onPublishedChange,
  onImageUpload,
  onRemoveImage,
  onSubmit,
}: BrandFormSheetProps) {
  const { t } = useTranslation();
  const canSubmit = pickPrimaryBrandName(formData.names).length > 0 && formData.slug.trim().length > 0;

  return (
    <AdminSideSheet
      isOpen={isOpen}
      title={isEditing ? t('admin.brands.editBrand') : t('admin.brands.addNewBrand')}
      closeLabel={t('admin.common.close')}
      onClose={onClose}
      footer={
        <AdminSideSheetFooter>
          <AdminSideSheetCancelButton type="button" onClick={onClose} disabled={submitting}>
            {t('admin.brands.cancel')}
          </AdminSideSheetCancelButton>
          <AdminSideSheetPrimaryButton
            type="submit"
            form="brand-form"
            disabled={submitting || imageUploading || !canSubmit}
          >
            {submitting
              ? t('admin.brands.saving')
              : isEditing
                ? t('admin.brands.update')
                : t('admin.brands.create')}
          </AdminSideSheetPrimaryButton>
        </AdminSideSheetFooter>
      }
    >
      <form id="brand-form" onSubmit={onSubmit} className="space-y-4">
        <AttributeLocaleSwitcher
          value={contentLocale}
          onChange={onContentLocaleChange}
          incompleteLocales={incompleteLocales}
          label={t('admin.brands.contentLanguage')}
          hint={t('admin.brands.contentLanguageHint')}
        />

        <div>
          <label htmlFor="brand-name" className="mb-1 block text-sm font-medium text-gray-700">
            {t('admin.brands.brandName')}
            {contentLocale === PRIMARY_PRODUCT_CONTENT_LOCALE ? (
              <span className="ml-1 text-red-500">*</span>
            ) : null}
          </label>
          <input
            id="brand-name"
            type="text"
            value={formData.names[contentLocale]}
            onChange={(e) => onNameChange(contentLocale, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900"
            placeholder={t('admin.brands.enterBrandName')}
            required={contentLocale === PRIMARY_PRODUCT_CONTENT_LOCALE}
          />
        </div>

        <div>
          <label htmlFor="brand-slug" className="mb-1 block text-sm font-medium text-gray-700">
            {t('admin.brands.slug')}
          </label>
          <input
            id="brand-slug"
            type="text"
            value={formData.slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900"
            placeholder={t('admin.brands.slugPlaceholder')}
          />
          <p className="mt-1 text-xs text-gray-500">{t('admin.brands.slugHint')}</p>
        </div>

        <ClaySelect
          id="brand-status"
          label={t('admin.brands.status')}
          value={formData.published}
          onChange={(value) => onPublishedChange(value as BrandFormState['published'])}
          placeholder={t('admin.brands.published')}
          options={[
            { value: 'published', label: t('admin.brands.published') },
            { value: 'draft', label: t('admin.brands.draft') },
          ]}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('admin.brands.logo')}
          </label>
          {formData.logoUrl ? (
            <div className="mb-3">
              <div className="relative inline-block">
                <img
                  src={formData.logoUrl}
                  alt={t('admin.brands.logoPreview')}
                  className="h-24 w-24 rounded-lg border border-gray-300 object-cover"
                />
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
                  title={t('admin.brands.removeLogo')}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : null}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200">
            {imageUploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                {t('admin.brands.uploadingLogo')}
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {formData.logoUrl ? t('admin.brands.changeLogo') : t('admin.brands.uploadLogo')}
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
      </form>
    </AdminSideSheet>
  );
}
