/**
 * @author igor.alexeenko
 * @fileoverview Dropdown component.
 * @jsx React.DOM
 */

var PopupMixin = require('./popup-mixin.jsx');
var React = require('react');

/**
 * @constructor
 * @mixes {PopupMixin}
 * @extends {ReactComponent}
 */
var Popup = React.createClass({
  mixins: [PopupMixin],

  /** @override */
  propTypes: {
    position: React.PropTypes.number,
    anchorElement: React.PropTypes.object,
    className: React.PropTypes.string
  },

  /** @override */
  getDefaultProps: function() {
    return {
      anchorElement: document.body
    }
  },

  /** @override */
  getInternalContent: function() {
    return this.props.children;
  }
});

module.exports = Popup;
