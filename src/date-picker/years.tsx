import {useEffect} from 'react';
import classNames from 'classnames';
import {addYears} from 'date-fns/addYears';
import {getYear} from 'date-fns/getYear';
import {format} from 'date-fns/format';
import {isSameYear} from 'date-fns/isSameYear';
import {isThisYear} from 'date-fns/isThisYear';
import {setYear} from 'date-fns/setYear';
import {startOfYear} from 'date-fns/startOfYear';

import units, {type CalendarProps} from './consts';
import {ScrollArith} from './scroll-arith';
import scheduleRAF from '../global/schedule-raf';
import {useScrollBehavior} from './scroll-behavior';

import styles from './date-picker.css';

const {yearHeight} = units;
// eslint-disable-next-line no-magic-numbers
const emptyYearHeight = yearHeight * 30;

let scrollTO: number | null;

const EMPTY_YEARSBACK = 1;
const NONEMPTY_YEARSBACK = 10;
const YEARSBACK = EMPTY_YEARSBACK + NONEMPTY_YEARSBACK;
// const scrollDelay = 100;

const scrollArith = new ScrollArith({
  itemsAround: YEARSBACK,
  floorToItem: startOfYear,
  shiftItems: addYears,
  getItemHeight: (_y, index, items) =>
    EMPTY_YEARSBACK <= index && index < items.length - EMPTY_YEARSBACK ? yearHeight : emptyYearHeight,
});

const scheduleScroll = scheduleRAF();

export default function Years({setScrollDate, onScrollChange, scrollDate}: CalendarProps) {
  // const [localScrollDate, setLocalScrollDate] = useState<YearsState['scrollDate']>(null);
  // const [stoppedScrolling, setStoppedScrolling] = useState(false);
  const stoppedScrolling = false;
  // const componentRef = useRef<HTMLDivElement>(null);

  // const setYearValue = useCallback(
  //   (date: number) => {
  //     if (scrollTO) {
  //       window.clearTimeout(scrollTO);
  //       scrollTO = null;
  //     }

  //     setStoppedScrolling(true);
  //     setLocalScrollDate(null);
  //     onScroll(Number(setYear(scrollDate, getYear(date))));
  //   },
  //   [onScroll, scrollDate],
  // );

  // const handleWheel = useCallback(
  //   (e: WheelEvent) => {
  //     const date = localScrollDate || scrollDate;

  //     e.preventDefault();
  //     const newScrollDate = linearFunction(0, Number(date), yearDuration / yearHeight).y(e.deltaY);
  //     setStoppedScrolling(false);
  //     setLocalScrollDate(newScrollDate);

  //     if (scrollTO) {
  //       window.clearTimeout(scrollTO);
  //     }

  //     scrollTO = window.setTimeout(() => setYearValue(newScrollDate), scrollDelay);
  //   },
  //   [localScrollDate, scrollDate, setYearValue],
  // );

  useEffect(() => {
    return () => {
      if (scrollTO) {
        window.clearTimeout(scrollTO);
        scrollTO = null;
      }
    };
  }, []);

  const {containerRef, handleScroll, items} = useScrollBehavior(
    scrollDate,
    setScrollDate,
    'yearsScroll',
    scrollArith,
    scheduleScroll,
  );

  return (
    <div
      className={styles.years}
      ref={containerRef}
      style={{
        transition: stoppedScrolling ? 'top .2s ease-out 0s' : 'none',
      }}
      onScroll={handleScroll}
    >
      {items.map((year, i) =>
        EMPTY_YEARSBACK <= i && i < items.length - EMPTY_YEARSBACK ? (
          <button
            type='button'
            key={+year}
            className={classNames(styles.year, {
              [styles.currentYear]: isSameYear(year, scrollDate.date), // TODO scrollDate or local scroll date
              [styles.today]: isThisYear(year),
            })}
            onClick={function handleClick() {
              onScrollChange(Number(setYear(scrollDate.date, getYear(year))));
            }}
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
