import {useCallback, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {addYears} from 'date-fns/addYears';
import {getYear} from 'date-fns/getYear';
import {format} from 'date-fns/format';
import {isSameYear} from 'date-fns/isSameYear';
import {isThisYear} from 'date-fns/isThisYear';
import {setYear} from 'date-fns/setYear';
import {startOfYear} from 'date-fns/startOfYear';

import units, {
  type ScrollDate,
  type CalendarProps,
  calendarSyncOnYearScrollUpdateDelay,
  yearsAnimationDuration,
} from './consts';
import {ScrollArith} from './scroll-arith';
import {useScrollBehavior} from './use-scroll-behavior';
import {animateDate} from './animate-date';
import scheduleRAF from '../global/schedule-raf';
import {
  IntersectionObserverContext,
  useIntersectionObserverHandle,
  useIsIntersecting,
} from '../global/intersection-observer-context';

import styles from './date-picker.css';

const {yearHeight} = units;

const scrollArith = new ScrollArith({
  itemsAround: 100,
  floorToItem: startOfYear,
  shiftItems: addYears,
  getItemHeight: () => yearHeight,
});

const scheduleScroll = scheduleRAF();

/**
 * Reduces "empty" years during fast scrolling.
 */
const intersectionObserverRootMargin = units.calHeight / 2;

export default function Years({scrollDate, setScrollDate}: CalendarProps) {
  const [localScrollDate, setLocalScrollDate] = useState<ScrollDate>(scrollDate);

  const syncCleanupRef = useRef<(() => void) | null>(null);
  const animationCleanupRef = useRef<(() => void) | null>(null);

  const syncCalendarScrollDate = useCallback(
    (newLocalScrollDate: ScrollDate) => {
      syncCleanupRef.current?.();
      animationCleanupRef.current?.();

      let timerId: number | null = window.setTimeout(() => {
        const newScrollDateWithPreservedMonthAndDay = setYear(scrollDate.date, getYear(newLocalScrollDate.date));
        setScrollDate({
          date: newScrollDateWithPreservedMonthAndDay,
          source: 'yearsScroll',
        });
        animationCleanupRef.current = animateDate(
          newLocalScrollDate.date,
          newScrollDateWithPreservedMonthAndDay,
          date => {
            setLocalScrollDate({
              date,
              source: 'other',
            });
          },
          yearsAnimationDuration,
        );
      }, calendarSyncOnYearScrollUpdateDelay);

      syncCleanupRef.current = () => {
        if (timerId != null) {
          window.clearTimeout(timerId);
          timerId = null;
        }
      };
    },
    [scrollDate, setScrollDate, setLocalScrollDate],
  );

  useEffect(
    () =>
      function cleanup() {
        syncCleanupRef.current?.();
        animationCleanupRef.current?.();
      },
    [],
  );

  useEffect(
    function syncLocalScrollDate() {
      if (scrollDate.source === 'yearsScroll') return;

      let timerId: number | null = window.setTimeout(() => {
        setLocalScrollDate(scrollDate);
        timerId = null;
      });
      return () => {
        if (timerId != null) {
          window.clearTimeout(timerId);
          timerId = null;
        }
      };
    },
    [scrollDate, setLocalScrollDate],
  );

  const handleYearClick = useCallback(
    (year: Date) => {
      const newScrollDate = setYear(localScrollDate.date, getYear(year));
      setScrollDate({
        date: newScrollDate,
        source: 'yearsScroll',
      });

      syncCleanupRef.current?.();
      animationCleanupRef.current?.();

      animationCleanupRef.current = animateDate(
        localScrollDate.date,
        newScrollDate,
        date => {
          setLocalScrollDate({
            date,
            source: 'other',
          });
        },
        yearsAnimationDuration,
      );
    },
    [localScrollDate.date, setScrollDate],
  );

  const {containerRef, items} = useScrollBehavior(
    localScrollDate,
    syncCalendarScrollDate,
    undefined,
    'yearsScroll',
    scrollArith,
    scheduleScroll,
  );

  return (
    <IntersectionObserverContext.Provider
      value={useIntersectionObserverHandle(containerRef, intersectionObserverRootMargin)}
    >
      <div className={styles.years} ref={containerRef} data-test='ring-date-popup--years'>
        {items.map(year => (
          <Year year={year} scrollDate={localScrollDate.date} handleYearClick={handleYearClick} key={+year} />
        ))}
      </div>
    </IntersectionObserverContext.Provider>
  );
}

function Year({
  year,
  scrollDate,
  handleYearClick,
}: {
  year: Date;
  scrollDate: Date | number;
  handleYearClick: (year: Date) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const isIntersecting = useIsIntersecting(buttonRef);

  return (
    <button
      type='button'
      ref={buttonRef}
      key={+year}
      disabled={!isIntersecting}
      className={classNames(
        styles.year,
        isIntersecting && isSameYear(year, scrollDate) && styles.currentYear,
        isIntersecting && isThisYear(year) && styles.today,
      )}
      onClick={isIntersecting ? () => handleYearClick(year) : undefined}
    >
      {isIntersecting ? format(year, 'yyyy') : '\u00A0'}
    </button>
  );
}
