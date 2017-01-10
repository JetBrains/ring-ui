import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import styles from './island.css';

export default class Content extends RingComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.content, className);

    return (
      <div
        {...restProps}
        data-test="ring-island-content"
        className={classes}
      >
        {children}
      </div>
    );
  }
}
