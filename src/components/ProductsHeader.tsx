'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import {
  PRODUCTS_CATALOG_ASSETS,
  PRODUCTS_CATALOG_FILTER_CHEVRON_SIZE_PX,
  PRODUCTS_CATALOG_FILTER_CHEVRON_SRC,
  PRODUCTS_CATALOG_PILL_HEIGHT_PX,
  PRODUCTS_CATALOG_PILL_RADIUS_PX,
  PRODUCTS_CATALOG_SORT_ICON_SIZE_PX,
  PRODUCTS_CATALOG_SORT_PILL_BG,
  PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX,
  PRODUCTS_CATALOG_SORT_TEXT_SIZE_PX,
  PRODUCTS_CATALOG_VIEW_ICON_SIZE_PX,
  PRODUCTS_CATALOG_VIEW_PILL_BG,
  PRODUCTS_CATALOG_VIEW_MODES,
  type ProductsCatalogViewMode,
} from '../constants/products-catalog';
import { MOBILE_FILTERS_EVENT } from '../lib/events';
import { useTranslation } from '../lib/i18n-client';
import { useProductsCatalogViewMode } from './products/useProductsCatalogViewMode';
import { useProductsCatalogFilterNavigation } from './products/useProductsCatalogFilterNavigation';
import { useOptionalProductsCatalog } from './products/ProductsCatalogProvider';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const VIEW_MODE_LABEL_KEYS: Record<ProductsCatalogViewMode, string> = {
  list: 'list',
  'grid-3': 'grid3',
  'grid-4': 'grid4',
};

const VIEW_ICON_VIEWBOX = '0 0 25.4294 25';
const GRID4_DOT_CENTERS_X = [2.054, 9.161, 16.268, 23.376] as const;
const GRID4_DOT_CENTERS_Y = [2.054, 9.241, 16.429, 22.946] as const;
const GRID4_DOT_RADIUS = 2.054;
const GRID3_DOT_CENTERS_X = [2.764, 12.715, 22.665] as const;
const GRID3_DOT_CENTERS_Y = [2.764, 12.5, 22.236] as const;
const GRID3_DOT_RADIUS = 2.764;
const LIST_BAR_WIDTH = 24;
const LIST_BAR_HEIGHT = 3.5;
const LIST_BAR_RADIUS = LIST_BAR_HEIGHT / 2;
const LIST_BAR_X = (25.4294 - LIST_BAR_WIDTH) / 2;
const LIST_BAR_Y = [0.75, 10.75, 20.75] as const;

function ViewModeIcon({ mode, active }: { mode: ProductsCatalogViewMode; active: boolean }) {
  const color = active ? '#57423b' : 'rgba(87, 66, 59, 0.45)';
  const iconSize = PRODUCTS_CATALOG_VIEW_ICON_SIZE_PX;

  if (mode === 'list') {
    return (
      <svg width={iconSize} height={iconSize} viewBox={VIEW_ICON_VIEWBOX} fill="none" aria-hidden>
        {LIST_BAR_Y.map((y) => (
          <rect
            key={y}
            x={LIST_BAR_X}
            y={y}
            width={LIST_BAR_WIDTH}
            height={LIST_BAR_HEIGHT}
            rx={LIST_BAR_RADIUS}
            fill={color}
          />
        ))}
      </svg>
    );
  }

  if (mode === 'grid-3') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox={VIEW_ICON_VIEWBOX}
        fill="none"
        overflow="visible"
        aria-hidden
      >
        {GRID3_DOT_CENTERS_X.flatMap((cx) =>
          GRID3_DOT_CENTERS_Y.map((cy) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={GRID3_DOT_RADIUS} fill={color} />
          )),
        )}
      </svg>
    );
  }

  return (
    <svg width={iconSize} height={iconSize} viewBox={VIEW_ICON_VIEWBOX} fill="none" aria-hidden>
      {GRID4_DOT_CENTERS_X.flatMap((cx) =>
        GRID4_DOT_CENTERS_Y.map((cy) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={GRID4_DOT_RADIUS} fill={color} />
        )),
      )}
    </svg>
  );
}

