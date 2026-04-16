import {addDays} from 'date-fns/addDays';
import {format} from 'date-fns/format';
import {getDay} from 'date-fns/getDay';
import {setDay} from 'date-fns/setDay';
import {addMonths, differenceInCalendarDays, type Locale, startOfMonth} from 'date-fns';
import {useMemo} from 'react';

import Day from './day';
import {type MonthsProps, WEEK, weekdays, shiftWeekArray, getWeekStartsOn, FIFTH_DAY} from './consts';

import styles from './date-picker.css';

export interface MonthProps extends MonthsProps {
  month: Date;
}

export default function Month(props: MonthProps) {
  const start = props.month;
  const {locale} = props;

  const startAsNum = Number(start);
  const days = useMemo(() => {
    const {startDay, daysNumber} = getVisualMonthDays(startAsNum, locale);
    const arr = [startDay];
    while (arr.length < daysNumber) {
      const prev = arr[arr.length - 1];
      const next = addDays(prev, 1);
      arr.push(next);
    }
    return arr;
  }, [startAsNum, locale]);

  return (
    <div className={styles.month}>
      <span className={styles.monthTitle}>{format(props.month, 'LLLL', {locale})}</span>
      {days.map(date => (
        <Day {...props} day={date} empty={date < start} key={+date} />
      ))}
    </div>
  );
}

export function getVisualMonthDays(date: Date | number, locale: Locale | undefined) {
  const start = startOfMonth(date);
  const nextStart = addMonths(start, 1);
  // pad with empty cells starting from last 5th weekday
  const weekday = getDay(start);
  const weekDays = shiftWeekArray(Object.values(weekdays), getWeekStartsOn(locale));
  const fifthDayOfWeek = weekDays[FIFTH_DAY];
  const startDay = setDay(start, weekday >= fifthDayOfWeek ? fifthDayOfWeek : fifthDayOfWeek - WEEK);
  const daysNumber = differenceInCalendarDays(nextStart, startDay);
  return {startDay, daysNumber};
}
