import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon, {IconAttrs, Size} from '../icon/icon';

import styles from './header.css';

export default class Logo extends PureComponent<IconAttrs> {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    size: Size.Size48,
    suppressSizeWarning: true
  };

  static Size = Size;

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
