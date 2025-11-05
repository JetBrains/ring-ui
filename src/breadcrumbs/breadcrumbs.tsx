import classNames from 'classnames';
import {Children, Fragment, type ReactNode} from 'react';

import styles from './breadcrumbs.css';

export interface BreadcrumbsProps {
  separatorClassName?: string | null | undefined;
  children?: ReactNode;
}

const Breadcrumbs = ({separatorClassName, children}: BreadcrumbsProps) =>
  Children.toArray(children).map((child, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={index}>
      {index > 0 && <span className={classNames(styles.separator, separatorClassName)}>{'/'}</span>}
      {child}
    </Fragment>
  ));

export default Breadcrumbs;
