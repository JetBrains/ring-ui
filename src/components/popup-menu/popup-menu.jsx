/**
 * @fileoverview Popup Menu.
 * @jsx React.DOM
 */

var React = require('react');
var Popup = require('popup/popup');
var List = require('list/list');

/**
 * @constructor
 * @mixes {PopupMixin}
 * @extends {ReactComponent}
 */
var PopupMenu = React.createClass({
  mixins: [Popup.Mixin],

  // TODO Find a better way
  statics: {
    Type: List.Type
  },

  /** @override */
  propTypes: {
    position: React.PropTypes.number,
    anchorElement: React.PropTypes.object,
    className: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {data: []};
  },

  /** @override */
  getInternalContent: function () {
    return new List({data: this.props.data}, null);
  }
});

module.exports = PopupMenu;
