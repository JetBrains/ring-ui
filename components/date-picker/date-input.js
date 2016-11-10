import React, {PropTypes} from 'react';

import {dateType} from './consts';

import '../input/input.scss';

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
  const hoverDateText = active && hoverDate && hoverDate.format(inputFormat);
  const currentText = active && text;
  const dateText = date && date.format(inputFormat);
  return (
    <input
      ref={el => el && (active ? el.focus() : el.blur())}
      className="ring-input"
      value={hoverDateText || currentText || dateText || ''}
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
