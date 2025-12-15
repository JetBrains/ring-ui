import {type HTMLAttributes} from 'react';
import classNames from 'classnames';

import styles from './alert.module.css';

export interface AlertHeadingProps extends HTMLAttributes<HTMLHeadingElement> {}

export default function AlertHeading({className, children, ...restProps}: AlertHeadingProps) {
  return (
    <h3 className={classNames(styles.heading, className)} {...restProps}>
      {children}
    </h3>
  );
}
