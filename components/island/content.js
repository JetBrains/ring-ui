import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import styles from './island.css';

export default class Content extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
    fade: PropTypes.bool
  };

  static defaultProps = {
    fade: false
  };

  render() {
    const {children, className, fade, ...restProps} = this.props;
    const classes = classNames(styles.contentWrapper, className);

    return (
      <div
        {...restProps}
        data-test="ring-island-content"
        className={classes}
      >
        <div className={styles.content}>
          {fade && <div className={styles.fadeTop} />}
          {children}
          {fade && <div className={styles.fadeBottom} />}
        </div>
      </div>
    );
  }
}
