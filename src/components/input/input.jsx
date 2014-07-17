/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
require('./input.scss');

var Input = React.createClass({
  render: function () {
    return this.transferPropsTo(
      <input
        className="ring-input"
      />
    );
  }
});

module.exports = Input;
