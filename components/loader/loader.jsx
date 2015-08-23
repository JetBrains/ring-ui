require('babel/polyfill');
var React = require('react');
var classNames = require('classnames');

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

      React.render(
        React.createElement(Loader),
        document.getElementById('loader')
      );
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

       React.render(React.createElement(Loader, {
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
    var classes = classNames(
      'ring-loader',
      this.props.modifier,
      this.props.className
    );

    return React.DOM.div(Object.assign({}, this.props, {
      className: classes
    }));
  }
});

module.exports = Loader;
