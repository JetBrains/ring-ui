import {addMonths} from 'date-fns/addMonths';
import {getDay} from 'date-fns/getDay';
import {getDaysInMonth} from 'date-fns/getDaysInMonth';
import {startOfMonth} from 'date-fns/startOfMonth';

import Month from './month';
import MonthNames from './month-names';
import units, {type MonthsProps, WEEK, weekdays} from './consts';
import {ScrollHelper, useScrollBehavior} from './scroll-helper';

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

export default function Months(props: MonthsProps) {
  const {scrollDate, onScroll} = props;

  const {componentRef, handleScroll, items} = useScrollBehavior({scrollDate, onScroll, scrollHelper});

  return (
    <div className={styles.months} ref={componentRef} onScroll={handleScroll}>
      <div>
        {items.map((month, i) =>
          i < EMPTY_MONTHSBACK || i >= items.length - EMPTY_MONTHSBACK ? (
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
