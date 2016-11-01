import React, {PropTypes} from 'react';
import classNames from 'classnames';
import styles from './content-layout.css';

import RingComponent from '../ring-component/ring-component';

export default class ContentLayoutSidebar extends RingComponent {
  static propTypes = {
    right: PropTypes.bool,
    className: PropTypes.string
  };

  render() {
    const {right, children, className, ...restProps} = this.props;

    const classes = classNames(styles.sidebar, className, {
      [styles.sidebarRight]: right
    });

    return (
      <div
        {...restProps}
        className={classes}
      >
        {children}
      </div>
    );
  }
}
