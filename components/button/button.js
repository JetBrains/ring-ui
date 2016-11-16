import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import Icon from '../icon/icon';

import styles from './button.css';

/**
 * @name Button
 * @category UI Language
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
      text,

      // Props
      icon,
      iconSize,
      className,
      children,
      ...props
    } = this.props;

    const classes = classNames(
      styles.button,
      className, {
        [styles.active]: active,
        [styles.danger]: danger,
        [styles.delayed]: delayed,
        [styles.withIcon]: icon,
        [styles.loader]: loader,
        [styles.primary]: primary || blue,
        [styles.short]: short,
        [styles.text]: text
      }
    );

    return (
      <button
        {...props}
        className={classes}
        tabIndex={loader ? -1 : 0}
      >
        <span className={styles.content}>
          {icon && (
            <span className={styles.icon}>
              <Icon
                glyph={icon}
                size={iconSize || 16}
              />
            </span>
          )}
          {children}
        </span>
      </button>
    );
  }
}