function ProductsHeaderContent() {
  const catalog = useOptionalProductsCatalog();
  const { applyPatch } = useProductsCatalogFilterNavigation();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { viewMode, setViewMode } = useProductsCatalogViewMode();
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: t('products.header.sort.default') },
    { value: 'price-asc', label: t('products.header.sort.priceAsc') },
    { value: 'price-desc', label: t('products.header.sort.priceDesc') },
    { value: 'name-asc', label: t('products.header.sort.nameAsc') },
    { value: 'name-desc', label: t('products.header.sort.nameDesc') },
  ];

  useEffect(() => {
    const sortParam = (catalog?.sortBy ?? searchParams.get('sort') ?? 'default') as SortOption;
    if (sortOptions.some((opt) => opt.value === sortParam)) {
      setSortBy(sortParam);
    }
  }, [searchParams, catalog?.sortBy]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sortDropdownRef.current?.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewModeChange = (mode: ProductsCatalogViewMode) => {
    setViewMode(mode);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setShowSortDropdown(false);
    applyPatch({
      sort: option === 'default' ? undefined : option,
    });
  };

  const currentSortLabel = t('products.catalog.sortBy');

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(MOBILE_FILTERS_EVENT))}
        className="inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-white px-4 py-2 text-sm font-medium text-[#57423b] lg:hidden"
      >
        {t('products.header.filters')}
      </button>

      <div
        className="hidden items-center gap-7 overflow-visible px-6 lg:flex"
        style={{
          height: PRODUCTS_CATALOG_PILL_HEIGHT_PX,
          borderRadius: PRODUCTS_CATALOG_PILL_RADIUS_PX,
          backgroundColor: PRODUCTS_CATALOG_VIEW_PILL_BG,
        }}
      >
        {PRODUCTS_CATALOG_VIEW_MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => handleViewModeChange(mode)}
            aria-label={t(`products.header.viewModes.${VIEW_MODE_LABEL_KEYS[mode]}`)}
            aria-pressed={viewMode === mode}
            className={`relative inline-flex items-center justify-center overflow-visible transition-opacity hover:opacity-80 ${mode === 'grid-3' ? 'z-10' : 'z-0'}`}
            style={{
              width: PRODUCTS_CATALOG_VIEW_ICON_SIZE_PX,
              height: PRODUCTS_CATALOG_VIEW_ICON_SIZE_PX,
            }}
          >
            <ViewModeIcon mode={mode} active={viewMode === mode} />
          </button>
        ))}
      </div>

      <div className="relative" ref={sortDropdownRef}>
        <button
          type="button"
          onClick={() => setShowSortDropdown((open) => !open)}
          className="flex items-center gap-3 px-6 font-normal text-white"
          style={{
            height: PRODUCTS_CATALOG_PILL_HEIGHT_PX,
            borderRadius: PRODUCTS_CATALOG_PILL_RADIUS_PX,
            backgroundColor: PRODUCTS_CATALOG_SORT_PILL_BG,
            width: PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX,
            fontSize: PRODUCTS_CATALOG_SORT_TEXT_SIZE_PX,
            lineHeight: '24px',
          }}
          aria-expanded={showSortDropdown}
        >
          <Image
            src={PRODUCTS_CATALOG_ASSETS.sortSliders}
            alt=""
            width={PRODUCTS_CATALOG_SORT_ICON_SIZE_PX}
            height={PRODUCTS_CATALOG_SORT_ICON_SIZE_PX}
            aria-hidden
            className="shrink-0"
          />
          <span className="whitespace-nowrap">{currentSortLabel}</span>
          <Image
            src={PRODUCTS_CATALOG_FILTER_CHEVRON_SRC}
            alt=""
            width={PRODUCTS_CATALOG_FILTER_CHEVRON_SIZE_PX}
            height={PRODUCTS_CATALOG_FILTER_CHEVRON_SIZE_PX}
            aria-hidden
            className={`ml-auto shrink-0 brightness-0 invert transition-transform duration-200 ease-in-out ${showSortDropdown ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {showSortDropdown ? (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white shadow-lg">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSortChange(option.value)}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  sortBy === option.value
                    ? 'bg-[#fdf2f5] font-semibold text-[#57423b]'
                    : 'text-[#555] hover:bg-[#fafafa]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ProductsHeader() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-end gap-3 animate-pulse">
          <div
            className="hidden rounded-[30px] bg-neutral-200 lg:block"
            style={{ width: 182, height: PRODUCTS_CATALOG_PILL_HEIGHT_PX }}
          />
          <div
            className="rounded-[30px] bg-neutral-200"
            style={{ width: PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX, height: PRODUCTS_CATALOG_PILL_HEIGHT_PX }}
          />
        </div>
      }
    >
      <ProductsHeaderContent />
    </Suspense>
  );
}
