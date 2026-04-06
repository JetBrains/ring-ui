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
import {ScrollHelper, useScrollBehavior} from './scroll-helper';

import styles from './date-picker.css';

const {yearHeight} = units;

let scrollTO: number | null;

const EMPTY_YEARSBACK = 10;
const NONEMPTY_YEARSBACK = 7;
const YEARSBACK = EMPTY_YEARSBACK + NONEMPTY_YEARSBACK;
// const scrollDelay = 100;

const scrollHelper = new ScrollHelper({
  itemsBack: YEARSBACK,
  getItem: startOfYear,
  addItems: addYears,
  getItemHeight: () => yearHeight,
});

export default function Years({onScroll, onScrollChange, scrollDate}: CalendarProps) {
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

  const {componentRef, handleScroll, items} = useScrollBehavior({scrollDate, onScroll, scrollHelper});

  return (
    <div
      className={styles.years}
      ref={componentRef}
      style={{
        transition: stoppedScrolling ? 'top .2s ease-out 0s' : 'none',
      }}
      onScroll={handleScroll}
    >
      {items.map((year, i) =>
        i < EMPTY_YEARSBACK || i >= items.length - EMPTY_YEARSBACK ? (
          <div style={{height: yearHeight}} key={year.getFullYear()} />
        ) : (
          <button
            type='button'
            key={year.getFullYear()}
            className={classNames(styles.year, {
              [styles.currentYear]: isSameYear(year, scrollDate), // TODO scrollDate or local scroll date
              [styles.today]: isThisYear(year),
            })}
            onClick={function handleClick() {
              onScrollChange(Number(setYear(scrollDate, getYear(year))));
            }}
          >
            {format(year, 'yyyy')}
          </button>
        ),
      )}
    </div>
  );
}
