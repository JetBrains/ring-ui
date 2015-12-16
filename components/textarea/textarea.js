import React from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './textarea.scss';

/**
 * @name Textarea
 * @constructor
 * @extends {ReactComponent}
 * @example

 */
export default class Textarea extends RingComponent {
  render() {
    const classes = classNames('ring-textarea', this.props.className);
    return (
      <textarea
        {...this.props}
        className={classes}
      />
    );
  }
}
