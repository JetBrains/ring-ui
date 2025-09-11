import {type ReactNode} from 'react';
import {add} from 'date-fns/add';

import type {Duration, Locale} from 'date-fns';

const unit = 8; // px;
const units = {
  unit,
  /* eslint-disable @typescript-eslint/no-magic-numbers */
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

export function parseTime(time: string) {
  let result = null;
  if (/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    result = time;
  } else if (/^([0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    result = `0${time}`;
  }

  return result;
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

export interface DateInputTranslations {
  addFirstDate?: string;
  addSecondDate?: string;
  addTime?: string;
  selectName?: string;
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

export interface DatePopupState {
  active: Field;
  text: string | null;
  hoverDate: Date | null;
  scrollDate: number | null;
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
  scrollDate: number | Date;
  currentRange: [Date, Date] | null;
  activeRange: [Date, Date] | null;
  onScroll: (to: number) => void;
  onScrollChange: (date: number) => void;
}

export interface MonthsProps extends CalendarProps {
  onSelect: (date: Date) => void;
  onHover: (date: Date) => void;
}

export type Field = 'date' | 'time' | 'from' | 'to';
