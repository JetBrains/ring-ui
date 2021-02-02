import React from 'react';
import classNames from 'classnames';
import getDay from 'date-fns/getDay';
import format from 'date-fns/format';
import setDay from 'date-fns/setDay';
import startOfDay from 'date-fns/startOfDay';

import {weekdays} from './consts';
import styles from './date-picker.css';

export default function Weekdays() {
  const days = Object.keys(weekdays).
    map(key => startOfDay(setDay(new Date(), weekdays[key])));

  return (
    <div className={styles.weekdays}>
      {days.map(day => (
        <span
          className={classNames(
            styles.weekday,
            {
              [styles.weekend]: [weekdays.SA, weekdays.SU].includes(getDay(day))
            }
          )}
          key={+day}
        >
          {format(day, 'EEEEEE')}
        </span>
      ))}
    </div>
  );
}
