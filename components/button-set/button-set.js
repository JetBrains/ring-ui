import React from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import styles from './button-set.css';

/**
 * @name Button Set
 * @category Forms
 * @constructor
 * @description Allows to group several buttons with constant margin.
 * @extends {ReactComponent}
 * @example-file ./button-set__examples.html
 */
export default class ButtonSet extends RingComponent {
  render() {
    const classes = classNames(styles.buttonSet, this.props.className);
    return (
      <div
        {...this.props}
        className={classes}
      >
        {this.props.children}
      </div>
    );
  }
}
