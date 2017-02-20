import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import Icon, {Size} from '../icon/icon';
import Theme from '../global/theme';

import styles from './button.css';

/**
 * @name Button
 * @category Components
 * @constructor
 * @description Provides styled buttons.
 * @extends {RingComponent}
 * @example-file ./button.examples.html
 */
export default class Button extends RingComponent {
  static IconSize = Size;
  static Theme = Theme;

  static propTypes = {
    theme: PropTypes.string,
    active: PropTypes.bool,
    danger: PropTypes.bool,
    delayed: PropTypes.bool,
    loader: PropTypes.bool,
    primary: PropTypes.bool,
    blue(props, propName) {
      if (propName in props) {
        return new Error(`"${propName}" prop is deprecated. Use "primary" instead`);
      }
      return undefined;
    },
    short: PropTypes.bool,

    icon: PropTypes.string,
    iconSize: PropTypes.number,
    className: PropTypes.string,
    onMouseDown: PropTypes.func
  }

  static defaultProps = {
    theme: Theme.LIGHT,
    iconSize: Size.Size16,
    onMouseDown() {}
  }

  onMouseDown = e => {
    e.preventDefault();
    this.props.onMouseDown(e);
  }

  render() {
    const {
      // Modifiers
      theme,
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
      onMouseDown, // eslint-disable-line no-unused-vars
      ...props
    } = this.props;

    const classes = classNames(
      styles.button,
      className,
      styles[theme],
      {
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
        type="button"
        {...props}
        onMouseDown={this.onMouseDown}
        className={classes}
        tabIndex={loader ? -1 : 0}
      >
        <span className={styles.content}>
          {icon && (
            <span className={styles.icon}>
              <Icon
                glyph={icon}
                size={iconSize}
              />
            </span>
          )}
          {children && (
            <span>{children}</span>
          )}
        </span>
      </button>
    );
  }
}
