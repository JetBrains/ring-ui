import classNames from 'classnames';

import Theme from '../global/theme';

import styles from './button.css';

import {ButtonProps} from '@jetbrains/ring-ui/components/button/button';

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
  theme
}: ButtonProps) {
  const withNormalIcon = icon && !active && !danger && !primary && !disabled;

  return classNames(
    styles.button,
    className,
    styles[theme],
    {
      [styles.active]: active,
      [styles.danger]: danger,
      [styles.delayed]: delayed,
      [styles.withIcon]: icon,
      [styles.withNormalIconLight]: (
        withNormalIcon && theme === Theme.LIGHT
      ),
      [styles.withNormalIconDark]: (
        withNormalIcon && theme === Theme.DARK
      ),
      [styles.withDangerIconLight]: (
        icon && danger && theme === Theme.LIGHT
      ),
      [styles.withDangerIconDark]: (
        icon && danger && theme === Theme.DARK
      ),
      [styles.loader]: loader && !icon,
      [styles.primary]: primary,
      [styles.short]: short,
      [styles.text]: text,
      [styles.inline]: inline
    }
  );
}
