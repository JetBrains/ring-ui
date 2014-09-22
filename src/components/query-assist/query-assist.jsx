/**
 * @fileoverview Query Assist
 * @jsx React.DOM
 */

var React = require('react');
var $ = require('jquery');
var when = require('when');
require('jquery-caret');

var PopupMenu = require('../popup-menu/popup-menu');
var Shortcuts = require('shortcuts/shortcuts');
var Global = require('global/global');

var generateUniqueId = Global.getUIDGenerator('ring-query-assist-');

require('./query-assist.scss');
require('../input/input.scss');

/**
 * @constructor
 * @mixes {Shortcuts.Mixin}
 * @extends {ReactComponent}
 */
var QueryAssist = React.createClass({
  mixins: [Shortcuts.Mixin],

  /** @override */
  propTypes: {
    className: React.PropTypes.string,
    dataSource: React.PropTypes.func.isRequired,
    focus: React.PropTypes.bool,
    hint: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onApply: React.PropTypes.func,
    onFocusChange: React.PropTypes.func,
    query: React.PropTypes.string
  },

  generateState: function (props) {
    var query = props.query || '';

    var state = {
      query: query,
      caret: query.length
    };

    if ('focus' in props) {
      state.focus = props.focus;
    }

    return state;
  },

  getInitialState: function () {
    return this.generateState(this.props);
  },

  getDefaultProps: function () {
    return {shortcuts: true};
  },

  getShortcutsProps: function () {
    return {
      map: {
        'enter': this.handleComplete,
        'ctrl+space': this.handleCtrlSpace,
        'tab': this.handleTab
      },
      scope: generateUniqueId()
    };
  },

  componentDidMount: function () {
    this.setState({firstRun: true}, this.sendRequest);
  },

  componentWillReceiveProps: function (props) {
    this.setState(this.generateState(props), this.sendRequest);
  },

  handleFocusChange: function (e) {
    // otherwise it's blur and false
    var focus = e.type === 'focus';

    if (typeof this.props.onFocusChange === 'function') {
      this.props.onFocusChange(focus);
    }

    if (!this.state.firstRun) {
      this.setState({focus: focus}, focus ? this.sendRequest : $.noop);
    }
  },

  handleInput: function () {
    var props = {
      query: this.getQuery(),
      caret: this.getCaret()
    };

    this.setState(this.generateState(props), this.sendRequest);
  },

  // It's necessary to prevent new element creation before any other hooks
  handleEnter: function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  },

  handleTab: function (e) {
    e.preventDefault();

    return this.handleComplete(this._popup.refs.List.getSelected() || {data: this.state.suggestions[0]}, true);
  },

  handleCaretMove: function () {
    var caret = this.getCaret();

    if (caret !== this.state.caret) {
      this.setState({caret: caret}, this.sendRequest);
    }
  },

  handleResponse: function (props) {
    var state = $.extend(this.generateState(props), {
      styleRanges: props.styleRanges,
      suggestions: props.suggestions
    });

    if (state.query === this.state.query && state.caret === this.state.caret) {
      this.setState(state, this.renderPopup);
    }
  },

  handleComplete: function (data, replace) {
    var query = this.getQuery();

    if (!data || !data.data) {
      if (typeof this.props.onApply === 'function') {
        this._popup.close();
        return this.props.onApply({query: query, caret: this.getCaret()});
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

    // Force focus on complete e.g. after click
    props.focus = true;

    this.setState(this.generateState(props), this.sendRequest);
  },

  sendRequest: function () {
    var params = {
      query: this.state.query,
      caret: this.state.caret
    };

    if (this._popup) {
      this._popup.close();
    }
    when(this.props.dataSource(params)).then(this.handleResponse);
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

    return caretNode && (caretNode.offsetLeft + caretNode.offsetWidth - PopupMenu.ITEM_PADDING);
  },

  // TODO Move to renderLeter and simplify
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

  handleCtrlSpace: function (e) {
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
          onSelect={this.handleComplete}
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
      var prevSuggestion = arr[index - 1] && arr[index - 1].group;

      if (prevSuggestion !== suggestion.group) {

        suggestions.push({
          key: suggestion.option + suggestion.group + PopupMenu.Type.SEPARATOR,
          description: suggestion.group,
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
        // TODO Make sure if we need simulate uniqueness here
        key: suggestion.option + (suggestion.group || '') + (suggestion.description || ''),
        label: label,
        type: PopupMenu.Type.ITEM,
        data: suggestion
      };

      if (!suggestion.group) {
        item.description = suggestion.description;
      }

      if (suggestion.icon) {
        item.icon = suggestion.icon;
      }

      suggestions.push(item);
    });

    if (this.props.hint) {
      suggestions.push({
        key: this.props.hint + PopupMenu.Type.ITEM,
        label: this.props.hint,
        type: PopupMenu.Type.HINT
      });
    }

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
    var query = this.state.query && React.renderComponentToStaticMarkup(
      <span>{this.state.query.split('').map(this.renderLetter)}</span>
    );

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
    if (this.refs.input.getDOMNode().firstChild && this.state.focus) {
      $(this.refs.input.getDOMNode()).caret(this.state.caret);
    }
  }
});

module.exports = QueryAssist;
