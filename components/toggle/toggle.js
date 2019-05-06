import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Theme from '../global/theme';
import dataTests from '../global/data-tests';

import styles from './toggle.css';

/**
  * @name Toggle
  */

export default class Toggle extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    name: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    leftLabel: PropTypes.node,
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    pale: PropTypes.bool,
    onChange: PropTypes.func,
    onTransitionEnd: PropTypes.func,
    theme: PropTypes.string,
    'data-test': PropTypes.string
  };

  static defaultProps = {
    theme: Theme.LIGHT
  };

  render() {
    const {className, children, disabled, pale, title, leftLabel, theme, 'data-test': dataTest,
      onTransitionEnd, ...restProps} = this.props;

    const classes = classNames(
      className,
      styles.toggle,
      styles[theme],
      disabled && styles.disabled
    );

    return (
      <label
        className={classes}
        title={title}
        data-test={dataTests('ring-toggle', dataTest)}
      >
        {leftLabel && <span className={styles.leftLabel}>{leftLabel}</span>}

        <span className={styles.switchWrapper}>
          <input
            data-test="ring-toggle-input"
            {...restProps}
            type="checkbox"
            disabled={disabled}
            className={styles.input}
          />

          <span
            className={classNames(styles.switch, pale && styles.paleSwitch)}
            onTransitionEnd={onTransitionEnd}
          />
        </span>

        {children && <span className={styles.label}>{children}</span>}
      </label>
    );
  }
}
