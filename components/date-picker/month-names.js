import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import linearFunction from '../global/linear-function';

import MonthSlider from './month-slider';
import {dateType, HALF, YEAR, MIDDLE_DAY, yearScrollSpeed} from './consts';
import styles from './date-picker.css';

class MonthName extends PureComponent {
  handleClick = () => {
    const end = this.props.month.
      clone().
      endOf('month');
    this.props.onScrollChange((this.props.month + end) * HALF);
  };

  render() {
    const {month} = this.props;

    return (
      <button
        type="button"
        className={classNames(
          styles.monthName,
          {
            [styles.today]: month.isSame(moment(), 'month')
          }
        )}
        onClick={this.handleClick}
      >
        {month.format('MMM')}
      </button>
    );
  }
}

MonthName.propTypes = {
  month: dateType,
  onScrollChange: PropTypes.func
};

export default function MonthNames(props) {
  const scrollDate = moment(props.scrollDate);
  const months = [];
  for (let i = 0; i < YEAR; i++) {
    months.push(
      scrollDate.
        clone().
        month(i).
        date(MIDDLE_DAY).
        startOf('day')
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
        <MonthName
          key={+month}
          month={month}
          onScrollChange={props.onScrollChange}
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
