import {type ButtonHTMLAttributes} from 'react';

import {type IconProps, type IconType} from '../icon';
import {type ControlsHeight} from '../global/configuration';
import {type ClickableLinkProps} from '../link/clickable-link';

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
