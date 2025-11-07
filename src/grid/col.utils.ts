import {type ColProps} from './col';

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

/**
 * Converts props like "xs=9 xsOffset={2}" to classes "col-xs-9 col-xs-offset-2"
 * @param {Object} props incoming props
 * @mockReturnValue {Array} result classnames
 */
export function getClassNames(props: Omit<ColProps, 'children' | 'className' | 'reverse'>) {
  return Object.entries(props)
    .filter(([key]) => classMap[key])
    .map(([key, value]) => styles[Number.isInteger(value) ? `${classMap[key]}-${value}` : classMap[key]]);
}
