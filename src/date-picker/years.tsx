import {useCallback, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {addYears} from 'date-fns/addYears';
import {getYear} from 'date-fns/getYear';
import {format} from 'date-fns/format';
import {isSameYear} from 'date-fns/isSameYear';
import {isThisYear} from 'date-fns/isThisYear';
import {setYear} from 'date-fns/setYear';
import {startOfYear} from 'date-fns/startOfYear';

import units, {type ScrollDate, type CalendarProps} from './consts';
import {ScrollArith} from './scroll-arith';
import scheduleRAF from '../global/schedule-raf';
import {useScrollBehavior} from './scroll-behavior';

import styles from './date-picker.css';

const {yearHeight} = units;
// eslint-disable-next-line no-magic-numbers
const emptyYearHeight = yearHeight * 30;

const EMPTY_YEARSBACK = 1;
const NONEMPTY_YEARSBACK = 10;
const YEARSBACK = EMPTY_YEARSBACK + NONEMPTY_YEARSBACK;
const LOCAL_TO_CALENDAR_SYNC_DELAY = 100;

const scrollArith = new ScrollArith({
  itemsAround: YEARSBACK,
  floorToItem: startOfYear,
  shiftItems: addYears,
  getItemHeight: (_y, index, items) =>
    EMPTY_YEARSBACK <= index && index < items.length - EMPTY_YEARSBACK ? yearHeight : emptyYearHeight,
});

const scheduleScroll = scheduleRAF();

export default function Years({scrollDate, setScrollDate}: CalendarProps) {
  const [localScrollDate, setLocalScrollDate] = useState<ScrollDate>(scrollDate);

  const timerIdRef = useRef<number | null>(null);

  useEffect(
    function syncLocalToCalendar() {
      timerIdRef.current = window.setTimeout(() => {
        setScrollDate(localScrollDate);
      }, LOCAL_TO_CALENDAR_SYNC_DELAY);

      return () => {
        if (timerIdRef.current != null) {
          window.clearTimeout(timerIdRef.current);
          timerIdRef.current = null;
        }
      };
    },
    [localScrollDate, setScrollDate],
  );

  useEffect(
    function syncCalendarToLocal() {
      if (scrollDate.source === 'yearsScroll') return;
      scheduleScroll(() => {
        setLocalScrollDate(scrollDate);
      });
    },
    [scrollDate, setLocalScrollDate],
  );

  const handleYearClick = useCallback(
    (year: Date) => {
      const newScrollDate = setYear(localScrollDate.date, getYear(year));
      setScrollDate({
        date: newScrollDate,
        source: 'other',
      });
    },
    [localScrollDate, setScrollDate],
  );

  const {containerRef, handleScroll, items} = useScrollBehavior(
    localScrollDate,
    setLocalScrollDate,
    'yearsScroll',
    scrollArith,
    scheduleScroll,
  );

  return (
    <div className={styles.years} ref={containerRef} onScroll={handleScroll}>
      {items.map((year, i) =>
        EMPTY_YEARSBACK <= i && i < items.length - EMPTY_YEARSBACK ? (
          <button
            type='button'
            key={+year}
            className={classNames(styles.year, {
              [styles.currentYear]: isSameYear(year, localScrollDate.date),
              [styles.today]: isThisYear(year),
            })}
            onClick={() => handleYearClick(year)}
          >
            {format(year, 'yyyy')}
          </button>
        ) : (
          <div style={{height: emptyYearHeight}} key={+year} />
        ),
      )}
    </div>
  );
}
