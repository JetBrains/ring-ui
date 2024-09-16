import classNames from 'classnames';
import flattenChildren from 'react-keyed-flatten-children';
import {Fragment, ReactNode} from 'react';

import styles from './breadcrumbs.css';

export interface BreadcrumbsSeparatorAttrs {
  separatorClassName?: string | null | undefined
  children?: ReactNode
}

export default function Breadcrumbs({separatorClassName, children}: BreadcrumbsSeparatorAttrs) {
  return flattenChildren(children).map((child, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={index}>
      {index > 0 && <span className={classNames(styles.separator, separatorClassName)}>{'/'}</span>}
      {child}
    </Fragment>
  ));
}
