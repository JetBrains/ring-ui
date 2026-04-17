import {addMonths} from 'date-fns/addMonths';
import {startOfMonth} from 'date-fns/startOfMonth';
import {type Locale} from 'date-fns';

import Month, {getVisualMonthDays} from './month';
import MonthNames from './month-names';
import units, {type MonthsProps, WEEK} from './consts';
import {ScrollArith} from './scroll-arith';
import {useScrollBehavior} from './scroll-behavior';
import scheduleRAF from '../global/schedule-raf';

import styles from './date-picker.css';

const {unit, cellSize} = units;

const PADDING = 2;

const EMPTY_MONTHSBACK = 1;
const NONEMPTY_MONTHSBACK = 2;
const MONTHSBACK = EMPTY_MONTHSBACK + NONEMPTY_MONTHSBACK;

const MONTH_NAME_CELLS = 4;

function monthHeight(date: Date | number, locale: Locale | undefined) {
  const cellsTotal = MONTH_NAME_CELLS + getVisualMonthDays(new Date(date), locale).daysNumber;
  const monthLines = Math.ceil(cellsTotal / WEEK);
  return monthLines * cellSize + unit * PADDING;
}

// eslint-disable-next-line no-magic-numbers
const EMPTY_MONTH_HEIGHT = monthHeight(5e11, undefined) * 5;

const scrollArith = new ScrollArith({
  itemsAround: MONTHSBACK,
  floorToItem: startOfMonth,
  shiftItems: addMonths,
  getItemHeight: (item, index, items, locale) =>
    EMPTY_MONTHSBACK <= index && index < items.length - EMPTY_MONTHSBACK
      ? monthHeight(item, locale)
      : EMPTY_MONTH_HEIGHT,
});

const scheduleScroll = scheduleRAF();

export default function Months(props: MonthsProps) {
  const {scrollDate, setScrollDate, locale} = props;

  const {containerRef, items} = useScrollBehavior(
    scrollDate,
    setScrollDate,
    locale,
    'monthsScroll',
    scrollArith,
    scheduleScroll,
  );

  return (
    <div className={styles.months} ref={containerRef}>
      <div>
        {items.map((month, i) =>
          EMPTY_MONTHSBACK <= i && i < items.length - EMPTY_MONTHSBACK ? (
            <Month {...props} month={month} key={+month} />
          ) : (
            <div style={{height: EMPTY_MONTH_HEIGHT}} key={+month} />
          ),
        )}
      </div>
      <MonthNames {...props} />
    </div>
  );
}
