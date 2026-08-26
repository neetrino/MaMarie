'use client';

import { BRAND_CHECKBOX_ACCENT } from '../constants/brand';
import {
  PRODUCTS_CATALOG_FILTER_CHECKBOX_RADIUS_PX,
  PRODUCTS_CATALOG_FILTER_CHECKBOX_SIZE_PX,
  PRODUCTS_CATALOG_FILTER_LABEL_LINE_HEIGHT_PX,
  PRODUCTS_CATALOG_FILTER_LABEL_SIZE_PX,
  PRODUCTS_CATALOG_TEXT_DARK,
} from '../constants/products-catalog';
import {
  parseCatalogAttrsParam,
  serializeCatalogAttrsParam,
  toggleCatalogAttrValue,
} from '../lib/products-catalog-attrs';
import { useOptionalProductsCatalog } from './products/ProductsCatalogProvider';
import { useProductsCatalogFilterNavigation } from './products/useProductsCatalogFilterNavigation';
import type { CatalogFilterAttributeValueOption } from '../lib/services/products-filters-aggregate';

interface CatalogAttributeFilterProps {
  attributeKey: string;
  values: CatalogFilterAttributeValueOption[];
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
          borderColor: BRAND_CHECKBOX_ACCENT,
          backgroundColor: BRAND_CHECKBOX_ACCENT,
        }}
        aria-hidden
      >
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="#57423b"
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

export function CatalogAttributeFilter({ attributeKey, values }: CatalogAttributeFilterProps) {
  const catalog = useOptionalProductsCatalog();
  const { applyPatch } = useProductsCatalogFilterNavigation();
  const selected = parseCatalogAttrsParam(catalog?.params.attrs)[attributeKey] ?? [];

  const handleToggle = (value: string) => {
    const next = toggleCatalogAttrValue(parseCatalogAttrsParam(catalog?.params.attrs), attributeKey, value);
    applyPatch({ attrs: serializeCatalogAttrsParam(next) });
  };

  return (
    <div className="flex max-h-64 flex-col gap-2.5 overflow-y-auto">
      {values.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
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
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
