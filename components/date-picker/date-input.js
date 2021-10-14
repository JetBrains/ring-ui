import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Input from '../input/input';

import {dateType} from './consts';
import styles from './date-picker.css';

export default class DateInput extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    divider: PropTypes.bool,
    name: PropTypes.string,
    text: PropTypes.string,
    hoverDate: dateType,
    date: dateType,
    time: PropTypes.string,
    displayFormat: PropTypes.func,
    hidden: PropTypes.bool,
    translations: PropTypes.object,
    fromPlaceholder: PropTypes.string,
    toPlaceholder: PropTypes.string,
    timePlaceholder: PropTypes.string,
    onInput: PropTypes.func,
    onActivate: PropTypes.func,
    onConfirm: PropTypes.func,
    onClear: PropTypes.func,
    locale: PropTypes.object
  };

  static defaultProps = {
    fromPlaceholder: null,
    toPlaceholder: null,
    timePlaceholder: null,
    translations: {
      addFirstDate: 'Add first date',
      addSecondDate: 'Add second date',
      addTime: 'Add time',
      selectName: 'Select %name%'
    }
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

  handleChange = e => this.props.onInput(e.target.value, e.target.dataset.name);

  handleKeyDown = e => e.key === 'Enter' && this.props.onConfirm();

  render() {
    const {
      active, divider, text,
      time, name, hoverDate,
      date, displayFormat, translations,
      onActivate, onClear,
      fromPlaceholder, toPlaceholder, timePlaceholder, locale
    } = this.props;

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
          return fromPlaceholder || translations.addFirstDate;
        case 'to':
          return toPlaceholder || translations.addSecondDate;
        case 'time':
          return timePlaceholder || translations.addTime;
        default:
          return translations.selectName.replace('%name%', name);
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
