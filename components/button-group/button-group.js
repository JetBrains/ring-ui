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
        <p>
          <span id="button-group"></span>
        </p>
        <p>
          <span id="button-group-primary"></span>
        </p>
        <p>
          <span id="button-group-blue"></span>
        </p>
        <p>
          <span id="button-group-with-caption"></span>
        </p>
      </div>
    </file>

    <file name="index.js" webpack="true">
      var React = require('react');
      var render = require('react-dom').render;
      var Button = require('ring-ui/components/button/button');
      var ButtonGroup = require('ring-ui/components/button-group/button-group');

      render(ButtonGroup.factory(
        null,
        Button.factory(null, '1st button'),
        Button.factory(null, '2nd button'),
        Button.factory(null, '3rd button')
      ), document.getElementById('button-group'));

      render(ButtonGroup.factory(
        null,
        Button.factory({ primary: true }, '1st button'),
        Button.factory({ primary: true }, '2nd button'),
        Button.factory({ primary: true }, '3rd button')
      ), document.getElementById('button-group-primary'));

      render(ButtonGroup.factory(
        null,
        Button.factory({ blue: true }, '1st button'),
        Button.factory({ blue: true }, '2nd button'),
        Button.factory({ blue: true }, '3rd button')
      ), document.getElementById('button-group-blue'));

      render(ButtonGroup.factory(
        null,
        <span className="ring-button-group__caption">Side:</span>,
        Button.factory(null, 'Left'),
        Button.factory(null, 'Right'),
      ), document.getElementById('button-group-with-caption'));
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
