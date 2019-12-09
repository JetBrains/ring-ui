import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Input from '../input/input';

import {dateType} from './consts';
import styles from './date-picker.css';

export default class DateInput extends Component {
  static propTypes = {
    active: PropTypes.bool,
    name: PropTypes.string,
    text: PropTypes.string,
    hoverDate: dateType,
    date: dateType,
    inputFormat: PropTypes.string,
    hidden: PropTypes.bool,
    onInput: PropTypes.func,
    onActivate: PropTypes.func,
    onConfirm: PropTypes.func,
    onClear: PropTypes.func
  };

  componentDidUpdate(prevProps) {
    const {hidden, text, active} = this.props;
    if (!hidden && prevProps.hidden || text !== prevProps.text || active !== prevProps.active) {
      this.updateInput({text, active});
    }
  }

  inputRef = el => {
    this.input = el;
    this.updateInput(this.props);
  };

  updateInput({text, active}) {
    const el = this.input;
    if (!el) {
      return;
    }

    if (active) {
      el.focus();
      if (!text) {
        el.select();
      }
    } else {
      el.blur();
    }
  }

  handleChange = e => this.props.onInput(e.target.value);

  handleKeyDown = e => e.key === 'Enter' && this.props.onConfirm();

  render() {
    const {
      active,
      text,
      name,
      hoverDate,
      date,
      inputFormat,
      onActivate,
      onClear
    } = this.props;
    let displayText = '';
    if (active && hoverDate) {
      displayText = hoverDate.format(inputFormat);
    } else if (active && text != null) {
      displayText = text;
    } else if (date) {
      displayText = date.format(inputFormat);
    }

    const classes = classNames(styles.filter, styles[`${name}Input`], 'ring-js-shortcuts');

    return (
      <Input
        borderless
        inputRef={this.inputRef}
        className={classes}
        value={displayText}
        onChange={this.handleChange}
        onFocus={onActivate}
        onKeyDown={this.handleKeyDown}
        onClear={onClear}
      />
    );
  }
}
