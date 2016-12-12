import React, {PropTypes} from 'react';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';

import styles from './tabs.css';

export default class Tab extends RingComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string,
    className: PropTypes.string
  }

  render() {
    const {className, children} = this.props;
    const classes = classNames(styles.tab, className);
    return (
      <div className={classes}>{children}</div>
    );
  }
}
