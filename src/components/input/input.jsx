/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
require('./input.scss');

/**
 * @constructor
 * @extends {ReactComponent}
 */
var Input = React.createClass({
  render: function () {
    /* jshint ignore:start */
    return this.transferPropsTo(
      <input
        className="ring-input"
      />
    );
    /* jshint ignore:end */
  }
});

module.exports = Input;
