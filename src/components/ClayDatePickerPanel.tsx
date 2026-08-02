'use client';

import type { CSSProperties, RefObject } from 'react';
import {
  CLAY_DATE_PICKER_DAY_BUTTON_CLASS,
  CLAY_DATE_PICKER_DAY_DEFAULT_CLASS,
  CLAY_DATE_PICKER_DAY_MUTED_CLASS,
  CLAY_DATE_PICKER_DAY_SELECTED_CLASS,
  CLAY_DATE_PICKER_DAY_TODAY_CLASS,
  CLAY_DATE_PICKER_PANEL_CLASS,
  CLAY_DATE_PICKER_TIME_COLUMN_HEIGHT_PX,
  CLAY_DATE_PICKER_TIME_DEFAULT_CLASS,
  CLAY_DATE_PICKER_TIME_OPTION_CLASS,
  CLAY_DATE_PICKER_TIME_SELECTED_CLASS,
} from '../constants/clay-date-picker';
import type { LanguageCode } from '../lib/language';
import {
  buildClayCalendarDays,
  CLAY_DATE_PICKER_HOURS,
  CLAY_DATE_PICKER_MINUTES,
  getClayCalendarMonthLabel,
  getClayCalendarWeekdayLabels,
  isSameClayCalendarDay,
  type ClayDatePickerMode,
} from '../lib/clay-date-picker-utils';

interface ClayDatePickerPanelProps {
  panelRef: RefObject<HTMLDivElement | null>;
  panelStyle: CSSProperties | undefined;
  mode: ClayDatePickerMode;
  lang: LanguageCode;
  viewYear: number;
  viewMonth: number;
  selectedDate: Date | null;
  selectedHour: string;
  selectedMinute: string;
  title: string;
  previousMonthLabel: string;
  nextMonthLabel: string;
  clearLabel: string;
  todayLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (date: Date) => void;
  onSelectTime: (hour: number, minute: number) => void;
  onClear: () => void;
  onToday: () => void;
}

/** Portaled clay calendar panel (date grid + optional time columns). */
export function ClayDatePickerPanel({
  panelRef,
  panelStyle,
  mode,
  lang,
  viewYear,
  viewMonth,
  selectedDate,
  selectedHour,
  selectedMinute,
  title,
  previousMonthLabel,
  nextMonthLabel,
  clearLabel,
  todayLabel,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  onSelectTime,
  onClear,
  onToday,
}: ClayDatePickerPanelProps) {
  const weekdays = getClayCalendarWeekdayLabels(lang);
  const days = buildClayCalendarDays(viewYear, viewMonth);
  const today = new Date();

  return (
    <div
      ref={panelRef}
      className={CLAY_DATE_PICKER_PANEL_CLASS}
      style={panelStyle}
      role="dialog"
      aria-label={title}
    >
      <div className={`flex ${mode === 'datetime' ? 'flex-row' : 'flex-col'}`}>
        <div className="min-w-0 flex-1 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[#fdeef2] hover:text-brand-pink"
              onClick={onPrevMonth}
              aria-label={previousMonthLabel}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden>
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p className="text-sm font-semibold capitalize text-gray-900">
              {getClayCalendarMonthLabel(viewYear, viewMonth, lang)}
            </p>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[#fdeef2] hover:text-brand-pink"
              onClick={onNextMonth}
              aria-label={nextMonthLabel}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden>
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1">
            {weekdays.map((weekday) => (
              <div
                key={weekday}
                className="flex h-8 items-center justify-center text-xs font-medium text-gray-400"
              >
                {weekday}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((cell) => {
              const isSelected = selectedDate
                ? isSameClayCalendarDay(cell.date, selectedDate)
                : false;
              const isToday = isSameClayCalendarDay(cell.date, today);
              const dayClass = [
                CLAY_DATE_PICKER_DAY_BUTTON_CLASS,
                isSelected
                  ? CLAY_DATE_PICKER_DAY_SELECTED_CLASS
                  : !cell.inCurrentMonth
                    ? CLAY_DATE_PICKER_DAY_MUTED_CLASS
                    : isToday
                      ? CLAY_DATE_PICKER_DAY_TODAY_CLASS
                      : CLAY_DATE_PICKER_DAY_DEFAULT_CLASS,
              ].join(' ');

              return (
                <button
                  key={cell.key}
                  type="button"
                  className={dayClass}
                  onClick={() => onSelectDay(cell.date)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>

        {mode === 'datetime' ? (
          <div
            className="flex gap-2 border-l border-gray-100 px-3 py-4"
            style={{ height: CLAY_DATE_PICKER_TIME_COLUMN_HEIGHT_PX + 72 }}
          >
            <div
              className="w-12 overflow-y-auto overscroll-contain"
              style={{ maxHeight: CLAY_DATE_PICKER_TIME_COLUMN_HEIGHT_PX }}
            >
              {CLAY_DATE_PICKER_HOURS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  className={`${CLAY_DATE_PICKER_TIME_OPTION_CLASS} ${
                    hour === selectedHour
                      ? CLAY_DATE_PICKER_TIME_SELECTED_CLASS
                      : CLAY_DATE_PICKER_TIME_DEFAULT_CLASS
                  }`}
                  onClick={() => onSelectTime(Number(hour), Number(selectedMinute))}
                >
                  {hour}
                </button>
              ))}
            </div>
            <div
              className="w-12 overflow-y-auto overscroll-contain"
              style={{ maxHeight: CLAY_DATE_PICKER_TIME_COLUMN_HEIGHT_PX }}
            >
              {CLAY_DATE_PICKER_MINUTES.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  className={`${CLAY_DATE_PICKER_TIME_OPTION_CLASS} ${
                    minute === selectedMinute
                      ? CLAY_DATE_PICKER_TIME_SELECTED_CLASS
                      : CLAY_DATE_PICKER_TIME_DEFAULT_CLASS
                  }`}
                  onClick={() => onSelectTime(Number(selectedHour), Number(minute))}
                >
                  {minute}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <button
          type="button"
          className="text-sm font-medium text-brand-pink transition-opacity hover:opacity-80"
          onClick={onClear}
        >
          {clearLabel}
        </button>
        <button
          type="button"
          className="text-sm font-medium text-brand-pink transition-opacity hover:opacity-80"
          onClick={onToday}
        >
          {todayLabel}
        </button>
      </div>
    </div>
  );
}
