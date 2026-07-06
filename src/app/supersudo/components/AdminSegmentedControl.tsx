'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ADMIN_SEGMENTED_BUTTON_ACTIVE_CLASS,
  ADMIN_SEGMENTED_BUTTON_INACTIVE_CLASS,
  ADMIN_SEGMENTED_SLIDE_MS,
  ADMIN_SEGMENTED_SLIDER_CLASS,
  ADMIN_SEGMENTED_TRACK_CLASS,
} from '../../../constants/admin-segmented-control';

export interface AdminSegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface AdminSegmentedControlProps<T extends string> {
  options: readonly AdminSegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
}

/** Pill tabs with sliding indicator — admin users role filter, etc. */
export function AdminSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: AdminSegmentedControlProps<T>) {
  const [slideAnimationEnabled, setSlideAnimationEnabled] = useState(false);
  const columnCount = options.length;

  const activeIndex = useMemo(() => {
    const index = options.findIndex((option) => option.value === value);
    return index >= 0 ? index : 0;
  }, [options, value]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setSlideAnimationEnabled(true);
    });
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className={ADMIN_SEGMENTED_TRACK_CLASS}
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      role="group"
      aria-label={ariaLabel}
    >
      <span
        aria-hidden
        className={ADMIN_SEGMENTED_SLIDER_CLASS}
        style={{
          width: `calc((100% - 8px) / ${columnCount})`,
          transform: `translateX(calc(${activeIndex} * 100%))`,
          transitionProperty: 'transform',
          transitionDuration: slideAnimationEnabled ? `${ADMIN_SEGMENTED_SLIDE_MS}ms` : '0ms',
        }}
      />

      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative z-10 whitespace-nowrap rounded-full px-3 py-1 transition-colors ${
              isActive ? ADMIN_SEGMENTED_BUTTON_ACTIVE_CLASS : ADMIN_SEGMENTED_BUTTON_INACTIVE_CLASS
            }`}
            style={{
              transitionDuration: slideAnimationEnabled ? `${ADMIN_SEGMENTED_SLIDE_MS}ms` : '0ms',
            }}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
