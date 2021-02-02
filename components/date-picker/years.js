import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import addYears from 'date-fns/addYears';
import getYear from 'date-fns/getYear';
import format from 'date-fns/format';
import isSameYear from 'date-fns/isSameYear';
import isThisYear from 'date-fns/isThisYear';
import setYear from 'date-fns/setYear';
import startOfYear from 'date-fns/startOfYear';
import subYears from 'date-fns/subYears';

import linearFunction from '../global/linear-function';


import styles from './date-picker.css';
import units, {dateType, DOUBLE, HALF, yearDuration} from './consts';

const {yearHeight, calHeight} = units;

let scrollTO;

const YEARSBACK = 5;
const scrollDelay = 100;

export default class Years extends PureComponent {
  static propTypes = {
    scrollDate: dateType,
    onScroll: PropTypes.func,
    onScrollChange: PropTypes.func
  };

  state = {scrollDate: null};

  componentDidUpdate(prevProps, prevState) {
    this.stoppedScrolling = prevState.scrollDate && !this.state.scrollDate;
  }

  setYear(date) {
    if (scrollTO) {
      window.clearTimeout(scrollTO);
      scrollTO = null;
    }

    this.setState({scrollDate: null});

    this.props.onScroll(
      setYear(this.props.scrollDate, getYear(date))
    );
  }

  render() {
    const {onScrollChange, scrollDate} = this.props;
    const date = this.state.scrollDate || scrollDate;
    const yearStart = startOfYear(date);
    let year = subYears(yearStart, YEARSBACK);
    const years = [year];
    for (let i = 0; i < YEARSBACK * DOUBLE; i++) {
      year = addYears(year, 1);
      years.push(year);
    }

    const pxToDate = linearFunction(0, years[0], yearDuration / yearHeight);

    const handleWheel = e => {
      e.preventDefault();
      const newScrollDate = linearFunction(0, date, yearDuration / yearHeight).
        y(e.deltaY);
      this.setState({
        scrollDate: newScrollDate
      });
      if (scrollTO) {
        window.clearTimeout(scrollTO);
      }
      scrollTO = window.setTimeout(() => this.setYear(newScrollDate), scrollDelay);
    };

    return (
      <div
        className={styles.years}
        onWheel={handleWheel}

        style={{
          transition: this.stoppedScrolling ? 'top .2s ease-out 0s' : 'none',
          top: Math.floor(calHeight * HALF - pxToDate.x(date))
        }}
      >
        {years.map(item => (
          <button
            type="button"
            key={+item}
            className={classNames(
              styles.year,
              {
                [styles.currentYear]: isSameYear(item, date),
                [styles.today]: isThisYear(item)
              }
            )}
            onClick={function handleClick() {
              onScrollChange(
                setYear(scrollDate, getYear(item))
              );
            }}
          >
            {format(item, 'yyyy')}
          </button>
        ))}
      </div>
    );
  }
}
