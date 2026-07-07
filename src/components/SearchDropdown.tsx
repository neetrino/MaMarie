'use client';

import Image from 'next/image';
import { StorefrontCatalogLink } from './storefront/StorefrontCatalogLink';
import { useTranslation } from '../lib/i18n-client';
import { formatPrice, getStoredCurrency } from '../lib/currency';
import type { InstantSearchResultItem } from './hooks/useInstantSearch';

export interface SearchDropdownProps {
  results: InstantSearchResultItem[];
  loading: boolean;
  error: string | null;
  isOpen: boolean;
  selectedIndex: number;
  query: string;
  onResultClick: (result: InstantSearchResultItem) => void;
  onClose: () => void;
  onSeeAllClick?: () => void;
  className?: string;
}

export function SearchDropdown({
  results,
  loading,
  error,
  isOpen,
  selectedIndex,
  query,
  onResultClick,
  onClose,
  onSeeAllClick,
  className = '',
}: SearchDropdownProps) {
  const { t } = useTranslation();
  const currency = getStoredCurrency();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="listbox"
      id="search-results"
      aria-label={t('common.ariaLabels.searchPlaceholder')}
      className={`absolute left-0 right-0 top-full z-[60] mt-1 flex max-h-[min(70vh,400px)] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg ${className}`}
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            {t('common.messages.loading')}
          </div>
        ) : null}

        {error && !loading ? (
          <div className="px-4 py-6 text-center text-sm text-red-600">{error}</div>
        ) : null}

        {!loading && !error && results.length === 0 && query.trim().length >= 1 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            {t('common.messages.noProductsFound')}
          </div>
        ) : null}

        {!loading && !error && results.length > 0 ? (
          <ul className="py-1" role="group">
            {results.map((result, index) => (
              <li key={result.id} role="option" aria-selected={index === selectedIndex}>
                <button
                  type="button"
                  onClick={() => onResultClick(result)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {result.image ? (
                      <Image
                        src={result.image}
                        alt={result.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-gray-900">{result.title}</p>
                    {result.category ? (
                      <p className="mt-0.5 text-xs text-gray-500">{result.category}</p>
                    ) : null}
                    <p className="mt-0.5 text-sm font-semibold text-gray-700">
                      {formatPrice(result.price, currency)}
                      {result.compareAtPrice != null && result.compareAtPrice > result.price ? (
                        <span className="ml-2 text-xs text-gray-500 line-through">
                          {formatPrice(result.compareAtPrice, currency)}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {!loading && !error && query.trim().length >= 1 ? (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
          <StorefrontCatalogLink
            href={`/products?search=${encodeURIComponent(query.trim())}`}
            onClick={() => {
              onClose();
              onSeeAllClick?.();
            }}
            className="block text-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {t('common.search.seeAll')}
          </StorefrontCatalogLink>
        </div>
      ) : null}
    </div>
  );
}
