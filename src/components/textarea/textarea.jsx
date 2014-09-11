/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
require('./textarea.scss');

/**
 * @constructor
 * @extends {ReactComponent}
 */
var Textarea = React.createClass({
  render: function () {
    /* jshint ignore:start */
    return this.transferPropsTo(
      <textarea
        className="ring-textarea"
      />
    );
    /* jshint ignore:end */
  }
});

module.exports = Textarea;
