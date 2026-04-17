import {Component, type HTMLAttributes} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import styles from './grid.css';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  'data-test'?: string | null | undefined;
}

/**
 * @name Grid
 * @deprecated Will be removed in Ring UI 8.0. Use flexbox or another layout library instead.
 */

export class Grid extends Component<GridProps> {
  render() {
    const {children, className, 'data-test': dataTest, ...restProps} = this.props;
    const classes = classNames(styles['container-fluid'], className);

    return (
      <div data-test={dataTests('ring-grid', dataTest)} {...restProps} className={classes}>
        {children}
      </div>
    );
  }
}

export {default as Row} from './row';
export {default as Col} from './col';
