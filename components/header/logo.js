import React, {PropTypes, PureComponent} from 'react';
import classNames from 'classnames';
import Icon, {Size} from '../icon/icon';

import styles from './header.css';

export default class Logo extends PureComponent {
  static Size = Size

  static propTypes = {
    href: PropTypes.string,
    glyph: PropTypes.string.isRequired,
    size: PropTypes.number,
    className: PropTypes.string
  }

  static defaultProps = {
    size: Size.Size48
  }

  render() {
    const {glyph, size, className, ...restProps} = this.props;
    const classes = classNames(styles.logo, className);

    return (
      <a
        {...restProps}
        className={classes}
      >
        <Icon {...{glyph, size}} />
      </a>
    );
  }
}
