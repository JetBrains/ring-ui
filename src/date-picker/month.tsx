import {format} from 'date-fns/format';
import {getDay} from 'date-fns/getDay';
import {getDaysInMonth, type Locale, setDate} from 'date-fns';

import Day from './day';
import units, {type MonthsProps, WEEK, getWeekStartsOn} from './consts';

import styles from './date-picker.css';

export interface MonthProps extends MonthsProps {
  month: Date;
}

export default function Month(props: MonthProps) {
  const {month, locale} = props;

  const paddingCells = getPaddingCells(month, locale);

  return (
    <div className={styles.month}>
      <span className={styles.monthTitle}>{format(month, 'LLLL', {locale})}</span>
      {Array.from({length: paddingCells}, (_, i) => (
        <Day {...props} day={new Date(0)} empty key={`e_${i}`} />
      ))}
      {Array.from({length: getDaysInMonth(month)}, (_, i) => (
        <Day {...props} day={setDate(month, i + 1)} empty={false} key={i} />
      ))}
    </div>
  );
}

const cellsPerMonthName = 4;

/**
 * Between the month name and the first month day
 */
function getPaddingCells(monthStart: Date | number, locale: Locale | undefined) {
  const monthStartWeekdaySundayBased = getDay(monthStart);
  const weekStartDay = getWeekStartsOn(locale);
  const monthStartWeekday = (monthStartWeekdaySundayBased - weekStartDay + WEEK) % WEEK;

  if (monthStartWeekday >= cellsPerMonthName) return monthStartWeekday - cellsPerMonthName;

  const upperPadding = WEEK - cellsPerMonthName;
  const lowerPadding = monthStartWeekday;
  return upperPadding + lowerPadding;
}

export function getMonthHeight(monthStart: Date | number, locale: Locale | undefined) {
  const totalCells = cellsPerMonthName + getPaddingCells(monthStart, locale) + getDaysInMonth(new Date(monthStart));
  const monthLines = Math.ceil(totalCells / WEEK);

  return monthLines * units.cellSize;
}
