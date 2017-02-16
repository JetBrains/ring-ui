import React, {PropTypes} from 'react';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';

import styles from './tabs.css';

export default class Tab extends RingComponent {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    id: PropTypes.string,
    className: PropTypes.string
  }

  static renderTitle(title, isSelected) {
    return typeof title === 'function'
      ? title(isSelected)
      : title;
  }

  render() {
    const {className, children} = this.props;
    const classes = classNames(styles.tab, className);
    return (
      <div className={classes}>{children}</div>
    );
  }
}
