/**
 * @fileoverview Popup Menu.
 * @jsx React.DOM
 */

var React = require('react');
var Popup = require('popup/popup');
var List = require('list/list');

/**
 * @constructor
 * @mixes {Popup.Mixin}
 * @extends {ReactComponent}
 */
var PopupMenu = React.createClass({
  mixins: [Popup.Mixin, List.Mixin],

  /** @override */
  propTypes: {
    anchorElement: React.PropTypes.object,
    autoRemove: React.PropTypes.bool,
    className: React.PropTypes.string,
    data: React.PropTypes.arrayOf(React.PropTypes.object),
    onSelect: React.PropTypes.func,
    position: React.PropTypes.number,
    shortcuts: React.PropTypes.bool,
    visible: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {data: []};
  },

  /** @override */
  getInternalContent: function () {
    /* jshint ignore:start */
    return <List ref="List" data={this.props.data} onSelect={this.props.onSelect} shortcuts={this.props.shortcuts} />;
    /* jshint ignore:end */
  }
});

module.exports = PopupMenu;
