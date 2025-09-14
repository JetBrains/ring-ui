import {Component} from 'react';
import classNames from 'classnames';
import {addDays} from 'date-fns/addDays';
import {format} from 'date-fns/format';
import {getDay} from 'date-fns/getDay';
import {getDate} from 'date-fns/getDate';
import {isAfter} from 'date-fns/isAfter';
import {isBefore} from 'date-fns/isBefore';
import {isSameDay} from 'date-fns/isSameDay';
import {isToday} from 'date-fns/isToday';
import {startOfDay} from 'date-fns/startOfDay';

import {type MonthsProps, weekdays, getDayNumInWeek} from './consts';
import styles from './date-picker.css';

export interface DayProps extends MonthsProps {
  day: Date;
  empty: boolean;
}

let hoverTO: number | null;
export default class Day extends Component<DayProps> {
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

  isDay = (date: Date) => isSameDay(this.props.day, date);

  is = (name: 'date' | 'from' | 'to' | 'activeDate') => {
    const value = this.props[name];
    return !!value && this.isDay(value);
  };

  inRange = (range: [Date, Date] | null) =>
    range &&
    isAfter(startOfDay(this.props.day), startOfDay(range[0])) &&
    isBefore(startOfDay(this.props.day), startOfDay(range[1]));

  isDisabled = (date: Date) => {
    const min = this.parse(this.props.minDate);
    const max = this.parse(this.props.maxDate);
    return (min && isBefore(startOfDay(date), startOfDay(min))) || (max && isAfter(startOfDay(date), startOfDay(max)));
  };

  parse(text: string | null | undefined) {
    return this.props.parseDateInput(text);
  }

  render() {
    const {day, from, currentRange, activeRange, empty, locale} = this.props;

    const reverse = activeRange && activeRange[1] === from;
    const dayInWeek = getDayNumInWeek(locale, getDay(day)) + 1;

    function makeSpreadRange(range: [Date, Date] | null): [Date, Date] | null {
      return range && [range[0], addDays(range[1], 1)];
    }

    const spreadRange = makeSpreadRange(currentRange);
    const disabled = !!this.isDisabled(day);
    const activeSpreadRange = makeSpreadRange(activeRange);
    return (
      // TODO make keyboard navigation actually work
      <button
        type='button'
        className={classNames(styles.day, styles[`Day${dayInWeek}`], {
          [styles.current]: (['date', 'from', 'to'] as const).some(this.is),
          [styles.active]: !disabled && this.is('activeDate'),
          [styles.weekend]: [weekdays.SA, weekdays.SU].includes(getDay(day)),
          [styles.empty]: empty,
          [styles.from]:
            (currentRange && this.isDay(currentRange[0]) && !reverse) || (activeRange && this.isDay(activeRange[0])),
          [styles.to]: (currentRange && this.isDay(currentRange[1])) || (activeRange && this.isDay(activeRange[1])),
          [styles.between]: this.inRange(currentRange),
          [styles.activeBetween]: !disabled && this.inRange(activeRange),
          [styles.first]: getDate(day) === 1,
          [styles.spread]: this.inRange(spreadRange),
          [styles.activeSpread]: !disabled && this.inRange(activeSpreadRange),
          [styles.disabled]: disabled,
        })}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onFocus={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onBlur={this.handleMouseOut}
        disabled={disabled}
      >
        {empty || <span className={classNames({[styles.today]: isToday(day)})}>{format(day, 'd')}</span>}
      </button>
    );
  }
}
