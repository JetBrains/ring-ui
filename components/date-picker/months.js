import React, {PropTypes} from 'react';
import classNames from 'classnames';
import moment from 'moment';

import Month from './month';

import styles from './date-picker.css';

import {unit, cellHeight, calHeight, weekdays, linear} from './consts';

const WEEK = 7;
const THURSDAYTOSUNDAY = WEEK + weekdays.SU - weekdays.TH;
const FIVELINES = 32;
const TALLMONTH = 6;
const SHORTMONTH = 5;
const PADDING = 2;

const MONTHSBACK = 2;

function monthHeight(date) {
  const monthStart = moment(date).startOf('month');
  const daysSinceLastThursday = (monthStart.day() + THURSDAYTOSUNDAY) % WEEK;
  const monthLines = daysSinceLastThursday + monthStart.daysInMonth() > FIVELINES ? TALLMONTH : SHORTMONTH;
  return monthLines * cellHeight + unit * PADDING;
}

// in milliseconds per pixel
function monthSpeed(date) {
  const monthStart = moment(date).startOf('month');
  const monthEnd = moment(date).endOf('month');
  return (monthEnd - monthStart) / monthHeight(monthStart);
}

export default function Months(props) {
  const scrollDate = moment(props.scrollDate);
  const monthStart = scrollDate.clone().startOf('month');

  let month = monthStart.
    clone().
    subtract(MONTHSBACK, 'months');
  const months = [month];
  for (let i = 0; i < MONTHSBACK * 2; i++) {
    month = month.
      clone().
      add(1, 'month');
    months.push(month);
  }

  const currentSpeed = monthSpeed(scrollDate);
  const pxToDate = linear(0, scrollDate, currentSpeed);
  const offset = pxToDate.x(monthStart); // is a negative number
  const bottomOffset = monthHeight(scrollDate) + offset;

  return (
    <div
      className={styles.months}
      onWheel={e => {
        e.preventDefault();
        const dy = e.deltaY;
        let date;

        // adjust scroll speed to prevent glitches
        if (dy < offset) {
          date = pxToDate.y(offset) + (dy - offset) * monthSpeed(months[1]);
        } else if (dy > bottomOffset) {
          date = pxToDate.y(bottomOffset) + (dy - bottomOffset) * monthSpeed(months[3]);
        } else {
          date = pxToDate.y(dy);
        }

        props.onScroll(date);
      }}
    >
      <div
        style={{
          top: Math.floor(calHeight / 2 - monthHeight(months[0]) - monthHeight(months[1]) + offset),
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
    </div>
  );
}

Months.propTypes = {
  onScroll: PropTypes.func
};
