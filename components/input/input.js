import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close.svg';

import Theme from '../global/theme';
import Button from '../button/button';

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
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    inputRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({current: PropTypes.instanceOf(HTMLInputElement)})
    ]),
    children: PropTypes.string,
    preventShortcuts: PropTypes.bool,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    theme: Theme.LIGHT,
    size: Size.M,
    onChange: noop,
    inputRef: noop,
    preventShortcuts: false
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
      preventShortcuts,
      ...restProps
    } = this.props;
    const {empty} = this.state;
    const clearable = !!onClear;
    const classes = classNames(
      styles.container,
      className,
      styles[theme],
      [styles[`size${size}`]],
      {
        'ring-js-shortcuts': !preventShortcuts,
        [styles.active]: active,
        [styles.error]: error != null,
        [styles.empty]: empty,
        [styles.noLabel]: !this.props.label,
        [styles.clearable]: clearable,
        [styles.borderless]: borderless
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
        <TagName
          ref={this.inputRef}
          onChange={this.handleChange}
          className={inputClasses}
          value={text}
          rows={multiline ? 1 : null}
          disabled={disabled}
          {...restProps}
        />
        {clearable && !disabled && (
          <Button
            data-test="ring-input-clear"
            className={styles.clear}
            icon={closeIcon}
            onClick={this.clear}
          />
        )}

        {!borderless && <label className={styles.label}>{label}</label>}
        {!borderless && <div className={styles.underline}/>}
        {!borderless && <div className={styles.focusUnderline}/>}
        {!borderless && <div className={styles.errorUnderline}/>}
        {!borderless && (
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
