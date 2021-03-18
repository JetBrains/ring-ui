import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './text.css';

/**
 * @name Text
 */

export default class Text extends Component {
  static propTypes = {
    children: PropTypes.node,
    info: PropTypes.bool,
    className: PropTypes.string
  };

  render() {
    const {children, className, info, ...restProps} = this.props;

    const classes = classNames(styles.text, className, {
      [styles.info]: info
    });

    return (
      <span className={classes} {...restProps}>{children}</span>
    );
  }
}
