import React from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './button-group.scss';

/**
 * @name Button Group
 * @constructor
 * @description Combines several buttons into a group
 * @extends {ReactComponent}
 * @example-file ./button-group__examples.html
 */
export default class ButtonGroup extends RingComponent {
  render() {
    const classes = classNames('ring-button-group', this.props.className);
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
