import React, {PropTypes} from 'react';
import classNames from 'classnames';
import moment from 'moment';

import {weekdays} from './consts';

import styles from './date-picker.css';

let hoverTO;
function Day(props) {
  const {
    day,
    from,
    empty,
    onSelect,
    onHover,
  } = props;

  function isDay(date) {
    return day.isSame(date, 'day');
  }

  function is(name) {
    return props[name] && isDay(props[name]);
  }

  function inRange(range) {
    return range && day.isBetween(...range, 'days');
  }

  return (
    <div
      className={classNames(
        styles.day,
        {
          [styles.current]: ['date', 'from', 'to'].some(is),
          [styles.today]: day.isSame(moment(), 'day'),
          [styles.active]: is('activeDate'),
          [styles.weekend]: [weekdays.SA, weekdays.SU].includes(day.day()),
          [styles.empty]: empty
        },
      )}
      onClick={() => onSelect(day)}
      onMouseOver={() => {
        if (hoverTO) {
          window.clearTimeout(hoverTO);
          hoverTO = null;
        }

        onHover(day);
      }}

      onMouseOut={() => {
        hoverTO = window.setTimeout(onHover, 0);
      }}
    >
      {empty || day.format('D')}
    </div>
  );
}

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
