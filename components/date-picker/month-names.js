import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';
import isThisMonth from 'date-fns/isThisMonth';
import set from 'date-fns/set';
import startOfDay from 'date-fns/startOfDay';
import startOfYear from 'date-fns/startOfYear';

import linearFunction from '../global/linear-function';

import MonthSlider from './month-slider';
import {HALF, YEAR, MIDDLE_DAY, yearScrollSpeed, dateType} from './consts';
import styles from './date-picker.css';

class MonthName extends PureComponent {
  handleClick = () => {
    const end = endOfMonth(this.props.month);
    this.props.onScrollChange((+this.props.month + +end) * HALF);
  };

  render() {
    const {month, locale} = this.props;

    return (
      <button
        type="button"
        className={classNames(
          styles.monthName,
          {
            [styles.today]: isThisMonth(month)
          }
        )}
        onClick={this.handleClick}
      >
        {format(month, 'MMM', {locale})}
      </button>
    );
  }
}

MonthName.propTypes = {
  month: dateType,
  onScrollChange: PropTypes.func
};

export default function MonthNames(props) {
  const {scrollDate, locale} = props;
  const months = [];
  for (let i = 0; i < YEAR; i++) {
    const middleDay = set(scrollDate, {month: i, date: MIDDLE_DAY});
    months.push(startOfDay(middleDay));
  }

  const pxToDate = linearFunction(
    0,
    startOfYear(scrollDate),
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
        <MonthName
          key={+month}
          month={month}
          onScrollChange={props.onScrollChange}
          locale={locale}
        />
      ))}
      {props.currentRange &&
        (
          <div
            className={styles.range}
            style={{
              top: top - 1,
              height: (bottom + 1) - (top - 1)
            }}
          />
        )
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
