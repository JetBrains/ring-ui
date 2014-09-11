/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

/**
 * @constructor
 * @extends {ReactComponent}
 */
var ButtonGroup = React.createClass({
  render: function () {
    /*jshint ignore:start*/
    return this.transferPropsTo(
      <div className="ring-btn-group">
        {this.props.children}
      </div>
      );
    /*jshint ignore:end*/
  }
});

module.exports = ButtonGroup;
