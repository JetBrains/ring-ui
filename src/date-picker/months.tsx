import {addMonths} from 'date-fns/addMonths';
import {getDay} from 'date-fns/getDay';
import {getDaysInMonth} from 'date-fns/getDaysInMonth';
import {startOfMonth} from 'date-fns/startOfMonth';

import Month from './month';
import MonthNames from './month-names';
import units, {type MonthsProps, WEEK, weekdays} from './consts';
import {ScrollArith} from './scroll-arith';
import {useScrollBehavior} from './scroll-behavior';

import styles from './date-picker.css';

const {unit, cellSize} = units;

const FridayToSunday = WEEK + weekdays.SU - weekdays.FR;
const FIVELINES = 31;
const TALLMONTH = 6;
const SHORTMONTH = 5;
const PADDING = 2;

const EMPTY_MONTHSBACK = 1;
const NONEMPTY_MONTHSBACK = 2;
const MONTHSBACK = EMPTY_MONTHSBACK + NONEMPTY_MONTHSBACK;

function monthHeight(date: Date | number) {
  const monthStart = startOfMonth(date);
  const daysSinceLastFriday = (getDay(monthStart) + FridayToSunday) % WEEK;
  const monthLines = daysSinceLastFriday + getDaysInMonth(monthStart) > FIVELINES ? TALLMONTH : SHORTMONTH;
  return monthLines * cellSize + unit * PADDING;
}

// eslint-disable-next-line no-magic-numbers
const EMPTY_MONTH_HEIGHT = monthHeight(5e11) * 5;

const scrollArith = new ScrollArith({
  itemsAround: MONTHSBACK,
  floorToItem: startOfMonth,
  shiftItems: addMonths,
  getItemHeight: (item, index, items) =>
    EMPTY_MONTHSBACK <= index && index < items.length - EMPTY_MONTHSBACK ? monthHeight(item) : EMPTY_MONTH_HEIGHT,
});

export default function Months(props: MonthsProps) {
  const {scrollDate, setScrollDate} = props;

  const {containerRef, handleScroll, items} = useScrollBehavior(scrollDate, setScrollDate, 'monthsScroll', scrollArith);

  return (
    <div className={styles.months} ref={containerRef} onScroll={handleScroll}>
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
