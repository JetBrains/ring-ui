import {type ReactNode} from 'react';
import classNames from 'classnames';

import {getClassNames} from './col.utils';

import styles from './grid.css';

export interface ColProps {
  children?: ReactNode;
  xs?: boolean | number | null | undefined;
  sm?: boolean | number | null | undefined;
  md?: boolean | number | null | undefined;
  lg?: boolean | number | null | undefined;
  xsOffset?: number | null | undefined;
  smOffset?: number | null | undefined;
  mdOffset?: number | null | undefined;
  lgOffset?: number | null | undefined;
  reverse?: boolean | null | undefined;
  className?: string | null | undefined;
}

const Col = ({children, className, reverse, ...restProps}: ColProps) => {
  const classes = classNames(styles.col, className, getClassNames(restProps), {
    [styles.reverse]: reverse,
  });

  return (
    <div className={classes} data-test='ring-grid-column'>
      {children}
    </div>
  );
};

export default Col;
