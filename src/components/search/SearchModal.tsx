'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { BRAND_ASSETS } from '../../constants/brand';
import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_MAX_RESULTS,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_MODAL_CLOSE_EVENT,
  SEARCH_MODAL_OPEN_EVENT,
  SEARCH_MODAL_Z_INDEX,
} from '../../constants/search-modal';
import { useTranslation } from '../../lib/i18n-client';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';
import { SearchDropdown } from '../SearchDropdown';
import { useInstantSearch, type InstantSearchResultItem } from '../hooks/useInstantSearch';

interface SearchModalPanelProps {
  onClose: () => void;
}

function SearchModalPanel({ onClose }: SearchModalPanelProps) {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    results,
    loading,
    error,
    isOpen,
    setIsOpen,
    selectedIndex,
    handleKeyDown,
    clearSearch,
  } = useInstantSearch({
    debounceMs: SEARCH_DEBOUNCE_MS,
    minQueryLength: SEARCH_MIN_QUERY_LENGTH,
    maxResults: SEARCH_MAX_RESULTS,
    lang,
  });

  useEffect(() => {
    inputRef.current?.focus();
    setIsOpen(true);
  }, [setIsOpen]);

  const navigateToResults = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        return;
      }
      clearSearch();
      onClose();
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    },
    [clearSearch, onClose, router]
  );

  const handleResultClick = useCallback(
    (result: InstantSearchResultItem) => {
      clearSearch();
      onClose();
      router.push(`/products/${result.slug}`);
    },
    [clearSearch, onClose, router]
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const selected = selectedIndex >= 0 ? results[selectedIndex] : null;
    if (selected) {
      handleResultClick(selected);
      return;
    }
    navigateToResults(query);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
  };

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden bg-black/40 backdrop-blur-sm"
      style={{ zIndex: SEARCH_MODAL_Z_INDEX }}
      onClick={onClose}
    >
      <div
        className="mx-auto w-full max-w-2xl px-4 pt-4 sm:pt-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative rounded-2xl bg-white p-4 shadow-2xl sm:p-5">
          <form onSubmit={handleSubmit} role="search">
            <div className="flex items-center gap-3">
              <Image
                src={BRAND_ASSETS.iconSearch}
                alt=""
                width={24}
                height={24}
                aria-hidden
                className="shrink-0 opacity-60"
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => handleInputChange(event.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
                placeholder={t('common.ariaLabels.searchPlaceholder')}
                aria-label={t('common.ariaLabels.searchPlaceholder')}
                aria-controls="search-results"
                aria-expanded={isOpen}
                aria-autocomplete="list"
                autoComplete="off"
                className="min-w-0 flex-1 border-none bg-transparent text-base text-brand-brown outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label={t('common.buttons.close')}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </form>

          <div className="relative mt-2">
            <SearchDropdown
              results={results}
              loading={loading}
              error={error}
              isOpen={isOpen && query.trim().length >= SEARCH_MIN_QUERY_LENGTH}
              selectedIndex={selectedIndex}
              query={query}
              onResultClick={handleResultClick}
              onClose={onClose}
              onSeeAllClick={onClose}
              className="shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SearchModalProps {
  initialOpen?: boolean;
}

/** Global search modal — opens when `openSearchModal()` is called. */
export function SearchModal({ initialOpen = false }: SearchModalProps) {
  const [open, setOpen] = useState(initialOpen);
  const [mounted, setMounted] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    const handleCloseEvent = () => setOpen(false);

    window.addEventListener(SEARCH_MODAL_OPEN_EVENT, handleOpen);
    window.addEventListener(SEARCH_MODAL_CLOSE_EVENT, handleCloseEvent);

    return () => {
      window.removeEventListener(SEARCH_MODAL_OPEN_EVENT, handleOpen);
      window.removeEventListener(SEARCH_MODAL_CLOSE_EVENT, handleCloseEvent);
    };
  }, []);

  useBodyScrollLock(open && mounted);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, handleClose]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(<SearchModalPanel onClose={handleClose} />, document.body);
}
