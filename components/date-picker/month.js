import React from 'react';

import Day from './day';
import {dateType, WEEK, weekdays} from './consts';
import styles from './date-picker.css';

export default function Month(props) {
  const start = props.month;
  const end = start.
    clone().
    endOf('month');

  // pad with empty cells starting from last friday
  const weekday = start.day();
  let day = start.
    clone().
    weekday(weekday >= weekdays.FR ? weekdays.FR : weekdays.FR - WEEK);
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
