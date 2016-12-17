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

export default class Input extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOf(['S', 'M', 'L']),
    label: PropTypes.string,
    active: PropTypes.bool,
    error: PropTypes.string,
    multiline: PropTypes.bool,
    onChange: PropTypes.func
  };

  static defaultProps = {
    size: 'M',
    onChange() {}
  };

  state = {
    empty: true
  };

  checkValue(el) {
    this.setState({
      empty: !el.value
    });

    if (this.props.multiline && el.scrollHeight > el.clientHeight) {
      el.style.height = `${el.scrollHeight}px`;
    }
  }

  shouldUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState.empty !== this.state.empty;
  }

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
      {
        [styles[`size${size}`]]: true,
        [styles.active]: active,
        [styles.error]: error != null,
        [styles.empty]: this.state.empty
      }
    );

    const inputProps = {
      ref: el => {
        if (el) {
          this.checkValue(el);
        }
      },
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
          ref={el => {
            if (el) {
              el.style.height = `${el.scrollHeight}px`;
            }
          }}
        >{error}</div>
      </div>
    );
  }
}

