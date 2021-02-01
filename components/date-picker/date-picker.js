import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import formatDate from 'date-fns/format';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';

import memoize from '../global/memoize';
import rerenderHOC from '../global/rerender-hoc';

import Popup from '../popup/popup';
import Dropdown, {Anchor} from '../dropdown/dropdown';

import DatePopup from './date-popup';
import {dateType, deprecatedPropType, parseTime} from './consts';
import styles from './date-picker.css';
import formats from './formats';

const PopupComponent = ({
  hidden,
  className,
  popupRef,
  onClear,
  datePopupProps,
  onComplete,
  ...restProps
}) => (
  <Popup
    hidden={hidden}
    keepMounted
    className={className}
    ref={popupRef}
    directions={[
      Popup.PopupProps.Directions.BOTTOM_RIGHT,
      Popup.PopupProps.Directions.BOTTOM_LEFT,
      Popup.PopupProps.Directions.TOP_LEFT,
      Popup.PopupProps.Directions.TOP_RIGHT
    ]}
    {...restProps}
  >
    <DatePopup
      onClear={onClear}
      {...datePopupProps}
      onComplete={onComplete}
      hidden={hidden}
    />
  </Popup>
);

PopupComponent.propTypes = {
  hidden: PropTypes.bool,
  className: PropTypes.string,
  popupRef: PropTypes.func,
  onClear: PropTypes.func,
  datePopupProps: PropTypes.shape(DatePopup.propTypes),
  onComplete: PropTypes.func
};

/**
 * @name Date Picker
 */

export default class DatePicker extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    date: dateType,
    time: deprecatedPropType('Pass time as a part of "date"'),
    withTime: PropTypes.bool,
    range: PropTypes.bool,
    from: dateType,
    to: dateType,
    clear: PropTypes.bool,
    displayFormat: PropTypes.func,
    displayMonthFormat: PropTypes.func,
    displayDayFormat: PropTypes.func,
    displayTimeFormat: PropTypes.func,
    parseDateInput: PropTypes.func,
    applyTimeInput: PropTypes.func,
    datePlaceholder: PropTypes.string,
    dateTimePlaceholder: PropTypes.string,
    rangePlaceholder: PropTypes.string,
    onChange: deprecatedPropType('Use "onDateChange"'),
    // TODO: Rename to onChange in 4.0, remove the alias in 5.0
    onDateChange: PropTypes.func,
    dropdownProps: PropTypes.object,
    disabled: PropTypes.bool,
    minDate: dateType,
    maxDate: dateType
  };

  static defaultProps = {
    className: '',
    date: null,
    withTime: false,
    range: false,
    from: null,
    to: null,
    clear: false,
    displayFormat: date => (date ? formatDate(date, 'd MMM yyyy') : ''),
    displayMonthFormat: date => (date ? formatDate(date, 'y MMM') : ''),
    displayDayFormat: date => (date ? formatDate(date, 'y') : ''),
    displayTimeFormat: date => (date ? formatDate(date, 'HH:mm') : ''),
    datePlaceholder: 'Set a date',
    dateTimePlaceholder: 'Set date and time',
    rangePlaceholder: 'Set a period',
    minDate: null,
    maxDate: null,
    onDateChange() {},
    applyTimeInput(date, timeString) {
      const [hours, minutes] = timeString.split(':');
      const result = new Date(date.getTime());
      if (minutes != null) {
        result.setHours(hours);
        result.setMinutes(minutes);
      }
      return result;
    },
    parseDateInput(string) {
      if (!string) {
        return null;
      }
      const today = new Date();
      for (const format of formats) {
        const date = parse(string, format, today);
        if (isValid(date)) {
          return date;
        }
      }
      return null;
    }
  };

  handleChange = change => {
    const {onChange, onDateChange, range, withTime, applyTimeInput} = this.props;
    if (onChange != null) {
      onChange(change);
    }
    if (range) {
      onDateChange({from: change.from?.toDate(), to: change.to?.toDate()});
    } else if (withTime) {
      onDateChange(applyTimeInput(change.date?.toDate(), change.time));
    } else {
      onDateChange(change?.toDate());
    }
  };

  clear = () => {
    let change = null;
    if (this.props.range) {
      change = {from: null, to: null};
    }

    this.handleChange(change);
  };

  popupRef = el => {
    this.popup = el;
  };

  closePopup = () => {
    this.popup._onCloseAttempt();
  };

  parse = memoize(date => {
    const {parseDateInput} = this.props;

    if (date instanceof Date) {
      return date;
    }
    if (typeof date === 'number') {
      return new Date(date);
    }

    return parseDateInput(date);
  });

  formatTime() {
    const {time, displayTimeFormat} = this.props;
    const date = this.parse(this.props.date);
    if (time != null) {
      return parseTime(time);
    } else if (date != null) {
      return displayTimeFormat(date);
    }
    return null;
  }

  getAnchorText = () => {
    const {
      range,
      datePlaceholder,
      dateTimePlaceholder,
      rangePlaceholder,
      withTime,
      displayFormat,
      displayMonthFormat,
      displayDayFormat
    } = this.props;

    const date = this.parse(this.props.date);
    const from = this.parse(this.props.from);
    const to = this.parse(this.props.to);
    const time = this.formatTime();

    let text;
    if (!range && !withTime) {
      text = date ? displayFormat(date) : datePlaceholder;
    } else if (!range && withTime) {
      if (!date && !time) {
        text = dateTimePlaceholder;
      } else {
        text = `${date && displayFormat(date) || '—'}, ${time || '—'}`;
      }
    } else if (!from && !to) {
      text = rangePlaceholder;
    } else if (!to) {
      text = `${displayFormat(from)} —`;
    } else if (!from) {
      text = `— ${displayFormat(to)}`;
    } else if (!moment(from).isSame(to, 'year')) {
      text = `${displayFormat(from)} — ${displayFormat(to)}`;
    } else if (!moment(from).isSame(to, 'month')) {
      text = `${displayMonthFormat(from)} — ${displayFormat(to)}`;
    } else if (!moment(from).isSame(to, 'day')) {
      text = `${displayDayFormat(from)} — ${displayFormat(to)}`;
    } else {
      text = `${displayFormat(to)}`;
    }

    return text;
  };

  render() {
    const text = this.getAnchorText();

    if (this.props.disabled) {
      return <Anchor disabled>{text}</Anchor>;
    }

    const {
      className,
      popupClassName,
      clear,
      dropdownProps,
      ...datePopupProps
    } = this.props;

    const classes = classNames(
      styles.datePicker,
      className
    );

    return (
      <Dropdown
        className={classes}
        anchor={text}
        {...dropdownProps}
      >
        <PopupComponent
          className={popupClassName}
          popupRef={this.popupRef}
          onClear={clear ? this.clear : null}
          datePopupProps={{
            ...datePopupProps,
            onChange: this.handleChange,
            parseDateInput: this.parse,
            time: this.formatTime()
          }}
          onComplete={this.closePopup}
        />
      </Dropdown>
    );
  }
}

export const RerenderableDatePicker = rerenderHOC(DatePicker);

