import React, {Component, ComponentPropsWithRef, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Theme, {ThemeProps, withTheme} from '../global/theme';

import styles from './header.css';

interface HeaderProps extends HTMLAttributes<HTMLElement>, ThemeProps {
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
    theme: PropTypes.oneOf(['light', 'dark']),
    className: PropTypes.string,
    children: PropTypes.node,
    spaced: PropTypes.bool
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

const ThemedHeader = withTheme(Theme.DARK)(Header);
export type HeaderAttrs = ComponentPropsWithRef<typeof ThemedHeader>;
export default ThemedHeader;
export {default as Logo} from './logo';
export {default as Tray} from './tray';
export {default as TrayIcon} from './tray-icon';
export {default as Profile} from './profile';
export {default as SmartProfile} from './smart-profile';
export {default as Services} from './services';
export {default as SmartServices} from './smart-services';
