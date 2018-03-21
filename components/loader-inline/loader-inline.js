import 'prefixfree';
import 'conic-gradient';
import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './loader-inline.css';

/**
 * @name Loader Inline
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Displays a small animated loader, shown inline with text. Use case: contextual loading animation.
 * @extends {ReactComponent}
 * @example-file ./loader-inline.examples.html
 */

export default class LoaderInline extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const classes = classNames(
      styles.loader,
      this.props.className
    );

    return (
      <div
        {...this.props}
        className={classes}
      />
    );
  }
}
