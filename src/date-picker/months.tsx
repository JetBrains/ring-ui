import {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {addMonths} from 'date-fns/addMonths';
import {getDay} from 'date-fns/getDay';
import {getDaysInMonth} from 'date-fns/getDaysInMonth';
import {startOfMonth} from 'date-fns/startOfMonth';

import Month from './month';
import MonthNames from './month-names';
import units, {type MonthsProps, WEEK, weekdays} from './consts';
import scheduleRAF from '../global/schedule-raf';
import {ScrollHelper} from './scroll-helper';

import styles from './date-picker.css';

const {unit, cellSize} = units;

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

const scrollHelper = new ScrollHelper({
  itemsBack: MONTHSBACK,
  getItem: startOfMonth,
  addItems: addMonths,
  getItemHeight: monthHeight,
});

const scheduleScroll = scheduleRAF();

export default function Months(props: MonthsProps) {
  const {scrollDate, onScroll} = props;

  const [scrollerState, setScrollerState] = useState(() => scrollHelper.getState(scrollDate));

  const componentRef = useRef<HTMLDivElement>(null);
  const pauseScrollHandlingRef = useRef(false);

  useLayoutEffect(() => {
    if (!componentRef.current) return undefined;

    componentRef.current.scrollTop = scrollerState.scrollTop;
    const timeoutId = setTimeout(() => {
      pauseScrollHandlingRef.current = false;
    }, SCROLL_HANDLE_RESUME_DELAY);
    return () => clearTimeout(timeoutId);
  }, [scrollerState]);

  const handleScroll = useCallback(() => {
    scheduleScroll(() => {
      if (pauseScrollHandlingRef.current) return;

      const scrollTop = componentRef.current?.scrollTop;
      if (scrollTop == null) return;

      const newScrollDate = scrollHelper.getScrollDate(scrollerState.items, scrollTop);
      onScroll(Number(newScrollDate));

      if (!scrollHelper.isMidItem(scrollerState.items, newScrollDate)) {
        setScrollerState(scrollHelper.getState(newScrollDate));
        pauseScrollHandlingRef.current = true;
      }
    });
  }, [onScroll, scrollerState]);

  return (
    <div className={styles.months} ref={componentRef} onScroll={handleScroll}>
      <div>
        {scrollerState.items.map((month, i) =>
          i < EMPTY_MONTHSBACK || i >= scrollerState.items.length - EMPTY_MONTHSBACK ? (
            <div style={{height: monthHeight(month)}} key={+month} />
          ) : (
            <Month {...props} month={month} key={+month} />
          ),
        )}
      </div>
      <MonthNames {...props} />
    </div>
  );
}
