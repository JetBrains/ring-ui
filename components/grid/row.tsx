import React, {Component, ReactNode} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './grid.css';

const ModifierType = PropTypes.oneOf(['xs', 'sm', 'md', 'lg']);
const modifierKeys = [
  'start', 'center', 'end', // text-align, justify-content
  'around', 'between', // justify-content
  'top', 'middle', 'baseline', 'bottom', // align-items
  'first', 'last' // order
] as const;

type ModifierType = 'xs' | 'sm' | 'md' | 'lg'

export interface RowProps {
  children?: ReactNode
  reverse?: boolean | null | undefined
  start?: ModifierType | null | undefined
  center?: ModifierType | null | undefined
  end?: ModifierType | null | undefined
  top?: ModifierType | null | undefined
  middle?: ModifierType | null | undefined
  baseline?: ModifierType | null | undefined
  bottom?: ModifierType | null | undefined
  around?: ModifierType | null | undefined
  between?: ModifierType | null | undefined
  first?: ModifierType | null | undefined
  last?: ModifierType | null | undefined
  className?: string | null | undefined
}

/**
 * Converts xs="middle" to class "middle-xs"
 * @param {Object} props incoming props
 * @returns {Array} result modifier classes
 */
function getModifierClassNames(props: RowProps) {
  return modifierKeys.reduce((result: string[], key) => {
    if (props[key]) {
      return result.concat(styles[`${key}-${props[key]}`]);
    }
    return result;
  }, []);
}

export default class Row extends Component<RowProps> {
  static propTypes = {
    reverse: PropTypes.bool,
    start: ModifierType,
    center: ModifierType,
    end: ModifierType,
    top: ModifierType,
    middle: ModifierType,
    baseline: ModifierType,
    bottom: ModifierType,
    around: ModifierType,
    between: ModifierType,
    first: ModifierType,
    last: ModifierType,
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, reverse, ...restProps} = this.props;

    const classes = classNames(className, styles.row, getModifierClassNames(restProps), {
      [styles.reverse]: reverse
    });

    return (
      <div className={classes}>
        {children}
      </div>
    );
  }
}
