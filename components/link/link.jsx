/** @jsx React.DOM */

var React = require('react');
require('./link.scss');

/**
 * @name Link
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Link">
     <file name="index.html">
       <div id="link"></div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var Link = require('link/link');

       React.renderComponent(Link({href: "#hash"}, 'Link text'), document.getElementById('link'));
     </file>
   </example>
 */
var Link = React.createClass({
  render: function() {
    return this.transferPropsTo(<a className="ring-link">{this.props.children}</a>);
  }
});

module.exports = Link;
