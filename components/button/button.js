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

    const content = (
      <span className={styles.content}>
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
      </span>
    );
    const isLink = !!props.href;

    const Tag = isLink ? 'a' : 'button';
    return (
      <Tag
        tabIndex={loader ? -1 : 0}
        type={isLink ? null : 'button'}
        {...props}
        onMouseDown={this.onMouseDown}
        className={classes}
      >{content}
      </Tag>
    );
  }
}

export {Size as IconSize};
