import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import getDate from 'date-fns/getDate';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import isToday from 'date-fns/isToday';
import startOfDay from 'date-fns/startOfDay';

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

  isDay = date => isSameDay(this.props.day, date);

  is = name => this.props[name] && this.isDay(this.props[name]);

  inRange = range => range &&
    isAfter(startOfDay(this.props.day), startOfDay(range[0])) &&
    isBefore(startOfDay(this.props.day), startOfDay(range[1]));

  isDisabled = date => {
    const min = this.parse(this.props.minDate);
    const max = this.parse(this.props.maxDate);
    return (this.props.minDate && isBefore(startOfDay(date), startOfDay(min))) ||
      (this.props.maxDate && isAfter(startOfDay(date), startOfDay(max)));
  };

  parse(text) {
    return this.props.parseDateInput(text);
  }

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
      return range && [range[0], addDays(range[1], 1)];
    }

    const spreadRange = makeSpreadRange(currentRange);
    const disabled = this.isDisabled(day);
    const activeSpreadRange = makeSpreadRange(activeRange); return (
      // TODO make keyboard navigation actually work
      <button
        type="button"
        className={classNames(
          styles.day,
          styles[format(day, 'EEEE')],
          {
            [styles.current]: ['date', 'from', 'to'].some(this.is),
            [styles.active]: !disabled && this.is('activeDate'),
            [styles.weekend]: [weekdays.SA, weekdays.SU].includes(getDay(day)),
            [styles.empty]: empty,
            [styles.from]: (currentRange && this.isDay(currentRange[0]) && !reverse ||
              activeRange && this.isDay(activeRange[0])),
            [styles.to]: (currentRange && this.isDay(currentRange[1])) ||
              activeRange && this.isDay(activeRange[1]),
            [styles.between]: this.inRange(currentRange),
            [styles.activeBetween]: !disabled && this.inRange(activeRange),
            [styles.first]: getDate(day) === 1,
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
          <span className={classNames({[styles.today]: isToday(day)})}>
            {format(day, 'd')}</span>
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
  parseDateInput: PropTypes.func,
  onHover: PropTypes.func,
  minDate: dateType,
  maxDate: dateType
};
