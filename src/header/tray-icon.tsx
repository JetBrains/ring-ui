import {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button, {ButtonAttrs} from '../button/button';
import {IconType} from '../icon/icon';

import styles from './header.css';

export interface TrayIconSpecificProps {
  icon: string | IconType
  rotatable?: boolean | null | undefined
}

export default class TrayIcon extends Component<ButtonAttrs & TrayIconSpecificProps> {
  static propTypes = {
    ...Button.propTypes,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]).isRequired,
    rotatable: PropTypes.bool
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
