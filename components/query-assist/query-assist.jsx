/**
 * @fileoverview Query Assist
 * @jsx React.DOM
 */

var React = require('react');
var $ = require('jquery');
var when = require('when');
var debounce = require('mout/function/debounce');
var pick = require('mout/object/pick');
var filter = require('mout/object/filter');
var isNumber = require('mout/lang/isNumber');
var Caret = require('caret/caret');

var NgModelMixin = require('ngmodel/ngmodel');
var PopupMenu = require('../popup-menu/popup-menu');
var Icon = require('../icon/icon');
var Loader = require('../loader/loader');
var ShortcutsMixin = require('shortcuts/shortcuts-mixin');
var Global = require('global/global');

var generateUniqueId = Global.getUIDGenerator('ring-query-assist-');

require('./query-assist.scss');
require('../input/input.scss');

// Use for IE11 and down to 9
var impotentIE = document.documentMode <= 11;  // TODO Proper browser detection?
var mutationEvents = 'DOMCharacterDataModified DOMNodeInserted DOMNodeRemoved DOMSubtreeModified';

var INPUT_BORDER_WIDTH = 1;
var POPUP_COMPENSATION = INPUT_BORDER_WIDTH +
  PopupMenu.ListProps.Dimension.ITEM_PADDING +
  PopupMenu.PopupProps.Dimension.BORDER_WIDTH;

var noop = function() {};

/**
 * @name QueryAssist
 * @constructor
 * @mixes {ShortcutsMixin}
 * @extends {ReactComponent}
 * @example
   <example name="QueryAssist">
     <file name="index.html">
       <div id="example">
       </div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var QueryAssist = require('query-assist/query-assist');
       var Auth = require('auth/auth');

       var log = function(obj) {
         var div = document.createElement('div');
         div.innerHTML = JSON.stringify(obj);
         document.getElementById('example').appendChild(div);
       };

       var auth = new Auth({
          serverUri: '***REMOVED***/',
          request_credentials: 'skip',
          redirect_uri: window.location.href.split('#')[0]
        });

       auth.init().then(function() {
         React.renderComponent(
           QueryAssist({
             query: 'test',
             placeholder: 'placeholder',
             popupClassName: 'popupClassNameTest',
             glass: true,
             clear: true,
             onApply: log,
             focus: true,
             hint: 'lol',
             hintOnSelection: 'lol selected',
             dataSource: function (props) {
               props.fields = 'query,caret,styleRanges' + (props.omitSuggestions ? '' : ',suggestions')

               return auth.requestToken().then(function (token) {
                 return auth.getApi('users/queryAssist', token, props);
               });
             }
           }),
           document.getElementById('example')
         );
       });
     </file>
   </example>
 */
