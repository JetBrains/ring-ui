import 'focus-visible';
import React, {createRef, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import chevronDown from '@jetbrains/icons/chevron-10px';

import Icon, {Size} from '../icon/icon';
import Theme, {withTheme} from '../global/theme';
import ClickableLink from '../link/clickableLink';

import styles from './button.css';
import {getButtonClasses} from './button__classes';

/**
 * @name Button
 */
/**
 * A component for displaying variously styled buttons.
 */
class Button extends PureComponent {
  static propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']),
    active: PropTypes.bool,
    danger: PropTypes.bool,
    delayed: PropTypes.bool,
    loader: PropTypes.bool,
    primary: PropTypes.bool,
    short: PropTypes.bool,
    text: PropTypes.bool,
    inline: PropTypes.bool,
    dropdown: PropTypes.bool,

    href: PropTypes.string,
    target: PropTypes.string,

    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
    iconSize: PropTypes.number,
    iconClassName: PropTypes.string,
    iconSuppressSizeWarning: PropTypes.bool,

    className: PropTypes.string,

    children: PropTypes.node,
    onClick: PropTypes.func
  };

  static IconSize = Size;
  static Theme = Theme;

  buttonRef = createRef();

  render() {
    const {
      // Modifiers
      theme,
      active,
      danger,
      delayed,
      loader,
      primary,
      short,
      text,
      inline,
      dropdown,

      // Props
      icon,
      iconSize,
      iconClassName,
      iconSuppressSizeWarning,
      className,
      children,
      ...props
    } = this.props;

    const classes = getButtonClasses({className, active, danger, delayed, icon, theme, loader,
      primary, short, text, inline});

    const content = (
      <span className={styles.content}>
        {icon && (
          <span className={classNames(styles.icon, iconClassName)}>
            <Icon
              glyph={icon}
              size={iconSize}
              loading={loader}
              suppressSizeWarning={iconSuppressSizeWarning}
            />
          </span>
        )}
        {children && (
          <span>{children}</span>
        )}
        {dropdown && (
          <Icon
            glyph={chevronDown}
            className={styles.dropdownIcon}
          />
        )}
      </span>
    );
    const isLink = !!props.href;

    const Tag = isLink ? ClickableLink : 'button';
    return (
      <Tag
        ref={this.buttonRef}
        tabIndex={loader ? -1 : 0}
        type={isLink ? null : 'button'}
        {...props}
        className={classes}
      >
        {loader && !text && !icon && <div className={styles.loaderBackground}/>}
        {content}
      </Tag>
    );
  }
}

export {Size as IconSize};

export default withTheme()(Button);
