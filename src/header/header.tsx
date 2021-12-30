import React, {Component, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './header.css';

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  spaced: boolean
}

/**
 * @name Header
 */
/**
 * Displays a configurable page header. See available presentation options in the knobs panel.
 */
class Header extends Component<HeaderProps> {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    spaced: PropTypes.bool
  };

  static defaultProps = {
    spaced: true
  };

  render() {
    const {children, className, spaced, ...restProps} = this.props;
    const classes = classNames(styles.header, className, {
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

export type HeaderAttrs = JSX.LibraryManagedAttributes<typeof Header, HeaderProps>;
export default Header;
export {default as Logo} from './logo';
export {default as Tray} from './tray';
export {default as TrayIcon} from './tray-icon';
export {default as Profile} from './profile';
export {default as SmartProfile} from './smart-profile';
export {default as Services} from './services';
export {default as SmartServices} from './smart-services';
