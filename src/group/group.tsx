import {Component, HTMLAttributes} from 'react';
import classNames from 'classnames';

import styles from './group.css';

/**
 * @name Group
 */

export default class Group extends Component<HTMLAttributes<HTMLSpanElement>> {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.group, className);

    return (
      <span data-test="ring-group" {...restProps} className={classes}>
        {children}
      </span>
    );
  }
}
