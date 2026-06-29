'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import {
  PRODUCTS_CATALOG_PILL_HEIGHT_PX,
  PRODUCTS_CATALOG_PILL_RADIUS_PX,
  PRODUCTS_CATALOG_SORT_PILL_BG,
  PRODUCTS_CATALOG_VIEW_PILL_BG,
} from '../constants/products-catalog';
import { MOBILE_FILTERS_EVENT } from '../lib/events';
import { useTranslation } from '../lib/i18n-client';
type ViewMode = 'list' | 'grid-2' | 'grid-3';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

function ViewModeIcon({ mode, active }: { mode: ViewMode; active: boolean }) {
  const color = active ? '#57423b' : 'rgba(87, 66, 59, 0.45)';

  if (mode === 'list') {
    return (
      <svg width="28" height="21" viewBox="0 0 28 21" fill="none" aria-hidden>
        <line x1="2" y1="4" x2="26" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="2" y1="10.5" x2="26" y2="10.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="2" y1="17" x2="26" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (mode === 'grid-2') {
    return (
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden>
        <rect x="2" y="2" width="9" height="9" rx="1" fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" />
        <rect x="14" y="2" width="9" height="9" rx="1" fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" />
        <rect x="2" y="14" width="9" height="9" rx="1" fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" />
        <rect x="14" y="14" width="9" height="9" rx="1" fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden>
      <circle cx="5" cy="5" r="1.8" fill={color} />
      <circle cx="12.5" cy="5" r="1.8" fill={color} />
      <circle cx="20" cy="5" r="1.8" fill={color} />
      <circle cx="5" cy="12.5" r="1.8" fill={color} />
      <circle cx="12.5" cy="12.5" r="1.8" fill={color} />
      <circle cx="20" cy="12.5" r="1.8" fill={color} />
      <circle cx="5" cy="20" r="1.8" fill={color} />
      <circle cx="12.5" cy="20" r="1.8" fill={color} />
      <circle cx="20" cy="20" r="1.8" fill={color} />
    </svg>
  );
}

function ProductsHeaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('grid-2');
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
    const stored = localStorage.getItem('products-view-mode');
    if (stored && ['list', 'grid-2', 'grid-3'].includes(stored)) {
      setViewMode(stored as ViewMode);
    } else {
      setViewMode('grid-2');
      localStorage.setItem('products-view-mode', 'grid-2');
    }
  }, []);

  useEffect(() => {
    const sortParam = searchParams.get('sort') as SortOption;
    if (sortParam && sortOptions.some((opt) => opt.value === sortParam)) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sortDropdownRef.current?.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('products-view-mode', mode);
    window.dispatchEvent(new CustomEvent('view-mode-changed', { detail: mode }));
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setShowSortDropdown(false);
    const params = new URLSearchParams(searchParams.toString());
    if (option === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', option);
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const currentSortLabel = t('products.catalog.sortBy');

  return (
    <div className="flex items-center justify-end gap-3 pb-6 pt-2 lg:pb-0">
      <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(MOBILE_FILTERS_EVENT))}
          className="inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-white px-4 py-2 text-sm font-medium text-[#57423b] lg:hidden"
        >
          {t('products.header.filters')}
      </button>

      <div
          className="hidden items-center gap-7 px-6 lg:flex"
          style={{
            height: PRODUCTS_CATALOG_PILL_HEIGHT_PX,
            borderRadius: PRODUCTS_CATALOG_PILL_RADIUS_PX,
            backgroundColor: PRODUCTS_CATALOG_VIEW_PILL_BG,
          }}
        >
          {(['list', 'grid-2', 'grid-3'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleViewModeChange(mode)}
              aria-label={t(`products.header.viewModes.${mode === 'grid-2' ? 'grid2' : mode === 'grid-3' ? 'grid3' : 'list'}`)}
              className="transition-opacity hover:opacity-80"
            >
              <ViewModeIcon mode={mode} active={viewMode === mode} />
            </button>
          ))}
        </div>

        <div className="relative" ref={sortDropdownRef}>
          <button
            type="button"
            onClick={() => setShowSortDropdown((open) => !open)}
            className="flex items-center gap-3 px-5 text-sm font-normal text-white"
            style={{
              height: PRODUCTS_CATALOG_PILL_HEIGHT_PX,
              borderRadius: `${PRODUCTS_CATALOG_PILL_RADIUS_PX}px 89px 89px ${PRODUCTS_CATALOG_PILL_RADIUS_PX}px`,
              backgroundColor: PRODUCTS_CATALOG_SORT_PILL_BG,
              minWidth: 182,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 6L8 2L12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 10L8 14L12 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="whitespace-nowrap">{currentSortLabel}</span>
            <Image
              src="/assets/brand/icon-chevron.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden
              className={`ml-auto shrink-0 brightness-0 invert transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
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
        <div className="animate-pulse pb-6 pt-2">
          <div className="h-8 w-48 rounded bg-neutral-200" />
        </div>
      }
    >
      <ProductsHeaderContent />
    </Suspense>
  );
}
