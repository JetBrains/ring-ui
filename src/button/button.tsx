import {createRef, PureComponent, type ButtonHTMLAttributes} from 'react';
import * as React from 'react';
import classNames from 'classnames';
import chevronDown from '@jetbrains/icons/chevron-down';
import chevron12pxDown from '@jetbrains/icons/chevron-12px-down';
import deprecate from 'util-deprecate';

import Icon, {type IconProps, type IconType, Size} from '../icon/icon';
import ClickableLink, {type ClickableLinkProps} from '../link/clickable-link';
import {type ControlsHeight, ControlsHeightContext} from '../global/controls-height';
import styles from './button.css';
import {getButtonClasses} from './button.classes';

export interface ButtonBaseProps {
  height?: ControlsHeight | undefined;
  active?: boolean | null | undefined;
  danger?: boolean | null | undefined;
  delayed?: boolean | null | undefined;
  loader?: boolean | null | undefined;
  primary?: boolean | null | undefined;
  success?: boolean | null | undefined;
  error?: boolean | null | undefined;
  secondary?: boolean | null | undefined;
  ghost?: boolean | null | undefined;
  short?: boolean | null | undefined;
  /**
   * @deprecated Use inline instead
   */
  text?: boolean | null | undefined;
  inline?: boolean | null | undefined;
  dropdown?: boolean | null | undefined;
  disabled?: boolean | undefined;
  icon?: string | IconType | null | undefined;
  iconRight?: string | IconType | null | undefined;
  /**
   * @deprecated Use icons with appropriate intrinsic sizes instead
   */
  iconSize?: IconProps['size'];
  iconClassName?: string | null | undefined;
  iconRightClassName?: string | null | undefined;
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

function removeLinkProps(props: ButtonLinkProps) {
  const {
    download,
    href,
    hrefLang,
    media,
    ping,
    target,
    type,
    referrerPolicy,
    onConditionalClick,
    onPlainLeftClick,
    activeClassName,
    ...restProps
  } = props;
  return restProps;
}

/**
 * @name Button
 */
/**
 * A component for displaying variously styled buttons.
 */
export class Button extends PureComponent<ButtonProps> {
  /**
   * @deprecated Use icons with appropriate intrinsic sizes instead
   */
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
      success,
      error,
      secondary,
      ghost,
      short,
      text,
      dropdown,
      height,

      // Props
      icon,
      iconRight,
      iconSize,
      iconClassName,
      iconRightClassName,
      iconSuppressSizeWarning,
      className,
      children,
      inline,
      disabled,
      ...props
    } = this.props;
    const isInline = inline ?? text ?? !!icon;

    if (text) {
      warnText();
    }

    const classes = getButtonClasses({
      ...this.props,
      inline: isInline,
      height: height ?? (typeof this.context === 'function' ? this.context() : this.context),
    });

    const content = (
      <>
        {icon && (
          <Icon
            className={classNames(styles.icon, iconClassName)}
            glyph={icon}
            size={iconSize}
            suppressSizeWarning={iconSuppressSizeWarning}
          />
        )}
        {children}
        {iconRight && <Icon className={classNames(styles.iconRight, iconRightClassName)} glyph={iconRight} />}
        {dropdown && <Icon glyph={isInline ? chevron12pxDown : chevronDown} className={styles.dropdownIcon} />}
      </>
    );
    const isDisabled = disabled || loader || undefined;
    const commonProps = {
      ...(props.href !== undefined && isDisabled ? removeLinkProps(props as ButtonLinkProps) : props),
      className: classes,
      children: (
        <>
          {loader && !isInline && <div className={styles.loaderBackground} />}
          {content}
        </>
      ),
    };

    return 'href' in commonProps && commonProps.href !== undefined ? (
      <ClickableLink {...(commonProps as ClickableLinkProps)} />
    ) : (
      <button
        ref={this.buttonRef}
        type='button'
        disabled={isDisabled}
        {...(commonProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  }
}

export {Size as IconSize};

export type ContainerProps<T extends ButtonProps> = React.JSX.LibraryManagedAttributes<typeof Button, T>;

export type ButtonAttrs = ContainerProps<ButtonButtonProps> | ContainerProps<ButtonLinkProps>;

export default Button;
