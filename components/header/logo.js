import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon, {Size} from '../icon/icon';

import styles from './header.css';

export default class Logo extends PureComponent {
  static Size = Size

  static propTypes = {
    className: PropTypes.string
  }

  static defaultProps = {
    size: Size.Size48
  }

  render() {
    const {className, ...restProps} = this.props;
    const classes = classNames(styles.logo, className);

    return (
      <div className={classes}>
        <Icon {...restProps}/>
      </div>
    );
  }
}
