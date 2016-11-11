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
            props.onScroll((month + end) / 2);
          }}
        >
          {month.format('MMM')}
        </div>
      ))}
      <MonthSlider
        {...props}
        pxToDate={pxToDate}
      />
    </div>
  );
}

MonthNames.propTypes = {
  scrollDate: dateType,
  onScroll: PropTypes.func
};
