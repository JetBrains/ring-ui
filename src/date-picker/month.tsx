import React from 'react';
import addDays from 'date-fns/addDays';
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import setDay from 'date-fns/setDay';

import PropTypes from 'prop-types';

import Day from './day';
import {MonthsProps, dateType, WEEK, weekdays} from './consts';
import styles from './date-picker.css';

export interface MonthProps extends MonthsProps {
  month: Date
}

export default function Month(props: MonthProps) {
  const start = props.month;
  const end = endOfMonth(start);
  const {locale} = props;

  // pad with empty cells starting from last friday
  const weekday = getDay(start);
  let day = setDay(start, weekday >= weekdays.FR ? weekdays.FR : weekdays.FR - WEEK);
  const days = [];
  while (day < end) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className={styles.month}>
      <span className={styles.monthTitle}>
        {format(props.month, 'LLLL', {locale})}
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
  month: dateType,
  locale: PropTypes.string
};
