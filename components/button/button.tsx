import 'focus-visible';
import React, {createRef, PureComponent, ButtonHTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import chevronDown from '@jetbrains/icons/chevron-10px';

import Icon, {Size} from '../icon/icon';
import Theme, {ThemeProps, withTheme} from '../global/theme';
import ClickableLink, {ClickableLinkProps} from '../link/clickableLink';

import styles from './button.css';
import {getButtonClasses} from './button__classes';

export interface ButtonBaseProps extends ThemeProps {
  active?: boolean | null | undefined
  danger?: boolean | null | undefined
  delayed?: boolean | null | undefined
  loader?: boolean | null | undefined
  primary?: boolean | null | undefined
  short?: boolean | null | undefined
  text?: boolean | null | undefined
  inline?: boolean | null | undefined
  dropdown?: boolean | null | undefined
  disabled?: boolean | undefined
  icon?: string | Icon | null | undefined
  iconSize?: Size | null | undefined
  iconClassName?: string | null | undefined
  iconSuppressSizeWarning?: boolean | null | undefined
}

export interface ButtonButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonBaseProps {
  href?: undefined
}

export interface ButtonLinkProps extends ClickableLinkProps, ButtonBaseProps {
  href: string
}

export type ButtonProps = ButtonButtonProps | ButtonLinkProps

/**
 * @name Button
 */
/**
 * A component for displaying variously styled buttons.
 */
class Button extends PureComponent<ButtonProps> {
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

  buttonRef = createRef<HTMLButtonElement>();

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
    const commonProps = {
      tabIndex: loader ? -1 : 0,
      ...props,
      className: classes,
      children: <>
        {loader && !text && !icon && <div className={styles.loaderBackground}/>}
        {content}
      </>
    };

    return commonProps.href != null
      ? (
        <ClickableLink
          {...commonProps}
        />
      )
      : (
        <button
          ref={this.buttonRef}
          type="button"
          {...commonProps}
        />
      );
  }
}

export {Size as IconSize};

export default withTheme()(Button);
