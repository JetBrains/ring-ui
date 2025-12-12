import {type HTMLAttributes} from 'react';
import classNames from 'classnames';

import styles from './alert.css';

export interface AlertActions extends HTMLAttributes<HTMLDivElement> {}

export default function AlertActions({className, ...restProps}: AlertActions) {
  return <div className={classNames(styles.actions, className)} {...restProps} />;
}
