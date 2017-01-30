import React, {PropTypes} from 'react';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';

import styles from './input.css';

/**
 * @name Input
 * @category Components
 * @framework React
 * @constructor
 * @description Text input fields of varying size.
 * @example-file ./input.examples.html
 */

const Size = {
  S: 'S',
  M: 'M',
  L: 'L'
};

export default class Input extends RingComponent {
  static Size = Size;

  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.string,
    label: PropTypes.string,
    active: PropTypes.bool,
    error: PropTypes.string,
    multiline: PropTypes.bool,
    onChange: PropTypes.func
  };

  static defaultProps = {
    size: Size.M,
    onChange() {}
  };

  state = {
    empty: true
  };

  checkValue() {
    this.setState({
      empty: !this.input.value
    });

    if (this.props.multiline && this.input.scrollHeight > this.input.clientHeight) {
      this.stretch(this.input);
    }
  }

  stretch(el) {
    el.style.height = `${el.scrollHeight}px`;
  }

  didMount() {
    this.checkValue();
    this.stretch(this.error);
  }

  shouldUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState.empty !== this.state.empty;
  }

  didUpdate() {
    this.checkValue();
    this.stretch(this.error);
  }

  errorRef = el => {
    this.error = el;
  };

  inputRef = el => {
    this.input = el;
  };

  render() {
    const {
      // Modifiers
      size,
      active,
      multiline,

      // Props
      label,
      error,
      className,
      children,
      value,
      onChange,
      ...props
    } = this.props;
    const classes = classNames(
      styles.container,
      className,
      [styles[`size${size}`]],
      {
        [styles.active]: active,
        [styles.error]: error != null,
        [styles.empty]: this.state.empty,
        [styles.noLabel]: !this.props.label
      }
    );

    const inputProps = {
      ref: this.inputRef,
      onChange: e => {
        onChange(e);
        this.checkValue(e.target);
      },
      className: styles.input,
      value: value != null ? value : children,
      ...props
    };

    return (
      <div
        className={classes}
        data-test="ring-input"
      >
        {multiline ? (
          <textarea
            rows="1"
            {...inputProps}
          />
        ) : (
          <input {...inputProps} />
        )}
        <label className={styles.label}>{label}</label>
        <div className={styles.underline} />
        <div className={styles.focusUnderline} />
        <div className={styles.errorUnderline} />
        <div
          className={styles.errorText}
          ref={this.errorRef}
        >{error}</div>
      </div>
    );
  }
}

