/**
 * @jsx React.DOM
 */

require('./button-group.scss');
var React = require('react');

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
      var React = require('react');
      var Button = require('button/button.jsx');
      var ButtonGroup = require('button-group/button-group.jsx');

      React.renderComponent(ButtonGroup(null,
              Button(null, '1st button'),
              Button(null, '2nd button'),
              Button(null, '3rd button')), document.getElementById('button-group'));
    </file>
  </example>
 */
var ButtonGroup = React.createClass({
  render: function () {
    return this.transferPropsTo(
      <div className="ring-button-group">
        {this.props.children}
      </div>
      );
  }
});

module.exports = ButtonGroup;
