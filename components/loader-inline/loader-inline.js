import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Theme from '../global/theme';
import dataTests from '../global/data-tests';

import styles from './loader-inline.css';
import injectStyles from './inject-styles';

/**
 * @name Loader Inline
 */

export default class LoaderInline extends PureComponent {
  static propTypes = {
    theme: PropTypes.oneOf(Object.values(Theme)),
    className: PropTypes.string,
    'data-test': PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    theme: Theme.LIGHT
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

    return children ? (
      <>
        {loader}
        <span className={styles.children}>{children}</span>
      </>
    ) : loader;
  }
}
