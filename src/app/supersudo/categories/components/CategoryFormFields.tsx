'use client';

import { Input } from '@shop/ui';
import { useTranslation } from '../../../../lib/i18n-client';
import { AttributeLocaleSwitcher } from '../../attributes/AttributeLocaleSwitcher';
import {
  PRIMARY_PRODUCT_CONTENT_LOCALE,
  PRODUCT_CONTENT_LOCALES,
  type ProductContentLocale,
} from '@/constants/product-content-locales';
import {
  pickPrimaryCategoryTitle,
  type CategoryLocaleTitleMap,
} from '@/lib/admin/category-locale-helpers';

interface CategoryFormFieldsProps {
  titles: CategoryLocaleTitleMap;
  slug: string;
  contentLocale: ProductContentLocale;
  onContentLocaleChange: (locale: ProductContentLocale) => void;
  onTitleChange: (locale: ProductContentLocale, value: string) => void;
  onSlugChange: (value: string) => void;
}

export function CategoryFormFields({
  titles,
  slug,
  contentLocale,
  onContentLocaleChange,
  onTitleChange,
  onSlugChange,
}: CategoryFormFieldsProps) {
  const { t } = useTranslation();

  const incompleteLocales = (() => {
    const missing = new Set<ProductContentLocale>();
    for (const locale of PRODUCT_CONTENT_LOCALES) {
      if (!titles[locale].trim()) {
        missing.add(locale);
      }
    }
    return missing;
  })();

  return (
    <>
      <AttributeLocaleSwitcher
        value={contentLocale}
        onChange={onContentLocaleChange}
        incompleteLocales={incompleteLocales}
        label={t('admin.categories.contentLanguage')}
        hint={t('admin.categories.contentLanguageHint')}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {t('admin.categories.categoryTitle')}
          {contentLocale === PRIMARY_PRODUCT_CONTENT_LOCALE ? (
            <span className="ml-1 text-red-500">*</span>
          ) : null}
        </label>
        <Input
          type="text"
          value={titles[contentLocale]}
          onChange={(e) => onTitleChange(contentLocale, e.target.value)}
          placeholder={t('admin.categories.categoryTitlePlaceholder')}
          className="w-full"
          required={contentLocale === PRIMARY_PRODUCT_CONTENT_LOCALE}
        />
      </div>

      <div>
        <label htmlFor="category-slug" className="mb-1 block text-sm font-medium text-gray-700">
          {t('admin.categories.slug')}
        </label>
        <Input
          id="category-slug"
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder={t('admin.categories.slugPlaceholder')}
          className="w-full font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">{t('admin.categories.slugHint')}</p>
      </div>
    </>
  );
}

export function canSubmitCategoryForm(titles: CategoryLocaleTitleMap, slug: string): boolean {
  return pickPrimaryCategoryTitle(titles).length > 0 && slug.trim().length > 0;
}
