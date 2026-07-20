'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  PRODUCTS_CATALOG_MOBILE_ACTION_FONT_SIZE_PX,
  PRODUCTS_CATALOG_MOBILE_ACTION_LINE_HEIGHT_PX,
  PRODUCTS_CATALOG_MOBILE_ACTION_PILL_HEIGHT_PX,
  PRODUCTS_CATALOG_MOBILE_ACTION_PILL_PADDING_X_PX,
  PRODUCTS_CATALOG_MOBILE_ACTIONS_GAP_PX,
  PRODUCTS_CATALOG_MOBILE_FILTER_PILL_BORDER_COLOR,
  PRODUCTS_CATALOG_MOBILE_FILTER_PILL_TEXT_COLOR,
  PRODUCTS_CATALOG_PILL_HEIGHT_PX,
  PRODUCTS_CATALOG_PILL_RADIUS_PX,
  PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX,
  PRODUCTS_CATALOG_VIEW_ICON_SIZE_PX,
  PRODUCTS_CATALOG_VIEW_PILL_BG,
  PRODUCTS_CATALOG_VIEW_MODES,
  type ProductsCatalogViewMode,
} from '../constants/products-catalog';
import { MOBILE_FILTERS_EVENT } from '../lib/events';
import { useTranslation } from '../lib/i18n-client';
import {
  ProductsCatalogSortDropdown,
  type ProductsCatalogSortOption,
} from './products/ProductsCatalogSortDropdown';
import { useProductsCatalogViewMode } from './products/useProductsCatalogViewMode';
import { useProductsCatalogFilterNavigation } from './products/useProductsCatalogFilterNavigation';
import { useOptionalProductsCatalog } from './products/ProductsCatalogProvider';

type SortOption = ProductsCatalogSortOption;

const VIEW_MODE_LABEL_KEYS: Record<ProductsCatalogViewMode, string> = {
  list: 'list',
  'grid-3': 'grid3',
  'grid-4': 'grid4',
};

