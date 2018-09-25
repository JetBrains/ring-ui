import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {CheckmarkIcon} from '../icon';

import styles from './checkbox.css';

/**
 * @name Checkbox
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Displays a checkbox.
 * @extends {ReactComponent}
 * @example-file ./checkbox.examples.html
 */
export default class Checkbox extends PureComponent {

  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    children: PropTypes.node
  };

  inputRef = el => {
    this.input = el;
  };

  render() {
    const {children, label, ...restProps} = this.props;

    const classes = classNames(
      styles.input,
      this.props.className
    );

    return (
      <label
        className={styles.checkbox}
        data-test="ring-checkbox"
      >
        <input
          {...restProps}
          ref={this.inputRef}
          type="checkbox"
          className={classes}
        />
        <span className={styles.cell}>
          <CheckmarkIcon
            className={styles.icon}
            size={CheckmarkIcon.Size.Size14}
          />
        </span>
        <span className={styles.label}>{label || children}</span>
      </label>
    );
  }
}
