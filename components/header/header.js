import React, {PropTypes, Component} from 'react';
import classnames from 'classnames';

import styles from './header.css';

/**
 * @name Header
 * @category Components
 * @framework React
 * @constructor
 * @description Displays a configurable page header.
 * @example-file ./header.examples.html
 */

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
        {children}
      </div>
    );
  }
}

export {default as Logo} from './logo';
export {default as Tray} from './tray';
export {default as TrayIcon} from './tray-icon';
export {default as Profile} from './profile';
export {default as SmartProfile} from './smart-profile';
export {default as Services} from './services';
export {default as SmartServices} from './smart-services';
