import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button, {IconSize} from '../button/button';

import styles from './header.css';

export default class TrayIcon extends Component {
  static propTypes = {
    ...Button.propTypes,
    icon: PropTypes.string.isRequired,
    rotateable: PropTypes.bool
  };

  static defaultProps = {
    ...Button.defaultProps,
    iconSize: IconSize.Size18,
    theme: Button.Theme.DARK
  };

  render() {
    const {className, rotateable, ...restProps} = this.props;
    const classes = classnames(styles.icon, className, {
      [styles.rotateable]: rotateable,
      [styles.rotated]: rotateable && restProps.active
    });
    return (
      <Button
        {...restProps}
        className={classes}
      />
    );
  }
}
