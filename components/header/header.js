import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import rerenderHOC from '../global/rerender-hoc';
import Theme from '../global/theme';

import styles from './header.css';

/**
 * @name Header
 */

export default class Header extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    spaced: PropTypes.bool,
    theme: PropTypes.string
  };

  static defaultProps = {
    spaced: true,
    theme: Theme.DARK
  };

  render() {
    const {children, className, spaced, theme, ...restProps} = this.props;
    const classes = classNames(styles.header, styles[theme], className, {
      [styles.headerSpaced]: spaced
    });

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

export const RerenderableHeader = rerenderHOC(Header);
export {default as Logo} from './logo';
export {default as Tray} from './tray';
export {default as TrayIcon} from './tray-icon';
export {default as Profile} from './profile';
export {default as SmartProfile} from './smart-profile';
export {default as Services} from './services';
export {default as SmartServices} from './smart-services';
