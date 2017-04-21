import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './grid.css';

/**
 * @name Grid
 * @category Components
 * @tags 3.0
 * @framework React
 * @constructor
 * @description Implements a flexbox-like grid system for components placement.
 * Inspired by React-flexbox-grid component.
 * See http://roylee0704.github.io/react-flexbox-grid/ and http://flexboxgrid.com/ for additional information.
 * @example-file ./grid.examples.html
 */

export class Grid extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles['container-fluid'], className);

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

export {default as Row} from './row';
export {default as Col} from './col';
