require('./button-group.scss');
var React = require('react');
var classNames = require('classnames');

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

      React.render(
        React.createElement(
          ButtonGroup,
          null,
          React.createElement(Button, null, '1st button'),
          React.createElement(Button, null, '2nd button'),
          React.createElement(Button, null, '3rd button')
        ),
        document.getElementById('button-group')
      );
    </file>
  </example>
 */
var ButtonGroup = React.createClass({
  render: function () {
    var classes = classNames('ring-button-group', this.props.className);
    return (
      <div {...this.props} className={classes}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = ButtonGroup;
