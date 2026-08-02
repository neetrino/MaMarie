'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import {
  CLAY_DATE_PICKER_DATE_PANEL_ESTIMATED_HEIGHT_PX,
  CLAY_DATE_PICKER_DATE_PANEL_MIN_WIDTH_PX,
  CLAY_DATE_PICKER_DATETIME_PANEL_ESTIMATED_HEIGHT_PX,
  CLAY_DATE_PICKER_DATETIME_PANEL_MIN_WIDTH_PX,
  CLAY_DATE_PICKER_PANEL_GAP_PX,
  CLAY_DATE_PICKER_PORTAL_Z_INDEX,
  CLAY_DATE_PICKER_TRIGGER_CLASS,
  CLAY_DATE_PICKER_VIEWPORT_EDGE_PX,
} from '../constants/clay-date-picker';
import { useTranslation } from '../lib/i18n-client';
import {
  formatClayDatePickerDisplay,
  formatClayDateTimeValue,
  formatClayDateValue,
  parseClayDatePickerValue,
  type ClayDatePickerMode,
} from '../lib/clay-date-picker-utils';
import { ClayDatePickerPanel } from './ClayDatePickerPanel';

interface ClayDatePickerProps {
  id?: string;
  label?: string;
  mode?: ClayDatePickerMode;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

function CalendarIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-brand-pink" fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 3v3M16 3v3M4.5 9h15M6 5.5h12A1.5 1.5 0 0119.5 7v12A1.5 1.5 0 0118 20.5H6A1.5 1.5 0 014.5 19V7A1.5 1.5 0 016 5.5z"
      />
    </svg>
  );
}

/** Brand clay calendar — replaces native `date` / `datetime-local` pickers. */
export function ClayDatePicker({
  id,
  label,
  mode = 'date',
  value,
  onChange,
  disabled = false,
  className = '',
  placeholder,
}: ClayDatePickerProps) {
  const { t, lang } = useTranslation();
  const autoId = useId();
  const fieldId = id ?? autoId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties | undefined>();
  const selectedDate = useMemo(() => parseClayDatePickerValue(value), [value]);
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(() => (selectedDate ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => (selectedDate ?? today).getMonth());

  const displayValue = formatClayDatePickerDisplay(value, mode, lang);
  const placeholderText = placeholder ?? t('common.calendar.placeholder');
  const selectedHour = selectedDate ? String(selectedDate.getHours()).padStart(2, '0') : '00';
  const selectedMinute = selectedDate ? String(selectedDate.getMinutes()).padStart(2, '0') : '00';

  useEffect(() => {
    if (!selectedDate) {
      return;
    }
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
  }, [selectedDate]);

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const minWidth =
      mode === 'datetime'
        ? CLAY_DATE_PICKER_DATETIME_PANEL_MIN_WIDTH_PX
        : CLAY_DATE_PICKER_DATE_PANEL_MIN_WIDTH_PX;
    const estimatedHeight =
      mode === 'datetime'
        ? CLAY_DATE_PICKER_DATETIME_PANEL_ESTIMATED_HEIGHT_PX
        : CLAY_DATE_PICKER_DATE_PANEL_ESTIMATED_HEIGHT_PX;
    const measuredHeight = panelRef.current?.offsetHeight ?? estimatedHeight;
    const width = Math.max(rect.width, minWidth);
    const edge = CLAY_DATE_PICKER_VIEWPORT_EDGE_PX;
    let left = rect.left;
    if (left + width > window.innerWidth - edge) {
      left = Math.max(edge, window.innerWidth - width - edge);
    }

    const spaceBelow = window.innerHeight - rect.bottom - CLAY_DATE_PICKER_PANEL_GAP_PX - edge;
    const spaceAbove = rect.top - CLAY_DATE_PICKER_PANEL_GAP_PX - edge;
    const openAbove = spaceBelow < measuredHeight && spaceAbove > spaceBelow;
    const top = openAbove
      ? Math.max(edge, rect.top - CLAY_DATE_PICKER_PANEL_GAP_PX - measuredHeight)
      : rect.bottom + CLAY_DATE_PICKER_PANEL_GAP_PX;

    setPanelStyle({
      top,
      left,
      width,
      zIndex: CLAY_DATE_PICKER_PORTAL_Z_INDEX,
    });
  }, [mode]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    updatePanelPosition();
    const frameId = requestAnimationFrame(() => {
      updatePanelPosition();
    });
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [isOpen, updatePanelPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const emitValue = (next: Date) => {
    onChange(mode === 'datetime' ? formatClayDateTimeValue(next) : formatClayDateValue(next));
  };

  const selectDay = (date: Date) => {
    const next = new Date(date);
    if (selectedDate && mode === 'datetime') {
      next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
    } else if (mode === 'datetime') {
      next.setHours(0, 0, 0, 0);
    }
    emitValue(next);
    if (mode === 'date') {
      setIsOpen(false);
    }
  };

  const selectTime = (hour: number, minute: number) => {
    const base = selectedDate ?? new Date(viewYear, viewMonth, 1);
    const next = new Date(base);
    next.setHours(hour, minute, 0, 0);
    emitValue(next);
  };

  const goMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const panel =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <ClayDatePickerPanel
            panelRef={panelRef}
            panelStyle={panelStyle}
            mode={mode}
            lang={lang}
            viewYear={viewYear}
            viewMonth={viewMonth}
            selectedDate={selectedDate}
            selectedHour={selectedHour}
            selectedMinute={selectedMinute}
            title={t('common.calendar.title')}
            previousMonthLabel={t('common.calendar.previousMonth')}
            nextMonthLabel={t('common.calendar.nextMonth')}
            clearLabel={t('common.calendar.clear')}
            todayLabel={t('common.calendar.today')}
            onPrevMonth={() => goMonth(-1)}
            onNextMonth={() => goMonth(1)}
            onSelectDay={selectDay}
            onSelectTime={selectTime}
            onClear={() => {
              onChange('');
              setIsOpen(false);
            }}
            onToday={() => {
              const now = new Date();
              emitValue(now);
              setViewYear(now.getFullYear());
              setViewMonth(now.getMonth());
              if (mode === 'date') {
                setIsOpen(false);
              }
            }}
          />,
          document.body,
        )
      : null;

  return (
    <div className={`w-full ${className}`.trim()}>
      {label ? (
        <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <button
        ref={triggerRef}
        id={fieldId}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={CLAY_DATE_PICKER_TRIGGER_CLASS}
        onClick={() => {
          if (!disabled) {
            setIsOpen((open) => !open);
          }
        }}
      >
        <span className={displayValue ? 'text-gray-900' : 'text-gray-400'}>
          {displayValue || placeholderText}
        </span>
        <CalendarIcon />
      </button>
      {panel}
    </div>
  );
}
