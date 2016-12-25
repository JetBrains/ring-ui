import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import Icon from '../icon/icon';

import styles from './checkbox.css';

const ngModelStateField = 'checked';

/**
 * @name Checkbox
 * @category Components
 * @constructor
 * @extends {ReactComponent}
 * @example-file ./checkbox.examples.html
 */
export default class Checkbox extends RingComponent {
  static ngModelStateField = ngModelStateField;

  static propTypes = {
    name: PropTypes.string,

    /**
     * Add custom class for checkbox
     */
    className: PropTypes.string
  };

  ngModelStateField = ngModelStateField;

  render() {
    const {_onModelChange, children, ...restProps} = this.props; // eslint-disable-line no-unused-vars

    const classes = classNames(
      styles.input,
      this.props.className
    );

    return (
      <label
        className={styles.checkbox}
      >
        <input
          {...restProps}
          ref="input"
          type="checkbox"
          className={classes}
        />
        <span className={styles.cell}>
          <Icon
            className={styles.icon}
            glyph={require('jetbrains-icons/check.svg')}
            size={Icon.Size.Size18}
          />
        </span>
        <span className={styles.label}>{children}</span>
      </label>
    );
  }
}
