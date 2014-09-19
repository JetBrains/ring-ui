/** @jsx React.DOM */

var React = require('react');
require('./loader.scss');

/**
 * @constructor
 * @extends {ReactComponent}
 <example>
    <div id="loader">
    </div>

    <script>
        React.renderComponent(Loader(), document.getElementById('loader'));
    </script>
 </example>

 <example>
   <div>
     <span id="loader-inline"></span>
   </div>

   <script>
     React.renderComponent(Loader({
              modifier: Loader.Modifier.INLINE
            }), document.getElementById('loader-inline'));
   </script>
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
