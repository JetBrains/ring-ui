import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import deprecate from 'util-deprecate';

import styles from './text.css';

/**
 * @name Text
 */

const deprecateComment = deprecate(
  () => {},
  '<Text comment> is deprecated, use <Text info> instead'
);


export default class Text extends Component {
  static propTypes = {
    children: PropTypes.node,
    comment: PropTypes.bool,
    info: PropTypes.bool,
    className: PropTypes.string
  };

  render() {
    const {children, className, comment, info, ...restProps} = this.props;
    if (comment) {
      deprecateComment();
    }
    const classes = classNames(styles.text, className, {
      [styles.info]: info || comment
    });

    return (
      <span className={classes} {...restProps}>{children}</span>
    );
  }
}
