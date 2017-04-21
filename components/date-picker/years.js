import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

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
      moment(this.props.scrollDate).
        year(moment(date).year())
    );
  }

  render() {
    const date = moment(this.state.scrollDate || this.props.scrollDate);
    const yearStart = date.clone().startOf('year');
    let year = yearStart.
      clone().
      subtract(YEARSBACK, 'years');
    const years = [year];
    for (let i = 0; i < YEARSBACK * DOUBLE; i++) {
      year = year.
        clone().
        add(1, 'year');
      years.push(year);
    }

    const pxToDate = linearFunction(0, years[0], yearDuration / yearHeight);

    return (
      <div
        className={styles.years}
        onWheel={e => {
          e.preventDefault();
          const scrollDate = linearFunction(0, date, yearDuration / yearHeight).
            y(e.deltaY);
          this.setState({scrollDate});
          if (scrollTO) {
            window.clearTimeout(scrollTO);
          }
          scrollTO = window.setTimeout(() => this.setYear(scrollDate), scrollDelay);
        }}

        style={{
          transition: this.stoppedScrolling ? 'top .2s ease-out 0s' : 'none',
          top: Math.floor(calHeight * HALF - pxToDate.x(date))
        }}
      >
        {years.map(item => (
          <div
            key={+item}
            className={classNames(
              styles.year,
              {
                [styles.currentYear]: item.isSame(date, 'year'),
                [styles.today]: item.isSame(moment(), 'year')
              }
            )}
            onClick={() => this.props.onScrollChange(
              moment(this.props.scrollDate).
                year(moment(item).year())
            )}
          >
            {item.format('YYYY')}
          </div>
        ))}
      </div>
    );
  }
}
