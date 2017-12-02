import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import 'core-js/modules/es7.array.includes';

import {dateType, weekdays} from './consts';
import styles from './date-picker.css';

let hoverTO;
export default class Day extends Component {
  handleClick = () => this.props.onSelect(this.props.day);

  handleMouseOver = () => {
    if (hoverTO) {
      window.clearTimeout(hoverTO);
      hoverTO = null;
    }

    this.props.onHover(this.props.day);
  };

  handleMouseOut = () => {
    hoverTO = window.setTimeout(this.props.onHover, 0);
  };

  isDay = date => this.props.day.isSame(date, 'day');

  is = name => this.props[name] && this.isDay(this.props[name]);

  inRange = range => range && this.props.day.isBetween(...range, 'days');

  render() {
    const {
      day,
      from,
      currentRange,
      activeRange,
      empty
    } = this.props;

    const reverse = activeRange && activeRange[1] === from;

    return (
      <div
        className={classNames(
          styles.day,
          {
            [styles.current]: ['date', 'from', 'to'].some(this.is),
            [styles.today]: day.isSame(moment(), 'day'),
            [styles.active]: this.is('activeDate'),
            [styles.weekend]: [weekdays.SA, weekdays.SU].includes(day.day()),
            [styles.empty]: empty,
            [styles.from]: (currentRange && this.isDay(currentRange[0]) && !reverse ||
              activeRange && this.isDay(activeRange[0])),
            [styles.to]: (currentRange && this.isDay(currentRange[1])) ||
            activeRange && this.isDay(activeRange[1]),
            [styles.between]: this.inRange(currentRange),
            [styles.activeBetween]: this.inRange(activeRange)
          },
        )}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        {empty || day.format('D')}
      </div>
    );
  }
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
