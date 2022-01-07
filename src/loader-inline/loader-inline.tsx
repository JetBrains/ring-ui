import React, {HTMLAttributes, PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import dataTests from '../global/data-tests';

import styles from './loader-inline.css';

export interface LoaderInlineProps extends HTMLAttributes<HTMLDivElement> {
  'data-test'?: string | null | undefined
}

/**
 * @name Loader Inline
 */

class LoaderInline extends PureComponent<LoaderInlineProps> {
  static propTypes = {
    className: PropTypes.string,
    'data-test': PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {className, 'data-test': dataTest, children, ...restProps} = this.props;

    const classes = classNames(
      styles.loader,
      className,
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

export type LoaderInlineAtrrs =
  JSX.LibraryManagedAttributes<typeof LoaderInline, LoaderInlineProps>;
export default LoaderInline;