const VIEW_ICON_WIDTH = 25.4294;
const VIEW_ICON_HEIGHT = 25;
const VIEW_ICON_VIEWBOX = `0 0 ${VIEW_ICON_WIDTH} ${VIEW_ICON_HEIGHT}`;
/** Safari clips fills that sit on the SVG viewport edge — keep dots inset. */
const VIEW_ICON_EDGE_INSET = 0.85;
const GRID4_DOT_RADIUS = 2.054;
const GRID4_DOT_MIN = GRID4_DOT_RADIUS + VIEW_ICON_EDGE_INSET;
const GRID4_DOT_SPAN_X = VIEW_ICON_WIDTH - 2 * GRID4_DOT_MIN;
const GRID4_DOT_SPAN_Y = VIEW_ICON_HEIGHT - 2 * GRID4_DOT_MIN;
const GRID4_DOT_CENTERS_X = [
  GRID4_DOT_MIN,
  GRID4_DOT_MIN + GRID4_DOT_SPAN_X / 3,
  GRID4_DOT_MIN + (2 * GRID4_DOT_SPAN_X) / 3,
  VIEW_ICON_WIDTH - GRID4_DOT_MIN,
] as const;
const GRID4_DOT_CENTERS_Y = [
  GRID4_DOT_MIN,
  GRID4_DOT_MIN + GRID4_DOT_SPAN_Y / 3,
  GRID4_DOT_MIN + (2 * GRID4_DOT_SPAN_Y) / 3,
  VIEW_ICON_HEIGHT - GRID4_DOT_MIN,
] as const;
const GRID3_DOT_RADIUS = 2.764;
const GRID3_DOT_MIN = GRID3_DOT_RADIUS + VIEW_ICON_EDGE_INSET;
const GRID3_DOT_SPAN_X = VIEW_ICON_WIDTH - 2 * GRID3_DOT_MIN;
const GRID3_DOT_SPAN_Y = VIEW_ICON_HEIGHT - 2 * GRID3_DOT_MIN;
const GRID3_DOT_CENTERS_X = [
  GRID3_DOT_MIN,
  GRID3_DOT_MIN + GRID3_DOT_SPAN_X / 2,
  VIEW_ICON_WIDTH - GRID3_DOT_MIN,
] as const;
const GRID3_DOT_CENTERS_Y = [
  GRID3_DOT_MIN,
  GRID3_DOT_MIN + GRID3_DOT_SPAN_Y / 2,
  VIEW_ICON_HEIGHT - GRID3_DOT_MIN,
] as const;
const LIST_BAR_WIDTH = 24;
const LIST_BAR_HEIGHT = 3.5;
const LIST_BAR_RADIUS = LIST_BAR_HEIGHT / 2;
const LIST_BAR_X = (VIEW_ICON_WIDTH - LIST_BAR_WIDTH) / 2;
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
    <svg
      width={iconSize}
      height={iconSize}
      viewBox={VIEW_ICON_VIEWBOX}
      fill="none"
      overflow="visible"
      aria-hidden
    >
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

  const handleViewModeChange = (mode: ProductsCatalogViewMode) => {
    setViewMode(mode);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    applyPatch({
      sort: option === 'default' ? undefined : option,
    });
  };

  const currentSortLabel = t('products.catalog.sortBy');

  const mobileActionPillStyle = {
    minHeight: PRODUCTS_CATALOG_MOBILE_ACTION_PILL_HEIGHT_PX,
    paddingLeft: PRODUCTS_CATALOG_MOBILE_ACTION_PILL_PADDING_X_PX,
    paddingRight: PRODUCTS_CATALOG_MOBILE_ACTION_PILL_PADDING_X_PX,
    fontSize: PRODUCTS_CATALOG_MOBILE_ACTION_FONT_SIZE_PX,
    lineHeight: `${PRODUCTS_CATALOG_MOBILE_ACTION_LINE_HEIGHT_PX}px`,
    borderRadius: PRODUCTS_CATALOG_PILL_RADIUS_PX,
  } as const;

  return (
    <div
      className="flex w-full items-center justify-between lg:w-auto lg:justify-end"
      style={{ gap: PRODUCTS_CATALOG_MOBILE_ACTIONS_GAP_PX }}
    >
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(MOBILE_FILTERS_EVENT))}
        className="inline-flex shrink-0 items-center justify-center border bg-white font-medium lg:hidden"
        style={{
          ...mobileActionPillStyle,
          borderColor: PRODUCTS_CATALOG_MOBILE_FILTER_PILL_BORDER_COLOR,
          color: PRODUCTS_CATALOG_MOBILE_FILTER_PILL_TEXT_COLOR,
        }}
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
            className={`relative inline-flex items-center justify-center overflow-visible ${mode === 'grid-3' ? 'z-10' : 'z-0'}`}
            style={{
              width: PRODUCTS_CATALOG_VIEW_ICON_SIZE_PX,
              height: PRODUCTS_CATALOG_VIEW_ICON_SIZE_PX,
            }}
          >
            <ViewModeIcon mode={mode} active={viewMode === mode} />
          </button>
        ))}
      </div>

      <ProductsCatalogSortDropdown
        sortBy={sortBy}
        sortOptions={sortOptions}
        currentSortLabel={currentSortLabel}
        onSortChange={handleSortChange}
      />
    </div>
  );
}

export function ProductsHeader() {
  return (
    <Suspense
      fallback={
        <div
          className="flex w-full animate-pulse justify-between lg:w-auto lg:justify-end"
          style={{ gap: PRODUCTS_CATALOG_MOBILE_ACTIONS_GAP_PX }}
        >
          <div
            className="rounded-[30px] bg-neutral-200 lg:hidden"
            style={{
              width: 96,
              height: PRODUCTS_CATALOG_MOBILE_ACTION_PILL_HEIGHT_PX,
            }}
          />
          <div
            className="rounded-[30px] bg-neutral-200 lg:hidden"
            style={{
              width: 140,
              height: PRODUCTS_CATALOG_MOBILE_ACTION_PILL_HEIGHT_PX,
            }}
          />
          <div
            className="hidden rounded-[30px] bg-neutral-200 lg:block"
            style={{ width: 182, height: PRODUCTS_CATALOG_PILL_HEIGHT_PX }}
          />
          <div
            className="hidden rounded-[30px] bg-neutral-200 lg:block"
            style={{
              width: PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX,
              height: PRODUCTS_CATALOG_PILL_HEIGHT_PX,
            }}
          />
        </div>
      }
    >
      <ProductsHeaderContent />
    </Suspense>
  );
}
