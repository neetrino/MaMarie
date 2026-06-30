'use client';

import { useEffect, useState } from 'react';
import { PRODUCTS_CATALOG_CLOTHING_TYPE_OPTIONS } from '../constants/products-catalog-clothing-types';
import {
  PRODUCTS_CATALOG_FILTER_ACCENT,
  PRODUCTS_CATALOG_FILTER_CHECKBOX_RADIUS_PX,
  PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
  PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX,
  PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
  PRODUCTS_CATALOG_TEXT_DARK,
} from '../constants/products-catalog';
import { useTranslation } from '../lib/i18n-client';
import { useOptionalProductsCatalog } from './products/ProductsCatalogProvider';
import { useProductsCatalogFilterNavigation } from './products/useProductsCatalogFilterNavigation';

type ClothingTypeFilterVariant = 'default' | 'catalog';

interface ClothingTypeFilterProps {
  selectedClothingTypes?: string[];
  variant?: ClothingTypeFilterVariant;
}

function CheckboxIndicator({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <span
        className="flex shrink-0 items-center justify-center border-2"
        style={{
          width: PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
          height: PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
          borderRadius: PRODUCTS_CATALOG_FILTER_CHECKBOX_RADIUS_PX,
          borderColor: PRODUCTS_CATALOG_FILTER_ACCENT,
          backgroundColor: PRODUCTS_CATALOG_FILTER_ACCENT,
        }}
        aria-hidden
      >
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className="shrink-0 border-2 border-[#d0d0d0]"
      style={{
        width: PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
        height: PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
        borderRadius: PRODUCTS_CATALOG_FILTER_CHECKBOX_RADIUS_PX,
      }}
      aria-hidden
    />
  );
}

export function ClothingTypeFilter({
  selectedClothingTypes = [],
  variant = 'default',
}: ClothingTypeFilterProps) {
  const catalog = useOptionalProductsCatalog();
  const { applyPatch } = useProductsCatalogFilterNavigation();
  const { t } = useTranslation();
  const activeSelected = catalog?.selectedClothingTypes ?? selectedClothingTypes;
  const [selected, setSelected] = useState<string[]>(activeSelected);

  useEffect(() => {
    setSelected(activeSelected);
  }, [activeSelected]);

  if (variant !== 'catalog') {
    return null;
  }

  const applyFilters = (typesToApply: string[]) => {
    applyPatch({
      clothingTypes: typesToApply.length > 0 ? typesToApply.join(',') : undefined,
    });
  };

  const handleToggle = (slug: string) => {
    const nextSelected = selected.includes(slug)
      ? selected.filter((value) => value !== slug)
      : [...selected, slug];

    setSelected(nextSelected);
    applyFilters(nextSelected);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {PRODUCTS_CATALOG_CLOTHING_TYPE_OPTIONS.map((option) => {
        const isSelected = selected.includes(option.slug);

        return (
          <button
            key={option.slug}
            type="button"
            onClick={() => handleToggle(option.slug)}
            className="flex w-full items-center gap-3 text-left"
            aria-pressed={isSelected}
          >
            <CheckboxIndicator selected={isSelected} />
            <span
              className={isSelected ? 'font-semibold' : 'font-medium text-[#555]'}
              style={{
                fontSize: PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
                lineHeight: `${PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX}px`,
                color: isSelected ? PRODUCTS_CATALOG_TEXT_DARK : undefined,
              }}
            >
              {t(option.labelKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
