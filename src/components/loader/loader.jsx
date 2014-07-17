/** @jsx React.DOM */

var React = require('react');

/**
 * @constructor
 * @extends {ReactComponent}
 */
var Loader = React.createClass({
  render: function () {
    /* jshint ignore:start */
    return this.transferPropsTo(
      <div className="ring-loader">
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = Loader;
