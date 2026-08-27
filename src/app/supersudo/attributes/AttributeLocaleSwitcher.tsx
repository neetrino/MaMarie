'use client';

import { useTranslation } from '../../../lib/i18n-client';
import { AdminSegmentedControl } from '../components/AdminSegmentedControl';
import {
  PRODUCT_CONTENT_LOCALE_TABS,
  type ProductContentLocale,
} from '@/constants/product-content-locales';

interface AttributeLocaleSwitcherProps {
  value: ProductContentLocale;
  onChange: (locale: ProductContentLocale) => void;
  incompleteLocales?: ReadonlySet<ProductContentLocale>;
  label?: string;
  hint?: string;
}

export function AttributeLocaleSwitcher({
  value,
  onChange,
  incompleteLocales,
  label,
  hint,
}: AttributeLocaleSwitcherProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('admin.attributes.contentLanguage');
  const resolvedHint = hint ?? t('admin.attributes.contentLanguageHint');

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {resolvedLabel}
      </label>
      <AdminSegmentedControl
        options={PRODUCT_CONTENT_LOCALE_TABS.map((tab) => ({
          value: tab.code,
          label: incompleteLocales?.has(tab.code) ? `${tab.label} *` : tab.label,
        }))}
        value={value}
        onChange={onChange}
        ariaLabel={resolvedLabel}
      />
      <p className="mt-2 text-xs text-gray-500">{resolvedHint}</p>
    </div>
  );
}
