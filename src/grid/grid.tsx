import {type HTMLAttributes} from 'react';
import classNames from 'classnames';

import styles from './grid.css';

/**
 * @name Grid
 */
export const Grid = ({children, className, ...restProps}: HTMLAttributes<HTMLDivElement>) => {
  const classes = classNames(styles['container-fluid'], className);

  return (
    <div data-test='ring-grid' {...restProps} className={classes}>
      {children}
    </div>
  );
};

export {default as Row} from './row';
export {default as Col} from './col';
