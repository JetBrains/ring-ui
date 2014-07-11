/** @jsx React.DOM */

var React = require('react');

/**
 * @constructor
 * @extends {ReactComponent}
 */
var Loader = React.createClass({
  render: function () {
    return this.transferPropsTo(
      <div className="ring-loader">
      </div>
    );
  }
});

module.exports = Loader;
