import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './grid.css';

const ModificatorType = PropTypes.oneOfType([PropTypes.number, PropTypes.bool]);

const classMap = {
  xs: 'col-xs',
  sm: 'col-sm',
  md: 'col-md',
  lg: 'col-lg',
  xsOffset: 'col-xs-offset',
  smOffset: 'col-sm-offset',
  mdOffset: 'col-md-offset',
  lgOffset: 'col-lg-offset'
};

/**
 * Converts props like "xs=9 xsOffset={2}" to classes "col-xs-9 col-xs-offset-2"
 * @param {Object} props incoming props
 * @returns {Array} result classnames
 */
function getClassNames(props) {
  return Object.keys(props).
    filter(key => classMap[key]).
    map(key => styles[Number.isInteger(props[key]) ? `${classMap[key]}-${props[key]}` : classMap[key]]);
}

export default class Col extends Component {
  static propTypes = {
    xs: ModificatorType,
    sm: ModificatorType,
    md: ModificatorType,
    lg: ModificatorType,
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
