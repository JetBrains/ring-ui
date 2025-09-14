import {Component} from 'react';
import classNames from 'classnames';

import Button, {type ButtonAttrs} from '../button/button';
import {type IconType} from '../icon';
import styles from './header.css';

export interface HeaderIconSpecificProps {
  icon: string | IconType;
  rotatable?: boolean | null | undefined;
}

export default class HeaderIcon extends Component<ButtonAttrs & HeaderIconSpecificProps> {
  render() {
    const {className, rotatable: rotatable, ...restProps} = this.props;
    const classes = classNames(styles.icon, className, {
      [styles.rotatable]: rotatable,
      [styles.rotated]: rotatable && restProps.active,
    });
    return <Button {...restProps} className={classes} />;
  }
}
