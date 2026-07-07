'use client';

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useClaySelectPortalPosition } from '../lib/use-clay-select-portal-position';
import {
  CLAY_SELECT_BORDER_CLASS,
  CLAY_SELECT_BORDER_OPEN_CLASS,
  CLAY_SELECT_CHEVRON_SIZE_PX,
  CLAY_SELECT_DROPDOWN_ANIMATION_MS,
  CLAY_SELECT_DROPDOWN_GAP_PX,
  CLAY_SELECT_DROPDOWN_PANEL_CLASS,
  CLAY_SELECT_FORM_INPUT_CLASS,
  CLAY_SELECT_OPTION_CLASS,
  CLAY_SELECT_OPTION_SELECTED_CLASS,
  CLAY_SELECT_PORTAL_DROPDOWN_PANEL_CLASS,
  CLAY_SELECT_TRIGGER_BASE_CLASS,
  CLAY_SELECT_TRIGGER_MIN_HEIGHT_PX,
} from '../constants/clay-select';

export interface ClaySelectOption {
  value: string;
  label: string;
}

interface ClaySelectProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder: string;
  options: readonly ClaySelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  compact?: boolean;
  /** Render dropdown in a body portal (default: same as compact — for overflow-hidden tables). */
  portal?: boolean;
  id?: string;
}

export function ClaySelectChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width={CLAY_SELECT_CHEVRON_SIZE_PX}
      height={CLAY_SELECT_CHEVRON_SIZE_PX}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`shrink-0 text-gray-500 transition-transform ease-out ${
        isOpen ? 'rotate-180' : 'rotate-0'
      }`}
      style={{ transitionDuration: `${CLAY_SELECT_DROPDOWN_ANIMATION_MS}ms` }}
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

/** Custom clay dropdown — checkout city picker style. */
export function ClaySelect({
  label,
  error,
  disabled,
  placeholder,
  options,
  value,
  onChange,
  className = '',
  triggerClassName = '',
  compact = false,
  portal: portalProp,
  id,
}: ClaySelectProps) {
  const portal = portalProp ?? compact;
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listboxId = useId();
  const portalPosition = useClaySelectPortalPosition(portal, isOpen, triggerRef);

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
    }, CLAY_SELECT_DROPDOWN_ANIMATION_MS);
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
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) {
        return;
      }
      if (dropdownRef.current?.contains(target)) {
        return;
      }
      closeDropdown();
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
    ? CLAY_SELECT_BORDER_OPEN_CLASS
    : error
      ? 'border-error'
      : CLAY_SELECT_BORDER_CLASS;

  const dropdownPanelClass = portal
    ? `${CLAY_SELECT_PORTAL_DROPDOWN_PANEL_CLASS} ${CLAY_SELECT_FORM_INPUT_CLASS}`
    : `${CLAY_SELECT_DROPDOWN_PANEL_CLASS} ${CLAY_SELECT_FORM_INPUT_CLASS}`;

  const dropdownStyle: CSSProperties = portal
    ? { ...portalPosition, transitionDuration: `${CLAY_SELECT_DROPDOWN_ANIMATION_MS}ms` }
    : {
        top: `calc(100% + ${CLAY_SELECT_DROPDOWN_GAP_PX}px)`,
        transitionDuration: `${CLAY_SELECT_DROPDOWN_ANIMATION_MS}ms`,
      };

  const dropdown = isDropdownVisible ? (
    <ul
      ref={dropdownRef}
      id={listboxId}
      role="listbox"
      className={`${dropdownPanelClass} ${
        isDropdownExpanded
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-1 opacity-0'
      }`}
      style={dropdownStyle}
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <li key={option.value || '__empty__'} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(option.value)}
              className={`${CLAY_SELECT_OPTION_CLASS} ${
                isSelected ? CLAY_SELECT_OPTION_SELECTED_CLASS : ''
              }`}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`.trim()}>
      {label ? (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={toggleDropdown}
        className={`${CLAY_SELECT_TRIGGER_BASE_CLASS} ${triggerBorderClass} ${
          compact ? 'px-2 py-1 text-xs font-medium leading-snug' : ''
        } ${triggerClassName}`.trim()}
        style={{ minHeight: compact ? undefined : CLAY_SELECT_TRIGGER_MIN_HEIGHT_PX }}
      >
        <span
          className={`truncate ${compact ? 'text-xs' : 'text-sm'} ${
            isPlaceholder ? 'text-gray-400' : 'text-gray-900'
          }`}
        >
          {displayLabel}
        </span>
        <ClaySelectChevron isOpen={isOpen} />
      </button>

      {portal && typeof document !== 'undefined'
        ? createPortal(dropdown, document.body)
        : dropdown}

      {error ? <p className="mt-1 text-sm text-error">{error}</p> : null}
    </div>
  );
}
