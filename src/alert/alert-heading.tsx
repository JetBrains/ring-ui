import {type HTMLAttributes} from 'react';
import classNames from 'classnames';

import {Levels} from '../heading/heading';

import styles from './alert.css';

export interface AlertHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Heading level, so consumers can keep the document outline valid
   */
  level?: Levels | undefined;
}

export default function AlertHeading({level = Levels.H3, className, children, ...restProps}: AlertHeadingProps) {
  const Tag: 'h1' | 'h2' | 'h3' | 'h4' = `h${level}`;
  return (
    <Tag className={classNames(styles.heading, className)} {...restProps}>
      {children}
    </Tag>
  );
}
