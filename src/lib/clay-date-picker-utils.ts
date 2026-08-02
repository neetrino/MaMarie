import type { LanguageCode } from './language';

export type ClayDatePickerMode = 'date' | 'datetime';

const LOCALE_BY_LANG: Record<LanguageCode, string> = {
  hy: 'hy-AM',
  ru: 'ru-RU',
  en: 'en-US',
  ka: 'ka-GE',
};

export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm` → Date in local time. */
export function parseClayDatePickerValue(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(trimmed);
  if (!dateMatch) {
    return null;
  }
  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]) - 1;
  const day = Number(dateMatch[3]);
  const hours = dateMatch[4] ? Number(dateMatch[4]) : 0;
  const minutes = dateMatch[5] ? Number(dateMatch[5]) : 0;
  const date = new Date(year, month, day, hours, minutes, 0, 0);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

export function formatClayDateValue(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function formatClayDateTimeValue(date: Date): string {
  return `${formatClayDateValue(date)}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function formatClayDatePickerDisplay(
  value: string,
  mode: ClayDatePickerMode,
  lang: LanguageCode,
): string {
  const date = parseClayDatePickerValue(value);
  if (!date) {
    return '';
  }
  const locale = LOCALE_BY_LANG[lang] ?? 'hy-AM';
  if (mode === 'date') {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function getClayCalendarMonthLabel(
  year: number,
  monthIndex: number,
  lang: LanguageCode,
): string {
  const locale = LOCALE_BY_LANG[lang] ?? 'hy-AM';
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(year, monthIndex, 1),
  );
}

/** Monday-first weekday labels. */
export function getClayCalendarWeekdayLabels(lang: LanguageCode): string[] {
  const locale = LOCALE_BY_LANG[lang] ?? 'hy-AM';
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // 2024-01-01 is Monday.
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(2024, 0, 1 + index)),
  );
}

export interface ClayCalendarDayCell {
  date: Date;
  day: number;
  inCurrentMonth: boolean;
  key: string;
}

/** Monday-first month grid (6 weeks). */
export function buildClayCalendarDays(year: number, monthIndex: number): ClayCalendarDayCell[] {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const mondayBasedIndex = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, monthIndex, 1 - mondayBasedIndex);
  const cells: ClayCalendarDayCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );
    cells.push({
      date,
      day: date.getDate(),
      inCurrentMonth: date.getMonth() === monthIndex,
      key: formatClayDateValue(date),
    });
  }

  return cells;
}

export function isSameClayCalendarDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export const CLAY_DATE_PICKER_HOURS = Array.from({ length: 24 }, (_, hour) => pad2(hour));
export const CLAY_DATE_PICKER_MINUTES = Array.from({ length: 60 }, (_, minute) => pad2(minute));
