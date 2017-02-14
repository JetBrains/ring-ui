import React, {Component} from 'react';
import classnames from 'classnames';

import Icon, {Color, Size} from '../icon/icon';

import styles from './header.css';

export default class HeaderIcon extends Component {
  static propTypes = Icon.propTypes;

  static defaultProps = {
    activeEvent: 'onClick',
    color: Color.GRAY,
    size: Size.Size18
  };

  render() {
    const {className, ...restProps} = this.props;
    const classes = classnames(styles.icon, className);
    return (
      <Icon
        hoverColor={Icon.Color.ORANGE}
        {...restProps}
        className={classes}
      />
    );
  }
}
