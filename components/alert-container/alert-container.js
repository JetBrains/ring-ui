import React, {cloneElement, Children} from 'react';
import classNames from 'classnames';
import Portal from 'react-portal';

import RingComponent from '../ring-component/ring-component';
import Alert from '../alert/alert';

import styles from './alert-container.css';

/**
 * @name Alert Container
 * @constructor
 * @category Components
 * @description Displays a stack of alerts on top of the page.
 * @extends {RingComponent}
 * @example-file ./alert-container.examples.html
 */

export default class Alerts extends RingComponent {
  static Type = Alert.Type;

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.alertContainer, className);
    const show = Children.count(children) > 0;

    return (
      <Portal
        isOpened={show}
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
