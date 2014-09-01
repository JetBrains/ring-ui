/**
 * @fileoverview Query Assist
 * @jsx React.DOM
 */

var React = require('react');
//var Popup = require('popup/popup');
//var List = require('list/list');

require('./query-assist.scss');
require('../input/input.scss');

/**
 * @constructor
 * @mixes {PopupMixin}
 * @extends {ReactComponent}
 */
var QueryAssist = React.createClass({
  /** @override */
  propTypes: {
    className: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onApply: React.PropTypes.func,
    onFocusChange: React.PropTypes.func,
    onClose: React.PropTypes.func
  },

  /** @override */
  render: function () {
    /* jshint ignore:start */
    return (
      <div className="ring-query-assist">
        <div className="ring-query-assist__input ring-input ring-js-shortcuts" spellCheck="false" contentEditable="true">{this.props.query}</div>
        {this.props.placeholder && <span class="ring-query-assist__placeholder"></span>}
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = QueryAssist;
