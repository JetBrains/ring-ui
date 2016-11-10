import React, {PropTypes} from 'react';
import classNames from 'classnames';
import moment from 'moment';

import {weekdays, dateType} from './consts';

import styles from './date-picker.css';

let hoverTO;
export default function Day(props) {
  const {
    day,
    empty,
    onSelect,
    onHover
  } = props;

  function isDay(date) {
    return day.isSame(date, 'day');
  }

  function is(name) {
    return props[name] && isDay(props[name]);
  }

  /*function inRange(range) {
    return range && day.isBetween(...range, 'days');
  }*/

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

Day.propTypes = {
  day: dateType,
  empty: PropTypes.bool,
  onSelect: PropTypes.func,
  onHover: PropTypes.func
};
