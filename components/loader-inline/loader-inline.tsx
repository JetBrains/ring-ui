import React, {HTMLAttributes, PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Theme, {ThemeProps, withTheme} from '../global/theme';
import dataTests from '../global/data-tests';

import styles from './loader-inline.css';
import injectStyles from './inject-styles';

export interface LoaderInlineProps extends ThemeProps, HTMLAttributes<HTMLDivElement> {
  'data-test'?: string | null | undefined
}

/**
 * @name Loader Inline
 */

class LoaderInline extends PureComponent<LoaderInlineProps> {
  static propTypes = {
    theme: PropTypes.oneOf(Object.values(Theme)),
    className: PropTypes.string,
    'data-test': PropTypes.string,
    children: PropTypes.node
  };

  componentDidMount() {
    injectStyles();
  }

  static Theme = Theme;

  render() {
    const {className, theme, 'data-test': dataTest, children, ...restProps} = this.props;

    const classes = classNames(
      styles.loader,
      className,
      `${styles.loader}_${theme}`
    );

    const loader = (
      <div
        {...restProps}
        data-test={dataTests('ring-loader-inline', dataTest)}
        className={classes}
      />
    );

    return children
      ? (
        <>
          {loader}
          <span className={styles.children}>{children}</span>
        </>
      )
      : loader;
  }
}

export default withTheme()(LoaderInline);
