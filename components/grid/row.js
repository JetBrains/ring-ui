import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './grid.css';

const ModifierType = PropTypes.oneOf(['xs', 'sm', 'md', 'lg']);
const modifierKeys = [
  'start', 'center', 'end', // text-align, justify-content
  'around', 'between', // justify-content
  'top', 'middle', 'baseline', 'bottom', // align-items
  'first', 'last' // order
];

/**
 * Converts xs="middle" to class "middle-xs"
 * @param {Object} props incoming props
 * @returns {Array} result modifier classes
 */
function getModifierClassNames(props) {
  return modifierKeys.reduce((result, key) => {
    if (props[key]) {
      return result.concat(styles[`${key}-${props[key]}`]);
    }
    return result;
  }, []);
}

export default class Row extends Component {
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
