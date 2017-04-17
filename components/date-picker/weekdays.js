import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import 'core-js/modules/es7.array.includes';

import {weekdays} from './consts';
import styles from './date-picker.css';

export default function Weekdays() {
  const days = Object.keys(weekdays).
    map(key => moment().day(weekdays[key]).startOf('day'));

  return (
    <div className={styles.weekdays}>
      {days.map(day => (
        <span
          className={classNames(
            styles.weekday,
            {
              [styles.weekend]: [weekdays.SA, weekdays.SU].includes(day.day())
            }
          )}
          key={+day}
        >
          {day.format('dd')}
        </span>
      ))}
    </div>
  );
}
