import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';

import Input from '../input/input';

import {dateType} from './consts';
import styles from './date-picker.css';

export default function DateInput({
  active,
  text,
  hoverDate,
  date,
  inputFormat,
  onInput,
  onActivate,
  onConfirm
}) {
  let displayText = '';
  if (active && hoverDate) {
    displayText = hoverDate.format(inputFormat);
  } else if (active && text != null) {
    displayText = text;
  } else if (date) {
    displayText = date.format(inputFormat);
  }

  return (
    <Input
      // eslint-disable-next-line react/jsx-no-bind
      ref={rgEl => {
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
      className={styles.input}
      value={displayText}
      onChange={function handleChange(e) {
        onInput(e.target.value);
      }}
      onFocus={onActivate}
      onKeyDown={function handleKeyDown(e) {
        if (e.key === 'Enter') {
          onConfirm();
        }
      }}
    />
  );
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
