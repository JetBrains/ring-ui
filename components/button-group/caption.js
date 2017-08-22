import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './button-group.css';

export default class Caption extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  }

  render() {
    const {className, children} = this.props;
    const classes = classNames(styles.caption, className);

    return (
      <span
        {...this.props}
        className={classes}
      >
        {children}
      </span>
    );
  }
}
