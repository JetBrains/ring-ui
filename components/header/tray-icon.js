import React, {PropTypes, Component} from 'react';
import classnames from 'classnames';

import Icon, {Size} from '../icon/icon';

import styles from './header.css';

export default class TrayIcon extends Component {
  static propTypes = {
    ...Icon.propTypes,
    active: PropTypes.bool
  };

  static defaultProps = {
    ...Icon.defaultProps,
    active: false,
    size: Size.Size18
  };

  render() {
    const {className, active, ...restProps} = this.props;
    const classes = classnames(active ? styles.activeIcon : styles.icon, className);
    return (
      <Icon
        {...restProps}
        className={classes}
      />
    );
  }
}
