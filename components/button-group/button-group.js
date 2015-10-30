import React from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './button-group.scss';

/**
 * @name Button Group
 * @constructor
 * @description Combines several buttons into a group
 * @extends {ReactComponent}
 * @example
  <example name="Button Group">
    <file name="index.html">
      <div>
        <span id="button-group"></span>
      </div>
    </file>

    <file name="index.js" webpack="true">
      var render = require('react-dom').render;
      var Button = require('ring-ui/components/button/button');
      var ButtonGroup = require('ring-ui/components/button-group/button-group');

      render(ButtonGroup.factory(
        null,
        Button.factory(null, '1st button'),
        Button.factory(null, '2nd button'),
        Button.factory(null, '3rd button')
      ), document.getElementById('button-group'));
    </file>
  </example>
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
