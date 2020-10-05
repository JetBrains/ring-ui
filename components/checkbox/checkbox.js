import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import checkmarkIcon from '@jetbrains/icons/checkmark.svg';
import minusIcon from '@jetbrains/icons/remove-10px.svg';

import Icon from '../icon/icon';

import styles from './checkbox.css';

/**
 * @name Checkbox
 */
/**
 * Displays a checkbox.
 */
export default class Checkbox extends PureComponent {

  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    containerStyle: PropTypes.object,
    cellClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    indeterminate: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    children: PropTypes.node
  };

  componentDidMount() {
    if (this.input != null) {
      this.input.indeterminate = this.props.indeterminate;
    }
  }

  componentDidUpdate(prevProps) {
    const {indeterminate} = this.props;
    if (this.input != null && indeterminate !== prevProps.indeterminate) {
      this.input.indeterminate = this.props.indeterminate;
    }
  }

  inputRef = el => {
    if (el != null) {
      el.indeterminate = this.props.indeterminate;
    }
    this.input = el;
  };

  render() {
    const {
      children,
      label,
      className,
      containerClassName,
      containerStyle,
      cellClassName,
      labelClassName,
      indeterminate,
      ...restProps
    } = this.props;

    const classes = classNames(styles.input, className);
    const containerClasses = classNames(styles.checkbox, containerClassName);
    const cellClasses = classNames(styles.cell, cellClassName);
    const labelClasses = classNames(styles.label, labelClassName);

    return (
      <label
        className={containerClasses}
        style={containerStyle}
        data-test="ring-checkbox"
      >
        <input
          {...restProps}
          data-checked={restProps.checked}
          ref={this.inputRef}
          type="checkbox"
          className={classes}
        />
        <span className={cellClasses}>
          <Icon
            glyph={checkmarkIcon}
            className={styles.check}
          />
          <Icon
            glyph={minusIcon}
            className={styles.minus}
          />
        </span>
        <span className={labelClasses}>{label || children}</span>
      </label>
    );
  }
}
