import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';

import Input from '../input/input';

import {dateType} from './consts';
import styles from './date-picker.css';

export default class DateInput extends Component {
  handleChange = e => this.props.onInput(e.target.value);

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      this.props.onConfirm();
    }
  };

  render() {
    const {
      active,
      text,
      hoverDate,
      date,
      inputFormat,
      onActivate
    } = this.props;
    let displayText = '';
    if (active && hoverDate) {
      displayText = hoverDate.format(inputFormat);
    } else if (active && text != null) {
      displayText = text;
    } else if (date) {
      displayText = date.format(inputFormat);
    }

    const classes = classNames(styles.input, 'ring-js-shortcuts');

    return (
      <Input
        // eslint-disable-next-line react/jsx-no-bind
        ref={rgEl => {
          // eslint-disable-next-line react/no-find-dom-node
          const el = findDOMNode(rgEl);
          if (!el) {
            return;
          }

          if (active) {
            el.focus();
            text || el.select();
          } else {
            el.blur();
          }
        }}
        className={classes}
        value={displayText}
        onChange={this.handleChange}
        onFocus={onActivate}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

DateInput.propTypes = {
  active: PropTypes.bool,
  text: PropTypes.string,
  hoverDate: dateType,
  date: dateType,
  inputFormat: PropTypes.string,
  onInput: PropTypes.func,
  onActivate: PropTypes.func,
  onConfirm: PropTypes.func
};
