'use client';

import type { ChangeEvent } from 'react';
import { Input } from '@shop/ui';
import { useTranslation } from '../../../../../lib/i18n-client';
import type { ProductFormFieldErrors } from '../utils/product-form-field-errors';
import { AdminSegmentedControl } from '../../../components/AdminSegmentedControl';
import {
  PRODUCT_CONTENT_LOCALE_TABS,
  type ProductContentLocale,
} from '@/constants/product-content-locales';
import type { ProductTranslationsByLocale } from '../utils/product-locale-fields';

interface BasicInformationProps {
  productType: 'simple' | 'variable';
  setProductType: (type: 'simple' | 'variable') => void;
  contentLocale: ProductContentLocale;
  onContentLocaleChange: (locale: ProductContentLocale) => void;
  translations: ProductTranslationsByLocale;
  slug: string;
  fieldErrors: ProductFormFieldErrors;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function localeHasError(
  fieldErrors: ProductFormFieldErrors,
  locale: ProductContentLocale,
): boolean {
  return Boolean(fieldErrors[`title.${locale}`]);
}

export function BasicInformation({
  productType,
  setProductType,
  contentLocale,
  onContentLocaleChange,
  translations,
  slug,
  fieldErrors,
  onTitleChange,
  onSlugChange,
  onDescriptionChange,
}: BasicInformationProps) {
  const { t } = useTranslation();
  const localeFields = translations[contentLocale];
  const titleError = fieldErrors[`title.${contentLocale}`] ?? fieldErrors.title;
  const slugError = fieldErrors.slug;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('admin.products.add.basicInformation')}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('admin.products.add.productType')} *
          </label>
          <p className="text-xs text-gray-500 mb-3">
            {t('admin.products.add.productTypeDescription')}
          </p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="productType"
                value="simple"
                checked={productType === 'simple'}
                onChange={(e) => setProductType(e.target.value as 'simple' | 'variable')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('admin.products.add.productTypeSimple')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="productType"
                value="variable"
                checked={productType === 'variable'}
                onChange={(e) => setProductType(e.target.value as 'simple' | 'variable')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('admin.products.add.productTypeVariable')}</span>
            </label>
          </div>
        </div>

        <div data-field-error={slugError ? 'true' : undefined}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.products.add.slug')} *
          </label>
          <Input
            type="text"
            value={slug}
            onChange={onSlugChange}
            placeholder={t('admin.products.add.productSlugPlaceholder')}
            error={slugError}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t('admin.products.add.contentLanguage')}
          </label>
          <AdminSegmentedControl
            options={PRODUCT_CONTENT_LOCALE_TABS.map((tab) => ({
              value: tab.code,
              label: localeHasError(fieldErrors, tab.code) ? `${tab.label} *` : tab.label,
            }))}
            value={contentLocale}
            onChange={onContentLocaleChange}
            ariaLabel={t('admin.products.add.contentLanguage')}
          />
          <p className="mt-2 text-xs text-gray-500">{t('admin.products.add.contentLanguageHint')}</p>
        </div>

        <div data-field-error={titleError ? 'true' : undefined}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.products.add.title')} *
          </label>
          <Input
            type="text"
            value={localeFields.title}
            onChange={onTitleChange}
            placeholder={t('admin.products.add.productTitlePlaceholder')}
            error={titleError}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.products.add.description')}
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            value={localeFields.descriptionHtml}
            onChange={onDescriptionChange}
            placeholder={t('admin.products.add.productDescriptionPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
}
