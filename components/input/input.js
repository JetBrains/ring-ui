import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close.svg';

import Theme from '../global/theme';
import Button from '../button/button';

import getUID from '../global/get-uid';

import Icon from '../icon/icon';

import ieCompatibleInputHOC from './ie-compatible-hoc';
import styles from './input.css';

function noop() {}

/**
 * @name Input
 */

const Size = {
  AUTO: 'Auto',
  S: 'S',
  M: 'M',
  L: 'L',
  FULL: 'FULL'
};

export class Input extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    theme: PropTypes.string,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    size: PropTypes.string,
    label: PropTypes.string,
    active: PropTypes.bool,
    error: PropTypes.string,
    multiline: PropTypes.bool,
    borderless: PropTypes.bool,
    compact: PropTypes.bool,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    inputRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({current: PropTypes.instanceOf(HTMLInputElement)})
    ]),
    children: PropTypes.string,
    enableShortcuts: PropTypes.bool,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType])
  };

  static defaultProps = {
    theme: Theme.LIGHT,
    size: Size.M,
    onChange: noop,
    inputRef: noop,
    enableShortcuts: false
  };

  state = {
    empty: true
  };

  componentDidMount() {
    this.adapt();
  }

  componentDidUpdate() {
    this.adapt();
  }

  id = getUID('ring-input-');
  getId() {
    return this.props.id || this.id;
  }

  checkValue() {
    this.setState({
      empty: !this.input.value
    });

    if (this.props.multiline && this.input.scrollHeight > this.input.clientHeight) {
      this.stretch(this.input);
    }
  }

  stretch(el) {
    if (!el) {
      return;
    }
    el.style.height = `${el.scrollHeight}px`;
  }

  adapt() {
    this.checkValue();
    this.stretch(this.error);
  }

  errorRef = el => {
    this.error = el;
  };

  inputRef = el => {
    const {inputRef} = this.props;

    this.input = el;
    if (typeof inputRef === 'function') {
      inputRef(el);
    } else {
      inputRef.current = el;
    }
  };

  clear = e => {
    this.props.onClear && this.props.onClear(e);
  };

  handleChange = e => {
    this.props.onChange(e);
    this.checkValue(e.target);
  };

  render() {
    const {
      // Modifiers
      theme,
      size,
      active,
      multiline,
      borderless,
      compact,

      // Props
      label,
      error,
      className,
      inputClassName,
      children,
      value,
      onClear,
      disabled,
      inputRef, onChange,
      enableShortcuts,
      id,
      placeholder,
      icon,
      ...restProps
    } = this.props;
    const minimizeMargins = compact || borderless;
    const {empty} = this.state;
    const clearable = !!onClear;
    const classes = classNames(
      styles.container,
      className,
      styles[theme],
      [styles[`size${size}`]],
      {
        'ring-js-shortcuts': enableShortcuts,
        [styles.active]: active,
        [styles.error]: error != null,
        [styles.empty]: empty,
        [styles.noLabel]: !this.props.label,
        [styles.withIcon]: icon != null,
        [styles.clearable]: clearable,
        [styles.compact]: minimizeMargins
      }
    );

    const inputClasses = classNames(styles.input, inputClassName);

    const TagName = multiline ? 'textarea' : 'input';

    const text = value != null ? value : children;

    return (
      <div
        className={classes}
        data-test="ring-input"
      >
        {icon && <Icon glyph={icon} className={styles.icon}/>}
        <TagName
          ref={this.inputRef}
          onChange={this.handleChange}
          className={inputClasses}
          value={text}
          rows={multiline ? 1 : null}
          disabled={disabled}
          id={this.getId()}
          placeholder={placeholder}
          aria-label={label || placeholder}
          {...restProps}
        />
        {clearable && !disabled && (
          <Button
            title="Clear input"
            data-test="ring-input-clear"
            className={styles.clear}
            icon={closeIcon}
            onClick={this.clear}
          />
        )}

        {!minimizeMargins && <label htmlFor={this.getId()} className={styles.label}>{label}</label>}
        {!borderless && <div className={styles.underline}/>}
        {!borderless && <div className={styles.focusUnderline}/>}
        {!minimizeMargins && <div className={styles.errorUnderline}/>}
        {!minimizeMargins && (
          <div
            className={styles.errorText}
            ref={this.errorRef}
          >{error}</div>
        )}
      </div>
    );
  }
}

export default ieCompatibleInputHOC(Input);

export {Size, Theme};
