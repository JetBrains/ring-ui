/**
 * @fileoverview Query Assist
 * @jsx React.DOM
 */

var React = require('react');
var $ = require('jquery');
var q = require('q');
require('jquery-caret');

var PopupMenu = require('popup-menu/popup-menu'); // jshint -W098

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

  generateState: function (props) {
    props = props || this.props;

    var state = {
      letters: props.query.split(''),
      query: props.query,
      caret: props.caret != null ? props.caret : props.query && props.query.length || 0,
      suggestions: props.suggestions || []
    };

    if (props.styleRanges) {
      state.styleRanges = props.styleRanges;
    }

    return state;
  },

  getInitialState: function () {
    return this.generateState();
  },

  componentDidMount: function () {
    this.sendRequest(this.generateState());
  },

  componentWillReceiveProps: function (props) {
    var state = this.generateState(props);

    this.setState(state);
    this.sendRequest(state);
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

    this.setState(this.generateState(props));
    this.sendRequest(props);
  },

  handleResponse: function (props) {
    if (props.query === this.state.query) {
      this.setState(this.generateState(props), this.renderPopup);
    }
  },

  handleSelect: function (data, replace) {
    var query = this.getQuery();

    if (!data) {
      if (typeof this.props.onApply === 'function') {
        this.props.onApply(query);
      }

      return;
    }

    var suggestion = data.data;
    var prefix = suggestion.prefix || '';
    var suffix = suggestion.suffix || '';

    var props = {
      caret: suggestion.caret,
      query: query.substr(0, suggestion.completionStart) + prefix + suggestion.option + suffix
    };

    if (replace) {
      props.query += query.substr(suggestion.completionEnd + suffix.length);
    } else {
      props.query += query.substr(this.state.caret);
    }

    this.setState(this.generateState(props));
    this.sendRequest(props);
  },

  sendRequest: function (props) {
    var params = {
      query: props.query,
      caret: props.caret
    };

    q(this.props.dataSource(params)).then(this.handleResponse);
  },

  getQuery: function () {
    return $(this.refs.input.getDOMNode()).text().replace(/\s/g, ' ');
  },

  getCaretOffset: function () {
    var input = this.refs.input.getDOMNode();
    var caretNode = input.firstChild && input.firstChild.childNodes[this.state.caret - 1];

    return caretNode && caretNode.offsetLeft;
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

  renderPopup: function () {
    /* jshint ignore:start */
    var visible = this.state.suggestions.length > 0;
    var suggestions = this.state.suggestions.map(function (suggestion) {
      var label = suggestion.prefix + suggestion.option + suggestion.suffix;

      return {
        key: label + suggestion.description,
        label: label,
        type: PopupMenu.Type.ITEM,
        data: suggestion
      };
    });


    if (!this._popup) {
      this._popup = PopupMenu.renderComponent(
        <PopupMenu autoRemove={false} visible={visible} anchorElement={this.getDOMNode()}
        corner={PopupMenu.Corner.BOTTOM_LEFT} data={suggestions} shortcuts={true}
        top={-1} left={this.getCaretOffset()} onSelect={this.handleSelect} />
      );
    } else {
      this._popup.setProps({
        left: this.getCaretOffset(),
        data: suggestions,
        visible: visible
      });
    }
    /* jshint ignore:end */
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
