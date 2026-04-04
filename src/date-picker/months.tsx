import {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {addMonths} from 'date-fns/addMonths';
import {getDay} from 'date-fns/getDay';
import {getDaysInMonth} from 'date-fns/getDaysInMonth';
import {startOfMonth} from 'date-fns/startOfMonth';
import {subMonths} from 'date-fns/subMonths';

import Month from './month';
import MonthNames from './month-names';
import units, {DOUBLE, HALF, type MonthsProps, WEEK, weekdays} from './consts';
import scheduleRAF from '../global/schedule-raf';

import styles from './date-picker.css';

const {unit, cellSize, calHeight} = units;

const FridayToSunday = WEEK + weekdays.SU - weekdays.FR;
const FIVELINES = 31;
const TALLMONTH = 6;
const SHORTMONTH = 5;
const PADDING = 2;

const EMPTY_MONTHSBACK = 3;
const NONEMPTY_MONTHSBACK = 2;
const MONTHSBACK = EMPTY_MONTHSBACK + NONEMPTY_MONTHSBACK;

const SCROLL_HANDLE_RESUME_DELAY = 10;

function monthHeight(date: Date | number) {
  const monthStart = startOfMonth(date);
  const daysSinceLastFriday = (getDay(monthStart) + FridayToSunday) % WEEK;
  const monthLines = daysSinceLastFriday + getDaysInMonth(monthStart) > FIVELINES ? TALLMONTH : SHORTMONTH;
  return monthLines * cellSize + unit * PADDING;
}

function getMonths(scrollDate: Date | number) {
  const monthStart = startOfMonth(new Date(scrollDate));

  let month = subMonths(monthStart, MONTHSBACK);

  const months = [month];
  for (let i = 0; i < MONTHSBACK * DOUBLE; i++) {
    month = addMonths(month, 1);
    months.push(month);
  }
  return months;
}

/**
 * Will put the scroll date in the middle of the calendar.
 */
function getScrollTopFromDate(months: Date[], scrollDate: Date | number) {
  const monthStart = Number(startOfMonth(new Date(scrollDate)));
  const nextMonthStart = Number(addMonths(monthStart, 1));
  const monthFraction = (Number(scrollDate) - monthStart) / (nextMonthStart - monthStart);
  const scrollDateOffsetFromMonthStart = monthFraction * monthHeight(months[MONTHSBACK]);
  return monthsBackHeight(months) + scrollDateOffsetFromMonthStart - calHeight * HALF;
}

/**
 * Returns date which is in the middle of the visible area.
 */
function getDateFromScrollPosition(months: Date[], scrollTop: number) {
  const scrollDateOffsetFromMonthStart = scrollTop - (monthsBackHeight(months) - calHeight * HALF);
  const monthStart = Number(startOfMonth(months[MONTHSBACK]));
  const nextMonthStart = Number(addMonths(monthStart, 1));
  const monthFraction = scrollDateOffsetFromMonthStart / monthHeight(months[MONTHSBACK]);
  return new Date(monthStart + monthFraction * (nextMonthStart - monthStart));
}

function monthsBackHeight(months: Date[]) {
  return months.slice(0, MONTHSBACK).reduce((h, month) => h + monthHeight(month), 0);
}

const scheduleScroll = scheduleRAF();

export default function Months(props: MonthsProps) {
  const {scrollDate, onScroll} = props;

  const [months, setMonths] = useState(getMonths(scrollDate));
  const [initialScrollTop, setInitialScrollTop] = useState(getScrollTopFromDate(months, scrollDate));

  const componentRef = useRef<HTMLDivElement>(null);
  const pauseScrollHandlingRef = useRef(false);

  useLayoutEffect(() => {
    if (componentRef.current) {
      componentRef.current.scrollTop = initialScrollTop;
      setTimeout(() => {
        pauseScrollHandlingRef.current = false;
      }, SCROLL_HANDLE_RESUME_DELAY);
    }
  }, [initialScrollTop]);

  const handleScroll = useCallback(() => {
    scheduleScroll(() => {
      if (pauseScrollHandlingRef.current) return;

      const scrollTop = componentRef.current?.scrollTop;
      if (scrollTop == null) return;

      const newScrollDate = getDateFromScrollPosition(months, scrollTop);
      const newScrollDateNum = Number(newScrollDate);

      onScroll(newScrollDateNum);

      const newScrollDateIndex = months.findLastIndex(month => newScrollDateNum >= Number(month));
      if (newScrollDateIndex !== MONTHSBACK) {
        const newMonths = getMonths(newScrollDate);
        const newScrollTop = getScrollTopFromDate(newMonths, newScrollDate);

        setMonths(newMonths);
        setInitialScrollTop(newScrollTop);

        pauseScrollHandlingRef.current = true;
      }
    });
  }, [months, onScroll]);

  return (
    <div className={styles.months} ref={componentRef} onScroll={handleScroll}>
      <div>
        {months.map((date, i) =>
          i < EMPTY_MONTHSBACK || i >= months.length - EMPTY_MONTHSBACK ? (
            <div style={{height: monthHeight(date)}} key={+date} />
          ) : (
            <Month {...props} month={date} key={+date} />
          ),
        )}
      </div>
      <MonthNames {...props} />
    </div>
  );
}
