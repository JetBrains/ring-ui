/**
 * @fileoverview Query Assist
 * @jsx React.DOM
 */

var React = require('react');
var $ = require('jquery');
var q = require('q');
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
    dataSource: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    onApply: React.PropTypes.func,
    onFocusChange: React.PropTypes.func,
    onClose: React.PropTypes.func
  },

  generateStateObject: function (props) {
    props = props || this.props;

    return {
      letters: props.query.split(''),
      query: props.query,
      caret: props.caret != null ? props.caret : props.query && props.query.length || 0,
      styleRanges: props.styleRanges
    };
  },

  getInitialState: function () {
    return this.generateStateObject();
  },

  componentWillReceiveProps: function (props) {
    this.setState(this.generateStateObject(props));
  },

  getQuery: function () {
    return $(this.refs.input.getDOMNode()).text();
  },

  handleFocusChange: function (e) {
    if (typeof this.props.onFocusChange === 'function') {
      // otherwise it's blur and false
      this.props.onFocusChange(e.type === 'focus');
    }
  },

  handleInput: function () {
    var props = {
      query: this.getQuery(),
      caret: $(this.refs.input.getDOMNode()).caret(),
      styleRanges: this.state.styleRanges
    };

    this.componentWillReceiveProps(props);
    q(this.props.dataSource(props)).then(this.handleResponse);
  },

  handleResponse: function (props) {
    if (props.query === this.state.query) {
      this.componentWillReceiveProps(props);
    }
  },

  getLetterClass: function (index) {
    var LETTER_CLASS = 'ring-query-assist__letter';

    return this.state.styleRanges &&
      this.state.styleRanges.
      filter(function (item) {
        return item.start <= index && item.start + item.length > index;
      }).
      map(function (item) {
        return LETTER_CLASS + '_' + item.style.replace('_', '-');
      }).
      concat(LETTER_CLASS).
      join(' ') ||
      LETTER_CLASS;
  },

  /* jshint ignore:start */
  renderLetter: function (letter, index) {
    var letterValue = letter === ' ' ? '\u00a0' : letter;
    // In spite of werining we don't need key here because of renderComponentToStaticMarkup
    return <span className={this.getLetterClass(index)}>{letterValue}</span>
  },
  /* jshint ignore:end */

  /** @override */
  render: function () {
    /* jshint ignore:start */
    var query = this.state.letters.length && React.renderComponentToStaticMarkup(
      <span>{this.state.letters.map(this.renderLetter)}</span>
    ) || '';

    return (
      <div className="ring-query-assist">
        <div className="ring-query-assist__input ring-input ring-js-shortcuts" ref="input"
        onInput={this.handleInput} onFocus={this.handleFocusChange} onBlur={this.handleFocusChange}
        spellCheck="false" contentEditable="true" dangerouslySetInnerHTML={{__html: query}}></div>
        {this.props.placeholder && <span className="ring-query-assist__placeholder">{this.props.placeholder}</span>}
      </div>
      );
    /* jshint ignore:end */
  },

  componentDidUpdate: function () {
    if (this.refs.input.getDOMNode().firstChild) {
      $(this.refs.input.getDOMNode()).caret(this.state.caret);
    }
  }
});

module.exports = QueryAssist;
