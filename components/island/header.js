import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import styles from './island.css';

export default class Header extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
    border: PropTypes.bool
  };

  render() {
    const {children, className, border, ...restProps} = this.props;
    const classes = classNames(styles.header, className, {
      [styles.withBottomBorder]: border
    });

    return (
      <div
        {...restProps}
        data-test="ring-island-header"
        className={classes}
      >
        <div className={styles.title}>
          {children}
        </div>
      </div>
    );
  }
}
