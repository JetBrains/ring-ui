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

  getDefaultProps: function () {
    return {data: []};
  },

  /** @override */
  getInternalContent: function () {
    /* jshint ignore:start */
    return <List ref="List"
      data={this.props.data}
      hint={this.props.hint}
      hintOnSelection={this.props.hintOnSelection}
      onSelect={this.props.onSelect}
      shortcuts={this.props.shortcuts} />;
    /* jshint ignore:end */
  }
});

module.exports = PopupMenu;
