import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

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

  isDisabled = date => (this.props.minDate && date.isBefore(this.props.minDate, 'day')) ||
    (this.props.maxDate && date.isAfter(this.props.maxDate, 'day'));

  render() {
    const {
      day,
      from,
      currentRange,
      activeRange,
      empty
    } = this.props;

    const reverse = activeRange && activeRange[1] === from;

    function makeSpreadRange(range) {
      return range && [range[0], range[1].clone().add(1, 'days')];
    }

    const spreadRange = makeSpreadRange(currentRange);
    const disabled = this.isDisabled(day);
    const activeSpreadRange = makeSpreadRange(activeRange); return (
      // TODO make keyboard navigation actually work
      <button
        type="button"
        className={classNames(
          styles.day,
          styles[day.format('dddd')],
          {
            [styles.current]: ['date', 'from', 'to'].some(this.is),
            [styles.active]: !disabled && this.is('activeDate'),
            [styles.weekend]: [weekdays.SA, weekdays.SU].includes(day.day()),
            [styles.empty]: empty,
            [styles.from]: (currentRange && this.isDay(currentRange[0]) && !reverse ||
              activeRange && this.isDay(activeRange[0])),
            [styles.to]: (currentRange && this.isDay(currentRange[1])) ||
              activeRange && this.isDay(activeRange[1]),
            [styles.between]: this.inRange(currentRange),
            [styles.activeBetween]: !disabled && this.inRange(activeRange),
            [styles.first]: day.date() === 1,
            [styles.spread]: this.inRange(spreadRange),
            [styles.activeSpread]: !disabled && this.inRange(activeSpreadRange),
            [styles.disabled]: disabled
          },
        )}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onFocus={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onBlur={this.handleMouseOut}
        disabled={disabled}
      >
        {empty || (
          <span className={classNames({[styles.today]: day.isSame(moment(), 'day')})}>
            {day.format('D')}</span>
        )}
      </button>
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
  onHover: PropTypes.func,
  minDate: dateType,
  maxDate: dateType
};
