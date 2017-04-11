import React, {Children, cloneElement} from 'react';
import classNames from 'classnames';
import Portal from '@hypnosphi/react-portal';

import RingComponent from '../ring-component/ring-component';

import styles from './container.css';

/**
 * @name Alert Container
 * @constructor
 * @category Components
 * @description Displays a stack of alerts on top of the page.
 * @extends {RingComponent}
 */

export default class Alerts extends RingComponent {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.alertContainer, className);
    const show = Children.count(children) > 0;

    return (
      <Portal
        isOpen={show}
      >
        <div
          data-test="alert-container"
          className={classes}
          {...restProps}
        >
          {Children.map(children, child => {
            const alertClassNames = classNames(styles.alertInContainer, child.props.className);

            return cloneElement(child, {
              className: alertClassNames
            });
          })}
        </div>
      </Portal>
    );
  }
}
