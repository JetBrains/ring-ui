import classNames from 'classnames';

import {type ListDataItemProps, Type} from './consts';

import globalStyles from '../global/global.css';
import styles from './list.css';

export function getListClasses<T = unknown>({
  className,
  disabled,
  hover,
  compact,
  scrolling,
  rgItemType,
}: Readonly<ListDataItemProps<T>>) {
  return classNames(styles.item, globalStyles.resetButton, className, {
    [styles.action]: !disabled,
    [styles.actionLink]: !disabled && rgItemType === Type.LINK,
    [styles.hover]: hover && !disabled,
    [styles.compact]: compact,
    [styles.scrolling]: scrolling,
    [styles.disabled]: disabled,
  });
}
