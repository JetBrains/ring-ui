import * as React from 'react';
import classNames from 'classnames';

import Input from '../input/input';

import {ControlsHeight} from '../global/controls-height';

import {I18nContext} from '../i18n/i18n-context';

import {DatePopupBaseProps, Field} from './consts';
import styles from './date-picker.css';

export interface UpdateInputConfig {
  active: boolean
  text: string | null
}

export interface DateInputProps extends DatePopupBaseProps, UpdateInputConfig {
  divider: boolean
  name: Field
  hoverDate: Date | null
  date: Date | null | undefined
  time?: string | null | undefined
  onInput: (value: string, name: Field) => void
  onActivate: () => void
  onConfirm: () => void
}

export default class DateInput extends React.PureComponent<DateInputProps> {
  componentDidMount() {
    this.updateInput(this.props);
  }

  componentDidUpdate(prevProps: DateInputProps) {
    const {text, active} = this.props;
    if (text !== prevProps.text || active !== prevProps.active) {
      this.updateInput({text, active});
    }
  }

  static contextType = I18nContext;
  declare context: React.ContextType<typeof DateInput.contextType>;

  input?: HTMLInputElement | null;
  inputRef = (el: HTMLInputElement | null) => {
    this.input = el;
  };

  updateInput({text, active}: UpdateInputConfig) {
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

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.onInput(e.currentTarget.value, e.currentTarget.dataset.name as Field);

  handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // We have to prevent the default behavior, because restoring focus by TabTrap caused by
      // pressing Enter will trigger the onClick event on the DatePicker Dropdown anchor,
      // so DatePicker will be open again.
      // https://youtrack.jetbrains.com/issue/RG-2450/Anchor-should-be-focused-after-closing-datepicker#focus=Comments-27-10044234.0-0.
      e.preventDefault();

      this.props.onConfirm();
    }
  };

  render() {
    const {
      active, divider, text,
      time, name, hoverDate,
      date, displayFormat, translations,
      onActivate, onClear,
      fromPlaceholder, toPlaceholder, timePlaceholder, locale
    } = this.props;
    const {translate} = this.context;

    let displayText = '';
    if (active && hoverDate) {
      displayText = displayFormat(hoverDate, locale);
    } else if (active && text != null) {
      displayText = text;
    } else if (date) {
      displayText = displayFormat(date, locale);
    } else if (name === 'time') {
      displayText = time || '';
    }

    const placeholder = (() => {
      switch (name) {
        case 'from':
          return fromPlaceholder || (translations?.addFirstDate ?? translate('addFirstDate'));
        case 'to':
          return toPlaceholder || (translations?.addSecondDate ?? translate('addSecondDate'));
        case 'time':
          return timePlaceholder || (translations?.addTime ?? translate('addTime'));
        default:
          return (translations?.selectName ?? translate('selectName')).
            replace('%name%', name).
            replace('{{name}}', name);
      }
    })();

    const classes = classNames(
      styles.filter,
      styles[`${name}Input`],
      divider && styles[`${name}InputWithDivider`],
      'ring-js-shortcuts'
    );

    return (
      <Input
        autoComplete="off"
        borderless
        height={ControlsHeight.L}
        data-name={name}
        inputRef={this.inputRef}
        className={classes}
        value={displayText}
        onChange={this.handleChange}
        onFocus={onActivate}
        onKeyDown={this.handleKeyDown}
        onClear={onClear}
        placeholder={placeholder}
      />
    );
  }
}
