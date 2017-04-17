import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';
import Icon from '../icon/icon';
import './button.scss';

/**
 * @name Button
 * @category Forms
 * @constructor
 * @description Provides styled buttons.
 * @extends {RingComponent}
 * @example-file ./button.examples.html
 */
export default class Button extends RingComponent {
  static propTypes = {
    active: PropTypes.bool,
    blue: PropTypes.bool,
    danger: PropTypes.bool,
    delayed: PropTypes.bool,
    loader: PropTypes.bool,
    primary: PropTypes.bool,
    short: PropTypes.bool,

    icon: PropTypes.string,
    iconSize: PropTypes.number,
    className: PropTypes.string
  }

  render() {
    const {
      // Modifiers
      active,
      blue,
      danger,
      delayed,
      loader,
      primary,
      short,

      // Props
      icon,
      iconSize,
      className,
      children,
      ...props
    } = this.props;

    const classes = classNames(
      'ring-button',
      className, {
        'ring-button_default': !blue && !primary,
        'ring-button_active': active,
        'ring-button_blue': blue,
        'ring-button_danger': danger,
        'ring-button_delayed': delayed,
        'ring-button_icon': icon,
        'ring-button_loader': loader,
        'ring-button_primary': primary,
        'ring-button_short': short
      }
    );

    return (
      <button
        type="button"
        {...props}
        className={classes}
        tabIndex={loader ? -1 : 0}
      >
        <span className="ring-button__content">
          {children}
          {icon && (
            <span className="ring-button__icon">
              <Icon
                glyph={icon}
                size={iconSize || 16}
              />
            </span>
          )}
        </span>

        <span className="ring-button__loader"/>
      </button>
    );
  }
}
