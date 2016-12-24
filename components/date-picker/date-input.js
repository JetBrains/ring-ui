import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';

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
      className={classNames('ring-input', styles.input)}
      value={displayText}
      onChange={e => onInput(e.target.value)}
      onFocus={onActivate}
      onKeyDown={e => e.key === 'Enter' && onConfirm()}
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
