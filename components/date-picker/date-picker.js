import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import formatDate from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import isSameYear from 'date-fns/isSameYear';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';
import set from 'date-fns/set';

import memoize from '../global/memoize';

import Popup from '../popup/popup';
import Dropdown, {Anchor} from '../dropdown/dropdown';

import DatePopup from './date-popup';
import {dateType, deprecatedPropType} from './consts';
import styles from './date-picker.css';
import formats from './formats';
import DateInput from './date-input';

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
    onChange: PropTypes.func,
    // TODO: Remove in 5.0
    onDateChange: deprecatedPropType('Use "onChange"'),
    dropdownProps: PropTypes.object,
    disabled: PropTypes.bool,
    minDate: dateType,
    maxDate: dateType,
    translations: PropTypes.object,
    locale: PropTypes.object
  };

  static defaultProps = {
    className: '',
    date: null,
    withTime: false,
    range: false,
    from: null,
    to: null,
    clear: false,
    displayFormat: (date, locale) => (date ? formatDate(date, 'd MMM yyyy', {locale}) : ''),
    displayMonthFormat: (date, locale) => (date ? formatDate(date, 'd MMM', {locale}) : ''),
    displayDayFormat: (date, locale) => (date ? formatDate(date, 'd', {locale}) : ''),
    displayTimeFormat: (date, locale) => (date ? formatDate(date, 'HH:mm', {locale}) : ''),
    datePlaceholder: 'Set a date',
    dateTimePlaceholder: 'Set date and time',
    rangePlaceholder: 'Set a period',
    minDate: null,
    maxDate: null,
    onChange() {},
    translations: {
      setDate: 'Set a date',
      setDateTime: 'Set date and time',
      setPeriod: 'Set a period'
    },
    applyTimeInput(date, timeString) {
      const [hours, minutes] = timeString?.split(':') ?? [];
      return minutes != null ? set(date, {hours, minutes}) : date;
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
    const {onChange, onDateChange, withTime, applyTimeInput} = this.props;
    const adjustedChange =
      withTime && change.date != null ? applyTimeInput(change.date, change.time) : change;
    onChange(adjustedChange);
    if (onDateChange != null) {
      onDateChange(adjustedChange);
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
    const {displayTimeFormat} = this.props;
    const date = this.parse(this.props.date);
    if (date != null) {
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
      displayDayFormat,
      translations,
      locale
    } = this.props;

    const date = this.parse(this.props.date);
    const from = this.parse(this.props.from);
    const to = this.parse(this.props.to);
    const time = this.formatTime();

    let text;
    if (!range && !withTime) {
      text = date ? displayFormat(date, locale) : (datePlaceholder ?? translations.setDate);
    } else if (!range && withTime) {
      if (!date && !time) {
        text = dateTimePlaceholder ?? translations.setDateTime;
      } else {
        text = `${date && displayFormat(date, locale) || '—'}, ${time || '—'}`;
      }
    } else if (!from && !to) {
      text = rangePlaceholder ?? translations.setPeriod;
    } else if (!to) {
      text = `${displayFormat(from, locale)} —`;
    } else if (!from) {
      text = `— ${displayFormat(to, locale)}`;
    } else if (!isSameYear(from, to)) {
      text = `${displayFormat(from, locale)} — ${displayFormat(to, locale)}`;
    } else if (!isSameMonth(from, to)) {
      text = `${displayMonthFormat(from, locale)} — ${displayFormat(to, locale)}`;
    } else if (!isSameDay(from, to)) {
      text = `${displayDayFormat(from, locale)} — ${displayFormat(to, locale)}`;
    } else {
      text = `${displayFormat(to, locale)}`;
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
      translations,
      ...datePopupProps
    } = this.props;

    const classes = classNames(
      styles.datePicker,
      className
    );

    // We want to provide translations further down to DateInput.
    // Yet we should pass at least DateInput default translations not to have them empty.
    datePopupProps.translations = Object.assign(
      {},
      DateInput.defaultProps.translations,
      translations
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
