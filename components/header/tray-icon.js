import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '../button/button';

import styles from './header.css';

export default class TrayIcon extends Component {
  static propTypes = {
    ...Button.propTypes,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    rotatable: PropTypes.bool
  };

  static defaultProps = {
    ...Button.defaultProps,
    theme: Button.Theme.DARK
  };

  render() {
    const {className, rotatable: rotatable, ...restProps} = this.props;
    const classes = classNames(styles.icon, className, {
      [styles.rotatable]: rotatable,
      [styles.rotated]: rotatable && restProps.active
    });
    return (
      <Button
        {...restProps}
        className={classes}
      />
    );
  }
}
