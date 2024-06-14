import {Component, ReactNode} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './grid.css';

const ModifierType = PropTypes.oneOfType([PropTypes.number, PropTypes.bool]);

const classMap: Record<string, string> = {
  xs: 'col-xs',
  sm: 'col-sm',
  md: 'col-md',
  lg: 'col-lg',
  xsOffset: 'col-xs-offset',
  smOffset: 'col-sm-offset',
  mdOffset: 'col-md-offset',
  lgOffset: 'col-lg-offset'
};

export interface ColProps {
  children?: ReactNode
  xs?: boolean | number | null | undefined
  sm?: boolean | number | null | undefined
  md?: boolean | number | null | undefined
  lg?: boolean | number | null | undefined
  xsOffset?: number | null | undefined
  smOffset?: number | null | undefined
  mdOffset?: number | null | undefined
  lgOffset?: number | null | undefined
  reverse?: boolean | null | undefined
  className?: string | null | undefined
}

/**
 * Converts props like "xs=9 xsOffset={2}" to classes "col-xs-9 col-xs-offset-2"
 * @param {Object} props incoming props
 * @returns {Array} result classnames
 */
function getClassNames(props: Omit<ColProps, 'children' | 'className' | 'reverse'>) {
  return Object.entries(props).
    filter(([key]) => classMap[key]).
    map(([key, value]) => styles[Number.isInteger(value) ? `${classMap[key]}-${value}` : classMap[key]]);
}

export default class Col extends Component<ColProps> {
  static propTypes = {
    xs: ModifierType,
    sm: ModifierType,
    md: ModifierType,
    lg: ModifierType,
    xsOffset: PropTypes.number,
    smOffset: PropTypes.number,
    mdOffset: PropTypes.number,
    lgOffset: PropTypes.number,
    reverse: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, reverse, ...restProps} = this.props;
    const classes = classNames(styles.col, className, getClassNames(restProps), {
      [styles.reverse]: reverse
    });

    return (
      <div className={classes}>
        {children}
      </div>
    );
  }
}
