import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './badge.css';

/**
 * @name Badge
 * @category Components
 * @constructor
 * @description Displays a badge.
 * @extends {PureComponent}
 * @example-file ./badge.examples.html
 */
export default class Badge extends PureComponent {
  static propTypes = {
    gray: PropTypes.bool,
    valid: PropTypes.bool,
    invalid: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    'data-test': 'ring-badge'
  };

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
