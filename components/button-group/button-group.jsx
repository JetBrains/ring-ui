import React from 'react';
import classNames from 'classnames';
import RingComponent from 'ring-component/ring-component';
import factory from 'factory-decorator/factory-decorator';
import './button-group.scss';

/**
 * @name Button Group
 * @constructor
 * @description Joins buttons into one component
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
      var Button = require('button/button.jsx');
      var ButtonGroup = require('button-group/button-group.jsx');

      render(ButtonGroup.factory(
        null,
        Button.factory(null, '1st button'),
        Button.factory(null, '2nd button'),
        Button.factory(null, '3rd button')
      ), document.getElementById('button-group'));
    </file>
  </example>
 */
@factory
export default class ButtonGroup extends RingComponent {
  render() {
    let classes = classNames('ring-button-group', this.props.className);
    return (
      <div {...this.props} className={classes}>
        {this.props.children}
      </div>
    );
  }
}
