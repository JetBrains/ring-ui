import React, {Component} from 'react';
import {compose} from 'recompose';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import rerenderHOC from '../global/rerender-hoc';
import Theme, {withTheme} from '../global/theme';

import styles from './header.css';

/**
 * @name Header
 */

class Header extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    spaced: PropTypes.bool,
    theme: PropTypes.string
  };

  static defaultProps = {
    spaced: true
  };

  render() {
    const {children, className, spaced, theme, ...restProps} = this.props;
    const classes = classNames(styles.header, styles[theme], className, {
      [styles.headerSpaced]: spaced
    });

    return (
      <header
        {...restProps}
        className={classes}
      >
        {children}
      </header>
    );
  }
}

export default withTheme(Theme.DARK)(Header);
export const RerenderableHeader = compose(
  withTheme(Theme.DARK),
  rerenderHOC
)(Header);
export {default as Logo} from './logo';
export {default as Tray} from './tray';
export {default as TrayIcon} from './tray-icon';
export {default as Profile} from './profile';
export {default as SmartProfile} from './smart-profile';
export {default as Services} from './services';
export {default as SmartServices} from './smart-services';
