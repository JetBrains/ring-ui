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
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
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
      disabled,

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
        [styles.error]: error,
        [styles.disabled]: disabled,
        [styles.empty]: this.state.empty
      }
    );

    const TagName = multiline ? 'textarea' : 'input';

    return (
      <div
        className={classes}
      >
        <TagName
          ref={el => {
            if (el) {
              this.checkValue(el);
            }
          }}
          onChange={e => {
            onChange(e);
            this.checkValue(e.target);
          }}
          className={styles.input}
          value={value || children}
          disabled={disabled}
          {...props}
        />
        <label className={styles.label}>{label}</label>
        <div className={styles.underline} />
        {typeof error === 'string' && (
          <span className={styles.error}>{error}</span>
        )}
      </div>
    );
  }
}

