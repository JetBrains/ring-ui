import React, {PropTypes} from 'react';
import classNames from 'classnames';
import moment from 'moment';

import MonthSlider, {speed} from './month-slider';

import {linear, dateType} from './consts';

import styles from './date-picker.css';

const YEAR = 12;

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

  const pxToDate = linear(
    0,
    moment(props.scrollDate).startOf('year'),
    speed
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
            props.onScrollChange((month + end) / 2);
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
            height: bottom - top + 2
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
