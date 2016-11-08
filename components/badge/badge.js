import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './badge.scss';

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
      'ring-badge',
      className, {
        'ring-badge_gray': gray,
        'ring-badge_valid': valid,
        'ring-badge_invalid': invalid,
        'ring-badge_disabled': disabled
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
