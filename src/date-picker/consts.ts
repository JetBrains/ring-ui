import {type ReactNode} from 'react';
import {add} from 'date-fns/add';
import {endOfDay, type Duration, type Locale} from 'date-fns';

import sniffer from '../global/sniffer';

const unit = 8; // px;
const units = {
  unit,
  /* eslint-disable no-magic-numbers */
  cellSize: unit * 3,
  calHeight: unit * 36,
  yearHeight: unit * 4,
  /* eslint-enable */
};

export default units;

export const YEAR = 12;
export const WEEK = 7;
export const FIFTH_DAY = 4;
export const weekdays = {
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
  SU: 0,
};
export const MIDDLE_DAY = 15;

const durationToMillis = (duration: Duration) => +add(0, duration);

export const yearDuration = durationToMillis({years: 1});
export const yearScrollSpeed = yearDuration / (YEAR * units.cellSize);

export const DOUBLE = 2;
export const HALF = 0.5;

export function parseTime(time: string | null | undefined) {
  if (!time) return null;

  if (/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return time;
  }

  if (/^([0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return `0${time}`;
  }

  return null;
}

export function shiftWeekArray<T>(arr: T[], startOfWeek: number) {
  const shiftTimes = startOfWeek - 1;
  return arr.slice(shiftTimes).concat(arr.slice(0, shiftTimes));
}

export function getWeekStartsOn(locale: Locale | undefined): number {
  return locale?.options?.weekStartsOn ?? weekdays.MO;
}

export function getDayNumInWeek(locale: Locale | undefined, day: number): number {
  const weekDays = shiftWeekArray(Object.values(weekdays), getWeekStartsOn(locale));
  return weekDays.indexOf(day);
}

export function getDefaultScrollDate({
  minDate,
  maxDate,
  parseDateInput,
}: Pick<DatePopupBaseProps, 'minDate' | 'maxDate' | 'parseDateInput'>): Date {
  const minDateParsed = parseDateInput(minDate);
  const maxDateParsed = parseDateInput(maxDate);
  const maxDateEndOfDayNum = maxDateParsed ? Number(endOfDay(maxDateParsed)) : null;
  const now = Date.now();

  if (minDateParsed != null && maxDateEndOfDayNum != null) {
    if (minDateParsed.getTime() <= now && now <= maxDateEndOfDayNum) {
      return new Date(now);
    }
    return minDateParsed;
  }
  if (minDateParsed != null && minDateParsed.getTime() > now) {
    return minDateParsed;
  }
  if (maxDateParsed != null && maxDateEndOfDayNum != null && maxDateEndOfDayNum < now) {
    return maxDateParsed;
  }
  return new Date(now);
}

export interface DateInputTranslations {
  addFirstDate?: string;
  addSecondDate?: string;
  addTime?: string;
  selectName?: string;
  selectDate?: string;
}

export interface DateSpecificPopupProps {
  withTime?: false | undefined;
  range?: false | undefined;
  onChange: (date: Date | null | undefined) => void;
}

export interface DatePickerChange {
  from?: Date | null | undefined;
  to?: Date | null | undefined;
  date?: Date | null | undefined;
  time?: string | null | undefined;
}

export interface TimeSpecificPopupProps {
  withTime: true;
  range?: false | undefined;
  onChange: (change: DatePickerChange) => void;
}

export interface RangeSpecificPopupProps {
  withTime?: false | undefined;
  range: true;
  onChange: (change: DatePickerChange) => void;
}

export interface ScrollDate {
  date: number | Date;
  source: 'monthsScroll' | 'yearsScroll' | 'other';
}

export interface DatePopupState {
  active: Field;
  text: string | null;
  hoverDate: Date | null;
  scrollDate: ScrollDate | null;
}

export interface DatePopupBaseProps {
  date?: Date | number | string | null | undefined;
  time?: string | null | undefined;
  from?: Date | number | string | null | undefined;
  to?: Date | number | string | null | undefined;
  minDate?: string | null | undefined;
  maxDate?: string | null | undefined;
  translations?: DateInputTranslations | null | undefined;
  fromPlaceholder?: string | null | undefined;
  toPlaceholder?: string | null | undefined;
  timePlaceholder?: string | null | undefined;
  locale?: Locale | undefined;
  parseDateInput: (text: Date | number | string | null | undefined) => Date | null;
  displayFormat: (date: Date, locale: Locale | undefined) => string;
  onComplete: () => void;
  onClear?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | null | undefined;
  renderAfterCalendar?: ((state: DatePopupState) => ReactNode) | undefined;
}

export interface Dates {
  from?: Date | null | undefined;
  to?: Date | null | undefined;
  date?: Date | null | undefined;
  time?: never;
}

export interface CalendarProps extends Omit<DatePopupBaseProps, 'date' | 'from' | 'to' | 'time'>, Dates {
  activeDate: Date | null;
  scrollDate: ScrollDate;
  currentRange: [Date, Date] | null;
  activeRange: [Date, Date] | null;
  setScrollDate: (scrollDate: ScrollDate) => void;
}

export interface MonthsProps extends CalendarProps {
  onSelect: (date: Date) => void;
  onHover: (date: Date) => void;
}

export type Field = 'date' | 'time' | 'from' | 'to';

/**
 * Safari on iPhone doesn't allow setting scrollTop while a scroll is in progress.
 * If you do, the browser will overwrite it during the next scroll event.
 * This behavior occurs both during inertia scrolling and when the user is actively scrolling with a finger.
 *
 * In this environment, we:
 * 1) only re-render when the scroll position is within a few pixels of the edge, and
 * 2) only act after scrolling has ended.
 */
export const isSafariOnIPhone = sniffer.browser.name === 'safari' && sniffer.device.name === 'iphone';

export const scrollerReRenderDelayIPhone = 100;

// eslint-disable-next-line no-magic-numbers
export const calendarSyncOnYearScrollUpdateDelay = isSafariOnIPhone ? 130 : 100;

export const dateAnimationDuration = 150;

export const yearsAnimationDuration = 200;
