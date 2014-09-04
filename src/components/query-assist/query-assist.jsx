/**
 * @fileoverview Query Assist
 * @jsx React.DOM
 */

var React = require('react');
var $ = require('jquery');
var q = require('q');
require('jquery-caret');

var PopupMenu = require('popup-menu/popup-menu'); // jshint -W098
var Shortcuts = require('shortcuts/shortcuts');
var Global = require('global/global');

var generateUniqueId = Global.getUIDGenerator('ring-query-assist-');

require('./query-assist.scss');
require('../input/input.scss');

/**
 * @constructor
 * @mixes {PopupMixin}
 * @extends {ReactComponent}
 */
var QueryAssist = React.createClass({
  mixins: [Shortcuts.Mixin],

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

  getDefaultProps: function () {
    return {shortcuts: true};
  },

  getShortcutsProps: function () {
    return {
      map: {
        'ctrl+space': this.forcePopup
      },
      scope: generateUniqueId()
    };
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
      caret: this.getCaret()
    };

    this.setState(this.generateState(props));
    this.sendRequest(props);
  },

  // It's necessary to prevent new element creation before any other hooks
  handleEnter: function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  },

  handleCaretMove: function () {
    var props;

    if (this.getCaret() !== this.state.caret) {
      props = {caret: this.getCaret()};
      this.setState(props);

      props.query = this.getQuery();
      this.sendRequest(props);
    }
  },

  handleResponse: function (props) {
    var caret = this.getCaret();

    if (props.query === this.state.query && !caret || props.caret === caret) {
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

  getCaret: function () {
    return $(this.refs.input.getDOMNode()).caret();
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

  forcePopup: function (e) {
    e.preventDefault();
    this.renderPopup();
  },

  renderPopup: function () {
    /* jshint ignore:start */
    var suggestions = this.renderSuggestions();
    var visible = suggestions.length > 0;

    if (!this._popup) {
      this._popup = PopupMenu.renderComponent(
        <PopupMenu
          anchorElement={this.getDOMNode()}
          autoRemove={false}
          corner={PopupMenu.Corner.BOTTOM_LEFT}
          data={suggestions} shortcuts={true}
          left={this.getCaretOffset()}
          onSelect={this.handleSelect}
          visible={visible}
        />
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

  renderSuggestions: function () {
    var suggestions = [];

    this.state.suggestions.forEach(function (suggestion, index, arr) {
      var prevSuggestion = arr[index - 1];
      var nextSuggestion = arr[index + 1];
      var description = suggestion.description;

      if ((prevSuggestion && prevSuggestion.description !== description || !prevSuggestion) &&
        nextSuggestion && nextSuggestion.description === description) {

        suggestions.push({
          key: suggestion.option + description + PopupMenu.Type.SEPARATOR,
          description: description,
          type: PopupMenu.Type.SEPARATOR
        });
      }

      var label;

      /* jshint ignore:start */
      var option;
      var before = false;
      var after = false;
      if (suggestion.matchingStart !== suggestion.matchingEnd) {
        before = suggestion.option.substring(0, suggestion.matchingStart);
        option = <span className="ring-list__highlight">{suggestion.option.substring(suggestion.matchingStart, suggestion.matchingEnd)}</span>;
        after = suggestion.option.substring(suggestion.matchingEnd);
      } else {
        option = suggestion.option;
      }

      var prefix = !!suggestion.prefix && <span className="ring-list__service">{suggestion.prefix}</span>;
      var suffix = !!suggestion.suffix && <span className="ring-list__service">{suggestion.suffix}</span>;

      label = React.DOM.span(null, prefix, before, option, after, suffix);
      /* jshint ignore:end */

      var item = {
        key: suggestion.option + description + PopupMenu.Type.ITEM,
        label: label,
        type: PopupMenu.Type.ITEM,
        data: suggestion
      };

      if ((prevSuggestion && prevSuggestion.description !== description || !prevSuggestion) &&
        nextSuggestion && nextSuggestion.description !== description) {
        item.description = description;
      }

      suggestions.push(item);
    });

    return suggestions;
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
          onInput={this.handleInput} onKeyPress={this.handleEnter} onKeyUp={this.handleCaretMove}
          onClick={this.handleCaretMove} onFocus={this.handleFocusChange} onBlur={this.handleFocusChange}
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
