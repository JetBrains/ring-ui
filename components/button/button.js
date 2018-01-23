import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon, {Size} from '../icon';
import Theme from '../global/theme';

import styles from './button.css';

/**
 * @name Button
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Provides styled buttons.
 * @extends {PureComponent}
 * @example-file ./button.examples.html
 */
export default class Button extends PureComponent {
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
    text: PropTypes.bool,

    href: PropTypes.string,

    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    iconSize: PropTypes.number,
    iconClassName: PropTypes.string,

    className: PropTypes.string,
    onMouseDown: PropTypes.func,

    children: PropTypes.node
  };

  static defaultProps = {
    theme: Theme.LIGHT,
    iconSize: Size.Size16,
    onMouseDown() {}
  };

  onMouseDown = e => {
    e.preventDefault();
    this.props.onMouseDown(e);
  };

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
      href,
      icon,
      iconSize,
      iconClassName,
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
        [styles.loader]: loader && !icon,
        [styles.primary]: primary || blue,
        [styles.short]: short,
        [styles.text]: text
      }
    );

    const content = (<span className={styles.content}>
      {icon && (
        <span className={classNames(styles.icon, iconClassName)}>
          <Icon
            glyph={icon}
            size={iconSize}
            loading={loader}
          />
        </span>
      )}
      {children && (
        <span>{children}</span>
      )}
    </span>);
    return (href
      ? (
        <a
          href={href}
          tabIndex={loader ? -1 : 0}
          {...props}
          onMouseDown={this.onMouseDown}
          className={classes}
        >{content}
        </a>
      )
      : (
        <button
          type="button"
          tabIndex={loader ? -1 : 0}
          {...props}
          onMouseDown={this.onMouseDown}
          className={classes}
        >{content}
        </button>
      )
    );
  }
}

export {Size as IconSize};
