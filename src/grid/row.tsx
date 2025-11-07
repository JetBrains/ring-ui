import {type ReactNode} from 'react';
import classNames from 'classnames';

import {getModifierClassNames} from './row.utils';

import styles from './grid.css';

type ModifierType = 'xs' | 'sm' | 'md' | 'lg';

export interface RowProps {
  children?: ReactNode;
  reverse?: boolean | null | undefined;
  start?: ModifierType | null | undefined;
  center?: ModifierType | null | undefined;
  end?: ModifierType | null | undefined;
  top?: ModifierType | null | undefined;
  middle?: ModifierType | null | undefined;
  baseline?: ModifierType | null | undefined;
  bottom?: ModifierType | null | undefined;
  around?: ModifierType | null | undefined;
  between?: ModifierType | null | undefined;
  first?: ModifierType | null | undefined;
  last?: ModifierType | null | undefined;
  className?: string | null | undefined;
}

const Row = ({children, className, reverse, ...restProps}: RowProps) => {
  const classes = classNames(className, styles.row, getModifierClassNames(restProps), {
    [styles.reverse]: reverse,
  });

  return (
    <div className={classes} data-test='ring-grid-row'>
      {children}
    </div>
  );
};

export default Row;
