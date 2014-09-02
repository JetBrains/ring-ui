/**
 * @fileoverview Query Assist
 * @jsx React.DOM
 */

var React = require('react');
var $ = require('jquery');
require('jquery-caret');
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
    dataSource: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    onApply: React.PropTypes.func,
    onFocusChange: React.PropTypes.func,
    onClose: React.PropTypes.func
  },

  generateStateObject: function(props) {
    props = props || this.props;

    return {
      letters: props.query.split(''),
      query: props.query,
      caret: props.caret != null ? props.caret : props.query && props.query.length || 0
    };
  },

  getInitialState: function() {
    return this.generateStateObject();
  },

  componentWillReceiveProps: function() {
    this.setState(this.generateStateObject());
  },

  getQuery: function() {
    return $(this.refs.input.getDOMNode()).text();
  },

  handleInput: function() {
    var query = this.getQuery();
    var caret = $(this.refs.input.getDOMNode()).caret();

    if (query.length > this.state.query.length) {
      caret += 1;
    }

    this.setState(this.generateStateObject({
      query: query,
      caret: caret
    }));
  },

  /** @override */
  render: function () {
    /* jshint ignore:start */
    var query = this.state.letters.length && React.renderComponentToStaticMarkup(
      <span>{this.state.letters.map(function(letter) {
       // In spite of werining we don't need key here because of renderComponentToStaticMarkup
       return <span className="ring-query-assist__letter ring-query-assist__letter_field-name">{letter}</span>
      })}</span>
    ) || '';

    return (
      <div className="ring-query-assist">
        <div className="ring-query-assist__input ring-input ring-js-shortcuts" ref="input" onInput={this.handleInput} spellCheck="false" contentEditable="true" dangerouslySetInnerHTML={{__html: query}}></div>
        {this.props.placeholder && <span className="ring-query-assist__placeholder">{this.props.placeholder}</span>}
      </div>
    );
    /* jshint ignore:end */
  },

  componentDidUpdate: function() {
    if (this.refs.input.getDOMNode().firstChild) {
      $(this.refs.input.getDOMNode()).caret(this.state.caret);
    }
  }
});

module.exports = QueryAssist;
