/** @jsx React.DOM */

var React = require('react');
require('./loader.scss');

/**
 * @constructor
 * @extends {ReactComponent}
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
  getDefaultProps: function () {
    return {
      modifier: ''
    };
  },
  render: function () {
    return this.transferPropsTo(React.DOM.div({
      className: 'ring-loader ' + this.props.modifier
    }));
  }
});

module.exports = Loader;
