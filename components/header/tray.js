import React, {Children, Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './header.css';

const wrapChild = child => child && (
  <div className={styles.trayItem}>{child}</div>
);

export default class Tray extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classnames(styles.tray, className);

    return (
      <div
        {...restProps}
        className={classes}
      >
        {Children.map(children, wrapChild)}
      </div>
    );
  }
}
