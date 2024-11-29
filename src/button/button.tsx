import {createRef, PureComponent, ButtonHTMLAttributes} from 'react';
import * as React from 'react';
import classNames from 'classnames';
import chevronDown from '@jetbrains/icons/chevron-down';
import chevron12pxDown from '@jetbrains/icons/chevron-12px-down';

import deprecate from 'util-deprecate';

import Icon, {IconProps, IconType, Size} from '../icon/icon';
import ClickableLink, {ClickableLinkProps} from '../link/clickableLink';

import {ControlsHeight, ControlsHeightContext} from '../global/controls-height';

import styles from './button.css';
import {getButtonClasses} from './button__classes';

export interface ButtonBaseProps {
  height?: ControlsHeight | undefined;
  active?: boolean | null | undefined;
  danger?: boolean | null | undefined;
  delayed?: boolean | null | undefined;
  loader?: boolean | null | undefined;
  primary?: boolean | null | undefined;
  short?: boolean | null | undefined;
  /**
   * @deprecated Use inline instead
   */
  text?: boolean | null | undefined;
  inline?: boolean | null | undefined;
  dropdown?: boolean | null | undefined;
  disabled?: boolean | undefined;
  icon?: string | IconType | null | undefined;
  iconSize?: IconProps['size'];
  iconClassName?: string | null | undefined;
  iconSuppressSizeWarning?: boolean | null | undefined;
}

export interface ButtonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonBaseProps {
  href?: undefined;
}

export interface ButtonLinkProps extends ClickableLinkProps, ButtonBaseProps {
  autoFocus?: never;
  href: string;
}

export type ButtonProps = ButtonButtonProps | ButtonLinkProps;

const warnText = deprecate(
  () => {},
  'Button: "text" prop is deprecated and will be removed in 8.0. Use inline instead.',
);

/**
 * @name Button
 */
/**
 * A component for displaying variously styled buttons.
 */
export class Button extends PureComponent<ButtonProps> {
  static IconSize = Size;
  static contextType = ControlsHeightContext;
  declare context: React.ContextType<typeof ControlsHeightContext>;

  buttonRef = createRef<HTMLButtonElement>();

  render() {
    const {
      // Modifiers
      active,
      danger,
      delayed,
      loader,
      primary,
      short,
      text,
      dropdown,
      height,

      // Props
      icon,
      iconSize,
      iconClassName,
      iconSuppressSizeWarning,
      className,
      children,
      inline,
      ...props
    } = this.props;
    const isInline = inline ?? text ?? icon != null;

    if (text != null) {
      warnText();
    }

    const classes = getButtonClasses({
      ...this.props,
      inline: isInline,
      height: height ?? this.context,
    });

    const content = (
      <>
        {icon && (
          <Icon
            className={classNames(styles.icon, iconClassName)}
            glyph={icon}
            size={iconSize}
            loading={loader && isInline}
            suppressSizeWarning={iconSuppressSizeWarning}
          />
        )}
        {children}
        {dropdown && <Icon glyph={isInline ? chevron12pxDown : chevronDown} className={styles.dropdownIcon} />}
      </>
    );
    const commonProps = {
      tabIndex: loader ? -1 : 0,
      ...props,
      className: classes,
      children: (
        <>
          {loader && !isInline && <div className={styles.loaderBackground} />}
          {content}
        </>
      ),
    };

    return commonProps.href != null ? (
      <ClickableLink {...commonProps} />
    ) : (
      <button ref={this.buttonRef} type="button" {...commonProps} />
    );
  }
}

export {Size as IconSize};

export type ContainerProps<T extends ButtonProps> = JSX.LibraryManagedAttributes<typeof Button, T>;

export type ButtonAttrs = ContainerProps<ButtonButtonProps> | ContainerProps<ButtonLinkProps>;

export default Button;
