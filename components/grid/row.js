import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import stules from './grid.css';

const ModificatorType = PropTypes.oneOf(['xs', 'sm', 'md', 'lg']);
const modificatorKeys = ['start', 'center', 'end', 'top', 'middle', 'bottom', 'around', 'between', 'first', 'last'];

/**
 * Converts xs="middle" to class "middle-xs"
 * @param {Object} props incoming props
 * @returns {Array} result modificator classes
 */
function getModificatorsClassNames(props) {
  return modificatorKeys.reduce((result, key) => {
    if (props[key]) {
      return result.concat(stules[`${key}-${props[key]}`]);
    }
    return result;
  }, []);
}

export default class Row extends Component {
  static propTypes = {
    reverse: PropTypes.bool,
    start: ModificatorType,
    center: ModificatorType,
    end: ModificatorType,
    top: ModificatorType,
    middle: ModificatorType,
    bottom: ModificatorType,
    around: ModificatorType,
    between: ModificatorType,
    first: ModificatorType,
    last: ModificatorType,
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, reverse, ...restProps} = this.props;

    const classes = classNames(className, stules.row, getModificatorsClassNames(restProps), {
      [stules.reverse]: reverse
    });

    return (
      <div className={classes}>
        {children}
      </div>
    );
  }
}
