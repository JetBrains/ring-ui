import {type HTMLAttributes} from 'react';
import classNames from 'classnames';

import styles from './alert.module.css';

export interface AlertActionsProps extends HTMLAttributes<HTMLDivElement> {}

export default function AlertActions({className, ...restProps}: AlertActionsProps) {
  return <div className={classNames(styles.actions, className)} {...restProps} />;
}
