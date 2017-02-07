import React, {PropTypes, Children, Component, cloneElement} from 'react';
import classnames from 'classnames';

import styles from './header.css';

const wrapChild = child => (
  <div className={styles.trayItem}>
    {cloneElement(child, {
      className: classnames(child.props.className, styles.trayItemContent)
    })}
  </div>
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
