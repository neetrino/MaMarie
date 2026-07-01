'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PRODUCTS_CATALOG_ASSETS,
  PRODUCTS_CATALOG_FILTER_CHEVRON_SIZE_PX,
  PRODUCTS_CATALOG_FILTER_CHEVRON_SRC,
  PRODUCTS_CATALOG_MOBILE_ACTION_FONT_SIZE_PX,
  PRODUCTS_CATALOG_MOBILE_ACTION_LINE_HEIGHT_PX,
  PRODUCTS_CATALOG_MOBILE_ACTION_PILL_HEIGHT_PX,
  PRODUCTS_CATALOG_MOBILE_ACTION_PILL_PADDING_X_PX,
  PRODUCTS_CATALOG_PILL_HEIGHT_PX,
  PRODUCTS_CATALOG_PILL_RADIUS_PX,
  PRODUCTS_CATALOG_SORT_DROPDOWN_ANIMATION_MS,
  PRODUCTS_CATALOG_SORT_DROPDOWN_GAP_PX,
  PRODUCTS_CATALOG_SORT_DROPDOWN_WIDTH_PX,
  PRODUCTS_CATALOG_SORT_ICON_SIZE_PX,
  PRODUCTS_CATALOG_SORT_PILL_BG,
  PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX,
  PRODUCTS_CATALOG_SORT_TEXT_SIZE_PX,
} from '../../constants/products-catalog';

export type ProductsCatalogSortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc';

interface ProductsCatalogSortDropdownProps {
  sortBy: ProductsCatalogSortOption;
  sortOptions: ReadonlyArray<{ value: ProductsCatalogSortOption; label: string }>;
  currentSortLabel: string;
  onSortChange: (option: ProductsCatalogSortOption) => void;
}

const mobileActionPillStyle = {
  minHeight: PRODUCTS_CATALOG_MOBILE_ACTION_PILL_HEIGHT_PX,
  paddingLeft: PRODUCTS_CATALOG_MOBILE_ACTION_PILL_PADDING_X_PX,
  paddingRight: PRODUCTS_CATALOG_MOBILE_ACTION_PILL_PADDING_X_PX,
  fontSize: PRODUCTS_CATALOG_MOBILE_ACTION_FONT_SIZE_PX,
  lineHeight: `${PRODUCTS_CATALOG_MOBILE_ACTION_LINE_HEIGHT_PX}px`,
  borderRadius: PRODUCTS_CATALOG_PILL_RADIUS_PX,
} as const;

const chevronTransitionStyle = {
  transitionDuration: `${PRODUCTS_CATALOG_SORT_DROPDOWN_ANIMATION_MS}ms`,
} as const;

/** Mobile + desktop sort pill with animated dropdown (Figma catalog toolbar). */
export function ProductsCatalogSortDropdown({
  sortBy,
  sortOptions,
  currentSortLabel,
  onSortChange,
}: ProductsCatalogSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openDropdown = useCallback(() => {
    clearCloseTimer();
    setIsOpen(true);
    setIsDropdownVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDropdownExpanded(true);
      });
    });
  }, [clearCloseTimer]);

  const closeDropdown = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
    setIsDropdownExpanded(false);
    closeTimerRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
      closeTimerRef.current = null;
    }, PRODUCTS_CATALOG_SORT_DROPDOWN_ANIMATION_MS);
  }, [clearCloseTimer]);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
      return;
    }
    openDropdown();
  }, [closeDropdown, isOpen, openDropdown]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown, isOpen]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  const handleSelect = (option: ProductsCatalogSortOption) => {
    onSortChange(option);
    closeDropdown();
  };

  const chevronClassName = `shrink-0 brightness-0 invert transition-transform ease-out ${
    isOpen ? 'rotate-180' : 'rotate-0'
  }`;

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex shrink-0 items-center gap-2 font-medium text-white lg:hidden"
        style={{
          ...mobileActionPillStyle,
          backgroundColor: PRODUCTS_CATALOG_SORT_PILL_BG,
        }}
        aria-expanded={isOpen}
      >
        <span className="whitespace-nowrap">{currentSortLabel}</span>
        <Image
          src={PRODUCTS_CATALOG_FILTER_CHEVRON_SRC}
          alt=""
          width={PRODUCTS_CATALOG_FILTER_CHEVRON_SIZE_PX}
          height={PRODUCTS_CATALOG_FILTER_CHEVRON_SIZE_PX}
          aria-hidden
          className={chevronClassName}
          style={chevronTransitionStyle}
        />
      </button>

      <button
        type="button"
        onClick={toggleDropdown}
        className="hidden items-center gap-3 px-6 font-normal text-white lg:flex"
        style={{
          height: PRODUCTS_CATALOG_PILL_HEIGHT_PX,
          borderRadius: PRODUCTS_CATALOG_PILL_RADIUS_PX,
          backgroundColor: PRODUCTS_CATALOG_SORT_PILL_BG,
          width: PRODUCTS_CATALOG_SORT_PILL_WIDTH_PX,
          fontSize: PRODUCTS_CATALOG_SORT_TEXT_SIZE_PX,
          lineHeight: '24px',
        }}
        aria-expanded={isOpen}
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
          className={`ml-auto ${chevronClassName}`}
          style={chevronTransitionStyle}
        />
      </button>

      {isDropdownVisible ? (
        <div
          role="menu"
          className={`absolute right-0 z-50 origin-top overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white shadow-lg transition-all ease-out ${
            isDropdownExpanded
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
          style={{
            top: `calc(100% + ${PRODUCTS_CATALOG_SORT_DROPDOWN_GAP_PX}px)`,
            width: PRODUCTS_CATALOG_SORT_DROPDOWN_WIDTH_PX,
            transitionDuration: `${PRODUCTS_CATALOG_SORT_DROPDOWN_ANIMATION_MS}ms`,
          }}
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(option.value)}
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
  );
}
