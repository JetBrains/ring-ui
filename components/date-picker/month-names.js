import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import linearFunction from '../global/linear-function';

import MonthSlider from './month-slider';

import {dateType, HALF, YEAR, yearScrollSpeed} from './consts';

import styles from './date-picker.css';

export default function MonthNames(props) {
  const scrollDate = moment(props.scrollDate);
  const months = [];
  for (let i = 0; i < YEAR; i++) {
    months.push(
      scrollDate.
        clone().
        month(i).
        startOf('month')
    );
  }

  const pxToDate = linearFunction(
    0,
    moment(props.scrollDate).startOf('year'),
    yearScrollSpeed
  );

  let top = 0;
  let bottom = 0;
  if (props.currentRange) {
    [top, bottom] = props.currentRange.
      map(date => Math.floor(pxToDate.x(date)));
  }

  return (
    <div className={styles.monthNames}>
      {months.map(month => (
        <div
          className={classNames(
            styles.monthName,
            {
              [styles.today]: month.isSame(moment(), 'month')
            }
          )}
          key={+month}
          onClick={() => {
            const end = month.
              clone().
              endOf('month');
            props.onScrollChange((month + end) * HALF);
          }}
        >
          {month.format('MMM')}
        </div>
      ))}
      {props.currentRange &&
        <div
          className={styles.range}
          style={{
            top: top - 1,
            height: (bottom + 1) - (top - 1)
          }}
        />
      }
      <MonthSlider
        {...props}
        pxToDate={pxToDate}
      />
    </div>
  );
}

MonthNames.propTypes = {
  scrollDate: dateType,
  onScrollChange: PropTypes.func,
  currentRange: PropTypes.arrayOf(dateType)
};
