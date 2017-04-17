import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import 'core-js/modules/es7.array.includes';

import {dateType, weekdays} from './consts';
import styles from './date-picker.css';

let hoverTO;
export default function Day(props) {
  const {
    day,
    from,
    currentRange,
    activeRange,
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

  function inRange(range) {
    return range && day.isBetween(...range, 'days');
  }

  const reverse = activeRange && activeRange[1] === from;

  return (
    <div
      className={classNames(
        styles.day,
        {
          [styles.current]: ['date', 'from', 'to'].some(is),
          [styles.today]: day.isSame(moment(), 'day'),
          [styles.active]: is('activeDate'),
          [styles.weekend]: [weekdays.SA, weekdays.SU].includes(day.day()),
          [styles.empty]: empty,
          [styles.from]: (currentRange && isDay(currentRange[0]) && !reverse ||
            activeRange && isDay(activeRange[0])),
          [styles.to]: (currentRange && isDay(currentRange[1])) ||
            activeRange && isDay(activeRange[1]),
          [styles.between]: inRange(currentRange),
          [styles.activeBetween]: inRange(activeRange)
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
  from: dateType,
  currentRange: PropTypes.arrayOf(dateType),
  activeRange: PropTypes.arrayOf(dateType),
  empty: PropTypes.bool,
  onSelect: PropTypes.func,
  onHover: PropTypes.func
};
