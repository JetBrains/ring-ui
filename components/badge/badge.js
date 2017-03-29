import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import style from './badge.css';

/**
 * @name Badge
 * @category Components
 * @constructor
 * @description Displays a badge.
 * @extends {RingComponent}
 * @example-file ./badge.examples.html
 */
export default class Badge extends RingComponent {
  static propTypes = {
    gray: PropTypes.bool,
    valid: PropTypes.bool,
    invalid: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string
  }

  render() {
    const {
      // Modifiers
      gray,
      valid,
      invalid,
      disabled,

      // Props
      className,
      children,
      ...props
    } = this.props;

    const classes = classNames(
      style.badge,
      className,
      {
        [style.gray]: gray,
        [style.valid]: valid,
        [style.invalid]: invalid,
        [style.disabled]: disabled
      }
    );

    return (
      <span
        {...props}
        className={classes}
      >
        {children}
      </span>
    );
  }
}
