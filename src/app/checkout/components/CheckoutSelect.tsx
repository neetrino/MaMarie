'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  CHECKOUT_FORM_INPUT_CLASS,
  CHECKOUT_SELECT_BORDER_CLASS,
  CHECKOUT_SELECT_BORDER_OPEN_CLASS,
  CHECKOUT_SELECT_CHEVRON_SIZE_PX,
  CHECKOUT_SELECT_DROPDOWN_ANIMATION_MS,
  CHECKOUT_SELECT_DROPDOWN_GAP_PX,
  CHECKOUT_SELECT_TRIGGER_MIN_HEIGHT_PX,
} from '../constants/checkout-ui';

export interface CheckoutSelectOption {
  value: string;
  label: string;
}

interface CheckoutSelectProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder: string;
  options: readonly CheckoutSelectOption[];
  value: string;
  onChange: (value: string) => void;
}

function CheckoutSelectChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width={CHECKOUT_SELECT_CHEVRON_SIZE_PX}
      height={CHECKOUT_SELECT_CHEVRON_SIZE_PX}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`shrink-0 text-gray-500 transition-transform ease-out ${
        isOpen ? 'rotate-180' : 'rotate-0'
      }`}
      style={{ transitionDuration: `${CHECKOUT_SELECT_DROPDOWN_ANIMATION_MS}ms` }}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Custom checkout dropdown — replaces native select styling. */
export function CheckoutSelect({
  label,
  error,
  disabled,
  placeholder,
  options,
  value,
  onChange,
}: CheckoutSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listboxId = useId();

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;
  const isPlaceholder = !selectedOption;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeDropdown = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
    setIsDropdownExpanded(false);
    closeTimerRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
      closeTimerRef.current = null;
    }, CHECKOUT_SELECT_DROPDOWN_ANIMATION_MS);
  }, [clearCloseTimer]);

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

  const toggleDropdown = useCallback(() => {
    if (disabled) {
      return;
    }

    if (isOpen) {
      closeDropdown();
      return;
    }

    openDropdown();
  }, [closeDropdown, disabled, isOpen, openDropdown]);

  const handleSelect = useCallback(
    (nextValue: string) => {
      onChange(nextValue);
      closeDropdown();
    },
    [closeDropdown, onChange],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeDropdown, isOpen]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  const triggerBorderClass = isOpen
    ? CHECKOUT_SELECT_BORDER_OPEN_CLASS
    : error
      ? 'border-error'
      : CHECKOUT_SELECT_BORDER_CLASS;

  return (
    <div ref={containerRef} className="relative w-full">
      {label ? (
        <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      ) : null}

      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={toggleDropdown}
        className={`flex w-full items-center justify-between gap-3 border bg-white px-4 py-2 text-left transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 ${CHECKOUT_FORM_INPUT_CLASS} ${triggerBorderClass}`}
        style={{ minHeight: CHECKOUT_SELECT_TRIGGER_MIN_HEIGHT_PX }}
      >
        <span className={`truncate text-sm ${isPlaceholder ? 'text-gray-400' : 'text-gray-900'}`}>
          {displayLabel}
        </span>
        <CheckoutSelectChevron isOpen={isOpen} />
      </button>

      {isDropdownVisible ? (
        <ul
          id={listboxId}
          role="listbox"
          className={`absolute left-0 z-50 w-full origin-top overflow-hidden border border-[#f0f0f0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all ease-out ${CHECKOUT_FORM_INPUT_CLASS} ${
            isDropdownExpanded
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-1 opacity-0'
          }`}
          style={{
            top: `calc(100% + ${CHECKOUT_SELECT_DROPDOWN_GAP_PX}px)`,
            transitionDuration: `${CHECKOUT_SELECT_DROPDOWN_ANIMATION_MS}ms`,
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-5 py-3 text-left text-sm transition-colors ${
                    isSelected ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? <p className="mt-1 text-sm text-error">{error}</p> : null}
    </div>
  );
}
