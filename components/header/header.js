import React, {PropTypes, Children, Component} from 'react';
import classnames from 'classnames';

import Tray from './tray';

import styles from './header.css';

/**
 * @name Header
 * @category Components
 * @framework React
 * @constructor
 * @description Displays a configurable page header.
 * @example-file ./header.examples.html
 */

const wrapChild = child => (
  <div className={styles.item}>
    {child}
  </div>
);

export default class Header extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classnames(styles.header, className);

    return (
      <div
        {...restProps}
        className={classes}
      >
        {Children.map(children, child => (
          child.type === Tray ? child : wrapChild(child)
        ))}
      </div>
    );
  }
}

export {Tray};
export {default as TrayIcon} from './tray-icon';
export {default as Profile} from './profile';
