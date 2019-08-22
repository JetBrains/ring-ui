import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import rerenderHOC from '../global/rerender-hoc';

import Popup from '../popup/popup';
import Dropdown, {Anchor} from '../dropdown/dropdown';

import DatePopup from './date-popup';
import {dateType, parseDate} from './consts';
import styles from './date-picker.css';

/**
 * @name Date Picker
 */

export default class DatePicker extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    date: dateType,
    range: PropTypes.bool,
    from: dateType,
    to: dateType,
    clear: PropTypes.bool,
    displayFormat: PropTypes.string,
    displayMonthFormat: PropTypes.string,
    displayDayFormat: PropTypes.string,
    inputFormat: PropTypes.string,
    datePlaceholder: PropTypes.string,
    rangePlaceholder: PropTypes.string,
    onChange: PropTypes.func,
    dropdownProps: PropTypes.object,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    date: null,
    range: false,
    from: null,
    to: null,
    clear: false,
    displayFormat: 'D MMM YYYY',
    displayMonthFormat: 'D MMM',
    displayDayFormat: 'D',
    inputFormat: 'D MMM YYYY',
    datePlaceholder: 'Set a date',
    rangePlaceholder: 'Set a period',
    onChange() {}
  };

  clear = () => {
    this.props.onChange(
      this.props.range
        ? {from: null, to: null}
        : null
    );
  };

  popupRef = el => {
    this.popup = el;
  };

  closePopup = () => {
    this.popup._onCloseAttempt();
  };

  getAnchorText = () => {
    const {
      range,
      displayFormat,
      inputFormat,
      displayMonthFormat,
      displayDayFormat,
      datePlaceholder,
      rangePlaceholder
    } = this.props;

    const parse = text => parseDate(
      text,
      inputFormat,
      displayFormat
    );

    const date = parse(this.props.date);
    const from = parse(this.props.from);
    const to = parse(this.props.to);

    let text;
    if (!range) {
      text = date ? date.format(displayFormat) : datePlaceholder;
    } else if (!from && !to) {
      text = rangePlaceholder;
    } else if (!to) {
      text = `${from.format(displayFormat)} —`;
    } else if (!from) {
      text = `— ${to.format(displayFormat)}`;
    } else if (!from.isSame(to, 'year')) {
      text = `${from.format(displayFormat)} — ${to.format(displayFormat)}`;
    } else if (!from.isSame(to, 'month')) {
      text = `${from.format(displayMonthFormat)} — ${to.format(displayFormat)}`;
    } else if (!from.isSame(to, 'day')) {
      text = `${from.format(displayDayFormat)} — ${to.format(displayFormat)}`;
    } else {
      text = `${to.format(displayFormat)}`;
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
        <Popup
          keepMounted
          className={popupClassName}
          ref={this.popupRef}
          directions={[
            Popup.PopupProps.Directions.BOTTOM_RIGHT,
            Popup.PopupProps.Directions.BOTTOM_LEFT,
            Popup.PopupProps.Directions.TOP_LEFT,
            Popup.PopupProps.Directions.TOP_RIGHT
          ]}
        >
          <DatePopup
            onClear={clear ? this.clear : null}
            {...datePopupProps}
            onComplete={this.closePopup}
          />
        </Popup>
      </Dropdown>
    );
  }
}

export const RerenderableDatePicker = rerenderHOC(DatePicker);

