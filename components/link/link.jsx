var React = require('react');
var classNames = require('classnames');
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

       React.render(
         React.createElement(Link, {href: "#hash"}, 'Link text'), document.getElementById('link')
       );
     </file>
   </example>
 */
var Link = React.createClass({
  render: function() {
    var classes = classNames('ring-link', this.props.className);
    return <a {...this.props} className={classes}>{this.props.children}</a>;
  }
});

module.exports = Link;
