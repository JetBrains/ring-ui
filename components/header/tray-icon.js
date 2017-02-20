import React, {PropTypes, Component} from 'react';
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
    const {className, main, rotateable, ...restProps} = this.props;
    const classes = classnames(styles.icon, className, {
      [styles.main]: main,
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
