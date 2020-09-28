import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import checkmarkIcon from '@jetbrains/icons/checkmark.svg';

import Icon from '../icon/icon';

import styles from './checkbox.css';

/**
 * @name Checkbox
 */
export default class Checkbox extends PureComponent {

  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    cellClassName: PropTypes.string,
    labelClassName: PropTypes.string,
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

    const classes = classNames(styles.input, this.props.className);
    const containerClasses = classNames(styles.checkbox, this.props.containerClassName);
    const cellClasses = classNames(styles.cell, this.props.cellClassName);
    const labelClasses = classNames(styles.label, this.props.labelClassName);

    return (
      <label
        className={containerClasses}
        data-test="ring-checkbox"
      >
        <input
          {...restProps}
          ref={this.inputRef}
          type="checkbox"
          className={classes}
        />
        <span className={cellClasses}>
          <Icon
            glyph={checkmarkIcon}
            className={styles.icon}
          />
        </span>
        <span className={labelClasses}>{label || children}</span>
      </label>
    );
  }
}
