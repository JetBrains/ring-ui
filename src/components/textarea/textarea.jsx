/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
require('./textarea.scss');

var Textarea = React.createClass({
  render: function () {
    return this.transferPropsTo(
      <textarea
        className="ring-textarea"
      />
    );
  }
});

module.exports = Textarea;
