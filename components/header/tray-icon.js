import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from '../icon/icon';

import styles from './header.css';

export default class TrayIcon extends Component {
  static propTypes = {
    ...Icon.propTypes,
    active: PropTypes.bool,
    rotated: PropTypes.bool
  };

  static defaultProps = {
    ...Icon.defaultProps,
    active: false,
    rotated: false,
    size: Icon.Size.Size18
  };

  render() {
    const {className, active, rotated, ...restProps} = this.props;
    const classes = classNames(
      {[styles.rotatedIcon]: rotated},
      active ? styles.activeIcon : styles.icon,
      className
    );

    return (
      <Icon
        {...restProps}
        className={classes}
      />
    );
  }
}
