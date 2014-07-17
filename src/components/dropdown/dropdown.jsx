/**
 * @author igor.alexeenko
 * @fileoverview Dropdown component.
 * @jsx React.DOM
 */

var DropdownMixin = require('./dropdown-mixin.jsx');
var React = require('react');

/**
 * @constructor
 * @mixes {DropdownMixin}
 * @extends {ReactComponent}
 */
var Dropdown = React.createClass({
  mixins: [DropdownMixin],

  /** @override */
  propTypes: {
    position: React.PropTypes.number,
    anchorElement: React.PropTypes.object,
    className: React.PropTypes.string
  },

  /** @override */
  getDefaultProps: function() {
    return {
      anchorElement: document.body,
      position: DropdownMixin.Angle.TOP_LEFT
    }
  },

  /** @override */
  getInternalContent: function() {
    return this.props.children;
  }
});

module.exports = Dropdown;
module.exports.Angle = DropdownMixin.angle;
module.exports.getPopupLayer = DropdownMixin.getPopupLayer;
