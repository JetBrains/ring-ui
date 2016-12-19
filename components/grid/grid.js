import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './grid.css';

/**
 * @name Grid
 * @category Components
 * @framework React
 * @constructor
 * @description Implements a flexbox-like grid system for components placement.
 * See http://roylee0704.github.io/react-flexbox-grid/ for more examples.
 * @example-file ./grid.examples.html
 */

class Grid extends Component {
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


export {Grid};
export {default as Row} from './row';
export {default as Col} from './col';
