/** @jsx React.DOM */

var React = require('react');
require('./loader.scss');

/**
 * @name Loader
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Loader">
     <file name="index.html">
        <div id="loader">
        </div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var Loader = require('loader/loader');

      React.renderComponent(Loader(), document.getElementById('loader'));
     </file>
   </example>

   <example name="Loader Inline">
     <file name="index.html">
        <div id="loader-inline">
        </div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var Loader = require('loader/loader.jsx');

       React.renderComponent(Loader({
                modifier: Loader.Modifier.INLINE
              }), document.getElementById('loader-inline'));
     </file>
   </example>
 */
var Loader = React.createClass({
  statics: {
    /**
     * @enum {number}
     */
    Modifier: {

      /**
       * A small spinner suited for using inline with body text (12px)
       */
      INLINE: 'ring-loader_inline'
    }
  },
  getDefaultProps: function() {
    return {
      modifier: ''
    };
  },
  render: function() {
    return this.transferPropsTo(React.DOM.div({
      className: 'ring-loader ' + this.props.modifier
    }));
  }
});

module.exports = Loader;
