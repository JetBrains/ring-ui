import chevronDownIcon from '@jetbrains/icons/chevron-down';
import {type ButtonHTMLAttributes} from 'react';
import classNames from 'classnames';

import {type ControlsHeight} from '../global/configuration';
import Button from '../button/button';

import styles from './chevron-button.css';

export default function ChevronButton({
  className,
  disabled,
  height,
  ...props
}: {
  disabled?: boolean | null | undefined;
  height?: ControlsHeight | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      title='Toggle options popup'
      className={classNames(styles.chevronButton, className)}
      iconClassName={styles.chevronIcon}
      icon={chevronDownIcon}
      disabled={disabled ?? false}
      height={height}
      {...props}
    />
  );
}
