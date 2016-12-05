import React, {PropTypes} from 'react';
import classNames from 'classnames';

import calendarIcon from 'jetbrains-icons/calendar.svg';
import closeIcon from 'jetbrains-icons/close.svg';

import RingComponent from '../ring-component/ring-component';
import Popup from '../popup/popup';
import Button from '../button/button';
import DatePopup from './date-popup';
import {dateType, parseDate} from './consts';
import Icon from '../icon/icon';

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
    clear: false,
    displayFormat: 'D MMM YYYY',
    displayMonthFormat: 'D MMM',
    displayDayFormat: 'D',
    inputFormat: 'D MMMM YYYY',
    datePlaceholder: 'Select a date',
    rangePlaceholder: 'Select a date range',
    onChange() {}
  };
  static propTypes = {
    className: PropTypes.string,
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
    onChange: PropTypes.func
  };

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

  clear(e) {
    e.stopPropagation();
    this.props.onChange(
      this.props.range
        ? {from: null, to: null}
        : null
    );
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

    const {
      range,
      displayFormat,
      displayMonthFormat,
      displayDayFormat,
      datePlaceholder,
      rangePlaceholder,
      clear
    } = this.props;
    const parse = text => parseDate(
      text,
      this.props.inputFormat,
      this.props.displayFormat
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

    return (
      <Button
        onClick={::this.handleClick}
        icon={calendarIcon}
        iconSize={17}
        className={classes}
      >
        <span
          className={displayClasses}
        >{text}{clear && (date || from || to) && (
          <Icon
            className={styles.clear}
            glyph={closeIcon}
            size={Icon.Size.Size14}
            onClick={::this.clear}
          />
        )}</span>
      </Button>
    );
  }
}

