import {Component, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Theme, {ThemeProvider} from '../global/theme';

import styles from './header.css';

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  spaced: boolean
  theme: Theme
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
    spaced: true,
    theme: Theme.DARK
  };

  render() {
    const {children, className, spaced, theme, ...restProps} = this.props;
    const classes = classNames(styles.header, className, {
      [styles.headerSpaced]: spaced
    });

    const overrideOuterTheme = theme !== Theme.LIGHT;

    const header = (
      <header
        {...restProps}
        className={classes}
      >
        {children}
      </header>
    );

    if (overrideOuterTheme) {
      return (
        <ThemeProvider theme={theme}>
          {header}
        </ThemeProvider>
      );
    }

    return header;
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
