import React from 'react';

import Day from './day';

import {weekdays, dateType} from './consts';

import styles from './date-picker.css';

const WEEK = 7;

export default function Month(props) {
  const start = props.month;
  const end = start.
    clone().
    endOf('month');

  // pad with empty cells starting from last thursday
  const weekday = start.day();
  let day = start.
    clone().
    weekday(weekday >= weekdays.TH ? weekdays.TH : weekdays.TH - WEEK);
  const days = [];
  while (day < end) {
    days.push(day);
    day = day.
      clone().
      add(1, 'day');
  }

  return (
    <div className={styles.month}>
      <span className={styles.monthTitle}>
        {props.month.format('MMMM')}
      </span>
      {days.map(date => (
        <Day
          {...props}
          day={date}
          empty={date < start}
          key={+date}
        />
      ))}
    </div>
  );
}

Month.propTypes = {
  month: dateType
};
