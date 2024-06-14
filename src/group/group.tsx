import {Component, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './group.css';

/**
 * @name Group
 */

export default class Group extends Component<HTMLAttributes<HTMLSpanElement>> {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.group, className);

    return (
      <span
        {...restProps}
        className={classes}
      >
        {children}
      </span>
    );
  }
}
