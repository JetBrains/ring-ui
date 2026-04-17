import {Component, type HTMLAttributes} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import styles from './grid.css';

const classMap: Record<string, string> = {
  xs: 'col-xs',
  sm: 'col-sm',
  md: 'col-md',
  lg: 'col-lg',
  xsOffset: 'col-xs-offset',
  smOffset: 'col-sm-offset',
  mdOffset: 'col-md-offset',
  lgOffset: 'col-lg-offset',
};

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  'data-test'?: string | null | undefined;
  xs?: boolean | number | null | undefined;
  sm?: boolean | number | null | undefined;
  md?: boolean | number | null | undefined;
  lg?: boolean | number | null | undefined;
  xsOffset?: number | null | undefined;
  smOffset?: number | null | undefined;
  mdOffset?: number | null | undefined;
  lgOffset?: number | null | undefined;
  reverse?: boolean | null | undefined;
}

/**
 * Converts props like "xs=9 xsOffset={2}" to classes "col-xs-9 col-xs-offset-2"
 * @param {Object} props incoming props
 * @mockReturnValue {Array} result classnames
 */
function getClassNames(props: Omit<ColProps, 'children' | 'className' | 'reverse'>) {
  return Object.entries(props)
    .filter(([key, value]) => classMap[key] && value != null)
    .map(
      ([key, value]) =>
        (styles as Record<string, string | undefined>)[
          Number.isInteger(value) ? `${classMap[key]}-${value}` : classMap[key]
        ],
    );
}

export default class Col extends Component<ColProps> {
  render() {
    const {
      children,
      className,
      'data-test': dataTest,
      reverse,
      xs,
      sm,
      md,
      lg,
      xsOffset,
      smOffset,
      mdOffset,
      lgOffset,
      ...restProps
    } = this.props;
    const classes = classNames(
      styles.col,
      className,
      getClassNames({xs, sm, md, lg, xsOffset, smOffset, mdOffset, lgOffset}),
      {
        [styles.reverse]: reverse,
      },
    );

    return (
      <div {...restProps} className={classes} data-test={dataTests('ring-grid-column', dataTest)}>
        {children}
      </div>
    );
  }
}
