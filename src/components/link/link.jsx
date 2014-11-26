/** @jsx React.DOM */

var React = require('react');
require('./link.scss');

/**
 * @constructor
 * @extends {ReactComponent}
 <example>
 <div id="link">
 </div>

 <script>
 React.renderComponent(Link(), document.getElementById('link'));
 </script>
 </example>
 */
var Link = React.createClass({
  render: function() {
    /* jshint ignore:start */
    return this.transferPropsTo(<a className="ring-link">{this.props.children}</a>);
    /* jshint ignore:end */
  }
});

module.exports = Link;
