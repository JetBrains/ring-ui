import {Component, HTMLAttributes} from 'react';
import classNames from 'classnames';

import styles from './grid.css';

/**
 * @name Grid
 */

export class Grid extends Component<HTMLAttributes<HTMLDivElement>> {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles['container-fluid'], className);

    return (
      <div data-test="ring-grid" {...restProps} className={classes}>
        {children}
      </div>
    );
  }
}

export {default as Row} from './row';
export {default as Col} from './col';
