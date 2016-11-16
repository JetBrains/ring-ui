import React, {PropTypes} from 'react';
import classNames from 'classnames';

import calendarIcon from 'jetbrains-icons/calendar.svg';

import RingComponent from '../ring-component/ring-component';
import Popup from '../popup/popup';
import Button from '../button-legacy/button-legacy';
import DatePopup from './date-popup';
import {dateType, parseDate} from './consts';

import styles from './date-picker.css';

/**
 * @name Date Picker
 * @category Components
 * @framework React
 * @constructor
 * @description Allows picking a date or a date range
 * @example-file ./date-picker.examples.html
 */

export default class DatePicker extends RingComponent {
  static defaultProps = {
    className: '',
    date: null,
    range: false,
    from: null,
    to: null,
    displayFormat: 'D MMM YYYY',
    displayMonthFormat: 'D MMM',
    displayDayFormat: 'D',
    inputFormat: 'D MMMM YYYY',
    datePlaceholder: 'Select a date',
    rangePlaceholder: 'Select a date range'
  };
  static propTypes = {
    className: PropTypes.string,
    date: dateType,
    range: PropTypes.bool,
    from: dateType,
    to: dateType,
    displayFormat: PropTypes.string,
    displayMonthFormat: PropTypes.string,
    displayDayFormat: PropTypes.string,
    inputFormat: PropTypes.string,
    datePlaceholder: PropTypes.string,
    rangePlaceholder: PropTypes.string
  };

  display() {
    const {
      range,
      displayFormat,
      displayMonthFormat,
      displayDayFormat,
      datePlaceholder,
      rangePlaceholder
    } = this.props;
    const parse = text => parseDate(
      text,
      this.props.inputFormat,
      this.props.displayFormat
    );

    const date = parse(this.props.date);
    const from = parse(this.props.from);
    const to = parse(this.props.to);

    if (!range) {
      return date ? date.format(displayFormat) : datePlaceholder;
    } else if (!from && !to) {
      return rangePlaceholder;
    } else if (!to) {
      return `${from.format(displayFormat)} —`;
    } else if (!from) {
      return `— ${to.format(displayFormat)}`;
    } else if (!from.isSame(to, 'year')) {
      return `${from.format(displayFormat)} — ${to.format(displayFormat)}`;
    } else if (!from.isSame(to, 'month')) {
      return `${from.format(displayMonthFormat)} — ${to.format(displayFormat)}`;
    } else if (!from.isSame(to, 'day')) {
      return `${from.format(displayDayFormat)} — ${to.format(displayFormat)}`;
    } else {
      return `${to.format(displayFormat)}`;
    }
  }

  createPopup() {
    this.popup = Popup.renderPopup(Popup.factory({
      hidden: true,
      autoRemove: false,
      anchorElement: this.node
    }));
  }

  updatePopup() {
    if (this.popup) {
      this.popup.rerender({
        children: (
          <DatePopup
            {...this.props}
            onComplete={::this.popup.hide}
          />
        )
      });
    }
  }

  handleClick() {
    if (!this.popup) {
      this.createPopup();
    }

    if (!this.popup.isVisible()) {
      this.popup.show(::this.updatePopup);
    }
  }

  didUpdate() {
    if (this.popup && this.popup.isVisible()) {
      this.updatePopup();
    }
  }

  render() {
    const classes = classNames(
      styles.datePicker,
      this.props.className
    );
    const displayClasses = classNames(
      styles.displayDate,
      {[styles.displayRange]: this.props.range}
    );

    return (
      <Button
        onClick={::this.handleClick}
        icon={calendarIcon}
        iconSize={17}
        className={classes}
      >
        <span
          className={displayClasses}
        >{this.display()}</span>
      </Button>
    );
  }
}

