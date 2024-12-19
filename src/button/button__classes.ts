import classNames from 'classnames';

import {ButtonProps} from './button';

import styles from './button.css';

export function getButtonClasses({
  className,
  active,
  disabled,
  loader,
  primary,
  success,
  error,
  secondary,
  ghost,
  short,
  inline,
  danger,
  delayed,
  icon,
  height,
  children,
}: ButtonProps) {
  const iconOnly = icon && !children;
  const primaryBlock = primary && !inline;
  const withNormalIcon = iconOnly && inline && !active && !danger && !primary && !disabled;

  return classNames(styles.button, className, styles[`height${height}`], inline ? styles.inline : styles.block, {
    [styles.active]: active,
    [styles.danger]: danger,
    [styles.delayed]: delayed,
    [styles.withNormalIcon]: withNormalIcon,
    [styles.loader]: loader,
    [styles.primaryBlock]: primaryBlock,
    [styles.success]: success,
    [styles.error]: error,
    [styles.secondary]: secondary,
    [styles.ghost]: ghost,
    [styles.short]: short,
    [styles.disabled]: disabled,
    [styles.iconOnly]: iconOnly,
  });
}
