import React from 'react';
import PropTypes from 'prop-types';
import addMonths from 'date-fns/addMonths';
import getDay from 'date-fns/getDay';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import set from 'date-fns/set';
import startOfHour from 'date-fns/startOfHour';
import startOfMonth from 'date-fns/startOfMonth';
import subMonths from 'date-fns/subMonths';
import endOfMonth from 'date-fns/endOfMonth';

import scheduleRAF from '../global/schedule-raf';
import linearFunction from '../global/linear-function';

import Month from './month';
import MonthNames from './month-names';
import styles from './date-picker.css';
import units, {dateType, DOUBLE, HALF, MonthsProps, WEEK, weekdays} from './consts';

const {unit, cellSize, calHeight} = units;

const FridayToSunday = WEEK + weekdays.SU - weekdays.FR;
const FIVELINES = 31;
const TALLMONTH = 6;
const SHORTMONTH = 5;
const PADDING = 2;

const MONTHSBACK = 2;

function monthHeight(date: Date | number) {
  const monthStart = startOfMonth(date);
  const daysSinceLastFriday = (getDay(monthStart) + FridayToSunday) % WEEK;
  const monthLines =
    daysSinceLastFriday + getDaysInMonth(monthStart) > FIVELINES ? TALLMONTH : SHORTMONTH;
  return monthLines * cellSize + unit * PADDING;
}

// in milliseconds per pixel
function scrollSpeed(date: Date | number) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  return (Number(monthEnd) - Number(monthStart)) / monthHeight(monthStart);
}

const scrollSchedule = scheduleRAF();
let dy = 0;
export default function Months(props: MonthsProps) {
  const {scrollDate} = props;
  // prevent switching from april to march because of daylight saving time
  const monthStart = startOfHour(set(scrollDate, {date: 1, hours: 1}));

  let month = subMonths(monthStart, MONTHSBACK);
  const months = [month];
  for (let i = 0; i < MONTHSBACK * DOUBLE; i++) {
    month = addMonths(month, 1);
    months.push(month);
  }

  const currentSpeed = scrollSpeed(scrollDate);
  const pxToDate = linearFunction(0, Number(scrollDate), currentSpeed);
  const offset = pxToDate.x(Number(monthStart)); // is a negative number
  const bottomOffset = monthHeight(scrollDate) + offset;

  return (
    <div
      className={styles.months}
      onWheel={function handleWheel(e) {
        e.preventDefault();
        dy += e.deltaY;
        scrollSchedule(() => {
          let date;

          // adjust scroll speed to prevent glitches
          if (dy < offset) {
            date = pxToDate.y(offset) + (dy - offset) * scrollSpeed(months[1]);
          } else if (dy > bottomOffset) {
            date =
              pxToDate.y(bottomOffset) +
              (dy - bottomOffset) *
              scrollSpeed(months[MONTHSBACK + 1]);
          } else {
            date = pxToDate.y(dy);
          }

          props.onScroll(date);
          dy = 0;
        });
      }}
    >
      <div
        style={{
          top: Math.
            floor(calHeight * HALF - monthHeight(months[0]) - monthHeight(months[1]) + offset)
        }}
        className={styles.days}
      >
        {months.map(date => (
          <Month
            {...props}
            month={date}
            key={+date}
          />
        ))}
      </div>
      <MonthNames {...props}/>
    </div>
  );
}

Months.propTypes = {
  onScroll: PropTypes.func,
  scrollDate: dateType
};
