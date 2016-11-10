import React, {PropTypes} from 'react';
import classNames from 'classnames';

import {dateType} from './consts';

import '../input/input.scss';
import {input} from './date-picker.css';

export default function DateInput({
  active,
  text,
  hoverDate,
  date,
  format,
  onInput,
  onActivate,
  onConfirm
}) {
  const hoverDateText = active && hoverDate && hoverDate.format(format);
  const currentText = active && text;
  const dateText = date && date.format(format);

  return (
    <input
      ref={el => el && (active ? el.focus() : el.blur())}
      className={classNames(input, 'ring-input')}
      value={hoverDateText || currentText || dateText || ''}
      onChange={e => onInput(e.target.value)}
      onFocus={onActivate}
      onKeyDown={e => e.key === 'Enter' && onConfirm()}
    />
  );
}

DateInput.defaultProps = {
  active: false,
  text: '',
  hoverDate: null,
  date: null,
  format: '',
  onInput() {},
  onActivate() {},
  onConfirm() {}
};

DateInput.propTypes = {
  active: PropTypes.bool,
  text: PropTypes.string,
  hoverDate: dateType,
  date: dateType,
  format: PropTypes.string,
  onInput: PropTypes.func,
  onActivate: PropTypes.func,
  onConfirm: PropTypes.func
};