var ngModelStateField = {query: true, caret: true};
var QueryAssist = React.createClass({
  mixins: [ShortcutsMixin, NgModelMixin],
  ngModelStateField: ngModelStateField,
  statics: {
    ngModelStateField: ngModelStateField
  },

  /** @override */
  propTypes: {
    caret: React.PropTypes.number,
    className: React.PropTypes.string,
    popupClassName: React.PropTypes.string,
    dataSource: React.PropTypes.func.isRequired,
    delay: React.PropTypes.number,
    disabled: React.PropTypes.bool,
    focus: React.PropTypes.bool,
    hint: React.PropTypes.string,
    hintOnSelection: React.PropTypes.string,
    glass: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    onApply: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onClear: React.PropTypes.func,
    onFocusChange: React.PropTypes.func,
    query: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      query: this.props.query,
      caret: isNumber(this.props.caret) ? this.props.caret : this.props.query && this.props.query.length,
      focus: this.props.focus,
      shortcuts: this.props.focus
    };
  },

  getDefaultProps: function () {
    return {
      onApply: noop,
      onChange: noop,
      onClear: noop,
      onFocusChange: noop
    };
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

  // See http://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web
  blurInput: function () {
    window.getSelection().removeAllRanges();
  },

  componentDidMount: function () {
    this.setupRequestHandler(this.props);
    this.caret = new Caret(this.refs.input.getDOMNode());

    this.requestStyleRanges().
      catch(this.setFocus).
      /* For some reason more tick before attachMutationEvents is required */
      delay(0).
      finally(this.attachMutationEvents);
  },

  attachMutationEvents: function() {
    if (impotentIE) {
      $(this.refs.input.getDOMNode()).on(mutationEvents, debounce(this.handleInput, 0));
    }
  },

  /**
   * Optionally setup request data delay. For each component create separate instance of
   * delayed function.
   * This may help reduce the load on the server if the user quickly inputs data
   */
  setupRequestHandler: function (props) {
    if ((this.requestData === this.requestHandler) === Boolean(props.delay)) {
      if (typeof props.delay === 'number') {
        this.requestData = debounce(this.requestData, props.delay);
      } else {
        this.requestData = this.requestHandler;
      }
    }
  },

  componentWillUnmount: function () {
    if (this._popup) {
      this._popup.remove();
    }

    if (impotentIE) {
      $(this.refs.input.getDOMNode()).off(mutationEvents);
    }
  },

  propsToPick: {
    query: 'string',
    caret: 'number',
    focus: 'boolean'
  },

  componentWillReceiveProps: function (props) {
    if (props.focus === false && this.state.focus === true) {
      this.blurInput();
    }

    this.setupRequestHandler(props);

    var state = filter(props, function (value, key) {
      return typeof value === this.propsToPick[key];
    }, this);

    if ('focus' in state) {
      state.shortcuts = state.focus;
    }

    if (!Object.keys(state).length) {
      return;
    }

    var updateStyles = state.query && state.query !== this.getQuery();
    this.setState(state, updateStyles ? this.requestStyleRanges : noop);
  },

  componentDidUpdate: function () {
    this.setFocus();
  },

  setFocus: function () {
    var input = this.refs.input.getDOMNode();
    var queryLength = this.state.query != null && this.state.query.length;
    var caretPosition = this.state.caret < queryLength ? this.state.caret : queryLength;
    var position = this.caret.getPosition({avoidFocus: true});

    if (this.state.focus && !this.props.disabled && position !== -1) {
      this.caret.setPosition(caretPosition >= 0 ? caretPosition : -1);
    }

    /**
     * Scroll input after completion
      */
    var caretOffset = this.caret.getOffset();

    if (input.clientWidth !== input.scrollWidth && caretOffset > input.clientWidth) {
      input.scrollLeft = input.scrollLeft + caretOffset;
    }
  },

  handleFocusChange: function (e) {
    // otherwise it's blur and false
    var focus = e.type === 'focus';

    // Track mouse state to avoid focus loss on clicks on icons.
    // Doesn't handle really edge cases like shift+tab while mouse button is pressed.
    if (!this.isMounted() || (!focus && this.mouseIsDownOnInput)) {
      return;
    }

    if (!focus) {
      this.blurInput();

      // Close popup on blur by keyboard (mostly shift+tab)
      if (!this.mouseIsDownOnPopup && this.isMounted()) {
        this.closePopup();
      }
    }

    this.props.onFocusChange({focus: focus});

    this.setState({focus: focus, shortcuts: focus});
  },

  handleInput: function () {
    var props = {
      query: this.getQuery(),
      caret: this.getCaret()
    };

    this.props.onChange(props);

    this.setState(props, this.requestData);
  },

  // It's necessary to prevent new element creation before any other hooks
  handleEnter: function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  },

  handleTab: function (e) {
    var selected = this._popup && this._popup.refs.List && this._popup.refs.List.getSelected();
    var firstSuggestion = this.state.suggestions && this.state.suggestions[0];

    if (this._popup && this._popup.isVisible() && (selected || firstSuggestion)) {
      e.preventDefault();
      return this.handleComplete(selected || {data: firstSuggestion}, true);
    }

    return true;
  },

  handleCaretMove: function (e) {
    var caret = this.getCaret();
    var popupHidden = (!this._popup || !this._popup.isVisible()) && e.type === 'click';

    if (!this.props.disabled && (caret !== this.state.caret || popupHidden)) {
      this.setState({caret: caret}, this.requestData);
    }
  },

  handleResponse: function (props) {
    var deferred = when.defer();
    var pickedProps = pick(props, ['query', 'caret', 'styleRanges', 'suggestions']);

    if ((pickedProps.query === this.state.query || this.state.query === undefined) &&
      (pickedProps.caret === this.state.caret || this.state.caret === undefined)) {
      pickedProps.loading = false;

      this.setState(pickedProps, deferred.resolve);
    } else {
      this.setState({
        loading: false
      });

      deferred.reject(new Error('Current and response queries mismatch'));
    }

    return deferred.promise;
  },

  handleApply: function () {
    var state = this.getInputState();

    this.setState({
      focus: true
    });

    this.closePopup();
    return this.props.onApply(state);
  },

  handleComplete: function (data, replace) {
    var state = this.getInputState();

    if (!data || !data.data) {
      this.handleApply();

      return;
    }

    var suggestion = data.data;
    var prefix = suggestion.prefix || '';
    var suffix = suggestion.suffix || '';

    var props = {
      caret: suggestion.caret,
      query: state.query.substr(0, suggestion.completionStart) + prefix + suggestion.option + suffix
    };

    if (replace) {
      props.query += state.query.substr(suggestion.completionEnd + suffix.length);
    } else {
      props.query += state.query.substr(state.caret);
    }

    this.props.onChange(props);

    // Force focus on complete e.g. after click
    props.focus = true;
    this.props.onFocusChange({focus: props.focus});

    this.setState(props, this.requestData);
  },

  requestStyleRanges: function () {
    var state = this.getInputState();

    if (!state.query) {
      return when.reject(new Error('Query is empty'));
    }

    state.omitSuggestions = true;
    return this.sendRequest(state)
      .then(this.handleResponse)
      .catch(noop);
  },

  requestHandler: function () {
    if (this.props.disabled) {
      return;
    }

    this.sendRequest(this.getInputState()).
      then(this.handleResponse).
      then(this.renderPopup).
      catch(noop);
  },

  sendRequest: function (params) {
    var dataPromise = when(this.props.dataSource(params));

    // Close popup after timeout between long requests
    dataPromise.
      timeout(500).
      with(this).
      catch(when.TimeoutError, function() {
        this.setState({
          loading: true
        });

        if (params.query === this.state.query) {
          this.closePopup();
        }
      }).
      catch(noop);

    return dataPromise;
  },

  getInputState: function () {
    return {
      query: this.state.query,
      caret: this.state.caret
    };
  },

  getQuery: function () {
    return $(this.refs.input.getDOMNode()).text().replace(/\s/g, ' ');
  },

  getCaret: function () {
    return this.caret.getPosition();
  },

  getPopupOffset: function () {
    var input = this.refs.input.getDOMNode();
    // First suggestion should be enough?
    var suggestion = this.state.suggestions && this.state.suggestions[0];

    // Check of suggestion begins not from the end
    var completionStart = suggestion &&
      suggestion.completionStart !== suggestion.completionEnd &&
      suggestion.completionStart;

    var completionStartNode = input.firstChild &&
      suggestion.completionStart !== false &&
      suggestion.completionStart != null &&
      input.firstChild.childNodes[completionStart];

    var offset = completionStartNode &&
      (completionStartNode.getBoundingClientRect().right - input.getBoundingClientRect().left);

    if (!offset) {
      var caret = this.caret.getOffset();

      // Do not compensate caret in the beginning of field
      if (caret === 0) {
        return caret;
      } else {
        offset = caret;
      }
    }

    return offset - POPUP_COMPENSATION;
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

    if (!this._popup || !this._popup.isVisible()) {
      this.requestData();
    }
  },

  trackPopupMouseState: function (e) {
    this.mouseIsDownOnPopup = e.type === 'mousedown';
  },

  trackInputMouseState: function (e) {
    this.mouseIsDownOnInput = e.type === 'mousedown';
  },

  renderPopup: function () {
    var suggestions = this.renderSuggestions();

    if (!suggestions.length) {
      this.closePopup();
      return;
    }

    if (!this._popup || !this._popup.isMounted()) {
      this._popup = PopupMenu.renderComponent(
        <PopupMenu
          anchorElement={this.getDOMNode()}
          autoRemove={false} // required to prevent popup unmount on Esc
          className={this.props.popupClassName}
          corner={PopupMenu.PopupProps.Corner.BOTTOM_LEFT}
          data={suggestions}
          hint={this.props.hint}
          hintOnSelection={this.props.hintOnSelection}
          left={this.getPopupOffset()}
          maxHeight="screen"
          onMouseDown={this.trackPopupMouseState}
          onMouseUp={this.trackPopupMouseState}
          onSelect={this.handleComplete}
          shortcuts={true}
        />
      );
    } else {
      this._popup.setProps({
        data: suggestions,
        hint: this.props.hint,
        hintOnSelection: this.props.hintOnSelection,
        left: this.getPopupOffset()
      });
      this._popup.show();
    }
  },

  closePopup: function () {
    if (this._popup) {
      this._popup.close();
    }
  },

  clearQuery: function () {
    this.props.onChange({
      query: ''
    });
    this.props.onClear();

    this.setState({
      query: '',
      loading: false
    });
  },

  renderSuggestions: function () {
    var suggestions = [];

    if (!this.state.suggestions) {
      return suggestions;
    }

    this.state.suggestions.forEach(function (suggestion, index, arr) {
      var prevSuggestion = arr[index - 1] && arr[index - 1].group;

      if (prevSuggestion !== suggestion.group) {

        suggestions.push({
          key: suggestion.option + suggestion.group + PopupMenu.ListProps.Type.SEPARATOR,
          description: suggestion.group,
          type: PopupMenu.ListProps.Type.SEPARATOR
        });
      }

      var label;
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

      var item = {
        key: suggestion.prefix + suggestion.option + suggestion.suffix + suggestion.group + suggestion.description,
        label: label,
        type: PopupMenu.ListProps.Type.ITEM,
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

    return suggestions;
  },

  renderLetter: function (letter, index) {
    // \u00a0 === &nbsp;
    var letterValue = letter === ' ' ? '\u00a0' : letter;
    // Despite warning we don't need key here because of renderComponentToStaticMarkup
    return <span className={this.getLetterClass(index)}>{letterValue}</span>;
  },

  /** @override */
  render: function () {
    var renderPlaceholder = !!this.props.placeholder && !this.state.query;
    var renderClear = this.props.clear && !!this.state.query;
    var renderGlass = this.props.glass && !this.state.loading;
    var renderGlassOrLoader = this.props.glass || this.state.loading;

    var inputClasses = React.addons.classSet({
      'ring-query-assist__input ring-input ring-js-shortcuts': true,
      'ring-query-assist__input_gap': renderGlassOrLoader !== renderClear &&
        (renderGlassOrLoader || renderClear),
      'ring-query-assist__input_double-gap': renderGlassOrLoader && renderClear,
      'ring-input_disabled': this.props.disabled
    });

    var query = this.state.query && React.renderComponentToStaticMarkup(
        <span>{this.state.query.split('').map(this.renderLetter)}</span>
      ) || '';

    return (
      <div className="ring-query-assist"
        onMouseDown={this.trackInputMouseState}
        onMouseUp={this.trackInputMouseState}
        >
        <div
          className={inputClasses} ref="input"
          contentEditable={!this.props.disabled}
          dangerouslySetInnerHTML={{__html: query}}

          onBlur={this.handleFocusChange}
          onClick={this.handleCaretMove}
          onFocus={this.handleFocusChange}
          onInput={this.handleInput}
          onKeyDown={this.handleEnter}
          onKeyPress={this.handleEnter}
          onKeyUp={this.handleCaretMove}

          spellCheck="false"></div>

        {renderPlaceholder && <span
          className="ring-query-assist__placeholder"
          ref="placeholder"
          onClick={this.handleCaretMove}>
          {this.props.placeholder}
        </span>}
        {renderGlass && <Icon
          className="ring-query-assist__icon"
          color="gray"
          glyph="search"
          onClick={this.handleApply}
          ref="glass"
          size={Icon.Size.Size16} />}
        {this.state.loading && <div
          className="ring-query-assist__icon ring-query-assist__icon_loader"
          ref="loader">
          <Loader modifier={Loader.Modifier.INLINE} />
        </div>}
        {renderClear && <Icon
          className="ring-query-assist__icon ring-query-assist__icon_clear"
          color="gray"
          glyph="close"
          onClick={this.clearQuery}
          ref="clear"
          size={Icon.Size.Size16} />}
      </div>
    );
  }
});

module.exports = QueryAssist;
