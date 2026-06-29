'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '../lib/i18n-client';
import { useCategories } from './CategoryNavigation/hooks/useCategories';
import { PRODUCTS_CATALOG_FILTER_ACCENT } from '../constants/products-catalog';

type CategoryFilterVariant = 'default' | 'catalog';

interface CategoryFilterProps {
  currentCategory?: string;
  variant?: CategoryFilterVariant;
}

function RadioIndicator({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full border-2"
        style={{
          width: 18,
          height: 18,
          borderColor: PRODUCTS_CATALOG_FILTER_ACCENT,
          backgroundColor: PRODUCTS_CATALOG_FILTER_ACCENT,
        }}
      >
        <span className="rounded-full bg-white" style={{ width: 7, height: 7 }} />
      </span>
    );
  }

  return (
    <span
      className="shrink-0 rounded-full border-2 border-[#d0d0d0]"
      style={{ width: 18, height: 18 }}
      aria-hidden
    />
  );
}

export function CategoryFilter({ currentCategory, variant = 'default' }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { categories, loading } = useCategories();

  const handleSelect = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  if (variant !== 'catalog') {
    return null;
  }

  const options = [
    { slug: null, label: t('products.catalog.filters.all') },
    ...categories.slice(0, 2).map((category) => ({
      slug: category.slug,
      label: category.title,
    })),
  ];

  if (loading && categories.length === 0) {
    return <p className="text-sm text-[#555]">{t('products.filters.color.loading')}</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => {
        const selected = option.slug ? currentCategory === option.slug : !currentCategory;
        return (
          <button
            key={option.slug ?? 'all'}
            type="button"
            onClick={() => handleSelect(option.slug)}
            className="flex w-full items-center gap-3 text-left"
          >
            <RadioIndicator selected={selected} />
            <span
              className={selected ? 'font-semibold text-[#1d1c16]' : 'font-medium text-[#555]'}
              style={{ fontSize: 13, lineHeight: '19.5px' }}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
