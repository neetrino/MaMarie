'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BrandChevronDown } from './BrandChevronDown';
import {
  CURRENCIES,
  getStoredCurrency,
  setStoredCurrency,
  type CurrencyCode,
} from '../../lib/currency';

/** Chevron footprint — slightly larger than Figma base (18px). */
const CURRENCY_CHEVRON_WIDTH_PX = 22;

/** Figma pill min width — dropdown matches the trigger button. */
const CURRENCY_PILL_MIN_WIDTH_PX = 77;

/** Shared duration for chevron rotation and dropdown fade. */
const CURRENCY_DROPDOWN_ANIMATION_MS = 300;

export function HeaderCurrencyPill() {
  const [currency, setCurrency] = useState<CurrencyCode>(getStoredCurrency());
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const [triggerWidthPx, setTriggerWidthPx] = useState(CURRENCY_PILL_MIN_WIDTH_PX);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncTriggerWidth = useCallback(() => {
    if (!buttonRef.current) return;
    setTriggerWidthPx(buttonRef.current.offsetWidth);
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openDropdown = useCallback(() => {
    syncTriggerWidth();
    clearCloseTimer();
    setIsOpen(true);
    setIsDropdownVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDropdownExpanded(true);
      });
    });
  }, [clearCloseTimer, syncTriggerWidth]);

  const closeDropdown = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
    setIsDropdownExpanded(false);
    closeTimerRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
      closeTimerRef.current = null;
    }, CURRENCY_DROPDOWN_ANIMATION_MS);
  }, [clearCloseTimer]);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
      return;
    }
    openDropdown();
  }, [closeDropdown, isOpen, openDropdown]);

  useEffect(() => {
    syncTriggerWidth();
    window.addEventListener('resize', syncTriggerWidth);
    return () => {
      window.removeEventListener('resize', syncTriggerWidth);
    };
  }, [currency, syncTriggerWidth]);

  useEffect(() => {
    const handleCurrencyUpdate = () => {
      setCurrency(getStoredCurrency());
      syncTriggerWidth();
    };

    window.addEventListener('currency-updated', handleCurrencyUpdate);
    return () => {
      window.removeEventListener('currency-updated', handleCurrencyUpdate);
    };
  }, [syncTriggerWidth]);

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

  const handleSelect = (code: CurrencyCode) => {
    if (code !== currency) {
      setStoredCurrency(code);
      setCurrency(code);
    }
    closeDropdown();
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className="flex h-[41px] min-w-[77px] items-center justify-center gap-1 rounded-[22px] bg-brand-pink px-3.5 transition-opacity hover:opacity-90"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Currency: ${currency}`}
      >
        <span className="whitespace-nowrap text-[15px] font-medium leading-none text-brand-on-pink">
          {currency}
        </span>
        <BrandChevronDown
          isOpen={isOpen}
          style={{ width: CURRENCY_CHEVRON_WIDTH_PX }}
          className="shrink-0 self-center"
        />
      </button>

      {isDropdownVisible && (
        <ul
          role="listbox"
          aria-label="Select currency"
          className={`absolute right-0 top-[calc(100%+6px)] z-50 origin-top overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg transition-all ease-out ${
            isDropdownExpanded
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
          style={{
            width: triggerWidthPx,
            transitionDuration: `${CURRENCY_DROPDOWN_ANIMATION_MS}ms`,
          }}
        >
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
            const isActive = code === currency;

            return (
              <li key={code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleSelect(code)}
                  className={`flex w-full justify-center px-2 py-1.5 text-center text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-pink/10 font-semibold text-brand-brown'
                      : 'text-brand-muted hover:bg-gray-50'
                  }`}
                >
                  {code}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
