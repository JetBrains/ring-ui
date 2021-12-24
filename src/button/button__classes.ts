import classNames from 'classnames';

import {ButtonProps} from './button';

import styles from './button.css';


export function getButtonClasses({
  className,
  active,
  disabled,
  loader,
  primary,
  short,
  text,
  inline,
  danger,
  delayed,
  icon,
  height
}: ButtonProps) {
  const withNormalIcon = icon && !active && !danger && !primary && !disabled;

  return classNames(
    styles.button,
    className,
    styles[`height${height}`],
    {
      [styles.active]: active,
      [styles.danger]: danger,
      [styles.delayed]: delayed,
      [styles.withIcon]: icon,
      [styles.withNormalIcon]: withNormalIcon,
      [styles.withDangerIcon]: icon && danger,
      [styles.loader]: loader && !icon,
      [styles.primary]: primary,
      [styles.short]: short,
      [styles.text]: text,
      [styles.inline]: inline
    }
  );
}
