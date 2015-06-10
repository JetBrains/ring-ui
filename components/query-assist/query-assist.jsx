/**
 * @fileoverview Query Assist
 * @jsx React.DOM
 */

var React = require('react');
var $ = require('jquery');
var when = require('when');
var debounce = require('mout/function/debounce');
var mixIn = require('mout/object/mixIn');
var isNumber = require('mout/lang/isNumber');
var deepEquals = require('mout/lang/deepEquals');

var Caret = require('caret/caret');
var ContentEditable = require('contenteditable/contenteditable');
var NgModelMixin = require('ngmodel/ngmodel');
var PopupMenu = require('../popup-menu/popup-menu');
var Icon = require('../icon/icon');
var Loader = require('../loader/loader');
var ShortcutsMixin = require('shortcuts/shortcuts__mixin');
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

   <example name="QueryAssist in Angular">
     <file name="index.html">
       <div ng-app="test" ng-controller="testCtrl as ctrl">
         <div react="QueryAssist"
           clear="true"
           x-data-source="ctrl.source(query, caret, omitSuggestions)"
           glass="true"
           query="ctrl.query"
           on-apply="ctrl.save(query)"
           placeholder="{{ placeholder }}"
           hint="{{ 'Press ⇥ to complete first item' }}"
           hint-on-selection="{{ 'Press ↩ to complete selected item' }}"></div>

         <p>{{ ctrl.query }}</p>
       </div>
     </file>

     <file name="index.js" webpack="true">
       require('angular/angular.min.js');
       require('auth-ng/auth-ng');
       require('react-ng/react-ng')({
        QueryAssist: require('query-assist/query-assist')
       });

       var hubUri = '***REMOVED***/';

       angular.module('test', ['Ring.react-ng', 'Ring.auth'])
         .config(function (authProvider) {
           authProvider.config({
             serverUri: hubUri,
             request_credentials: 'skip',
             redirect_uri: window.location.href.split('#')[0]
           });
         })
         .controller('testCtrl', function($http, $scope) {
           var ctrl = this;
           ctrl.query = 'ctrl';

           ctrl.save = function(query) {
             ctrl.query = query;
             $scope.$apply();
           };

           ctrl.source = function (query, caret, omitSuggestions) {
             var config = {
               params: {
                 fields: 'query,caret,styleRanges' + (omitSuggestions ? '' : ',suggestions'),
                 query: query,
                 caret: caret
               }
             };

             return $http.get(hubUri + 'api/rest/users/queryAssist', config).
               then(function(data) {
                 return data.data;
               });
           }
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
      placeholderEnabled: !this.props.query,
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
    this.immediateState = {
      query: this.props.query,
      caret: isNumber(this.props.caret) ? this.props.caret : this.props.query && this.props.query.length,
      focus: this.props.focus
    };
    this.setupRequestHandler(this.props);
    this.caret = new Caret(this.refs.input.getDOMNode());

    this.requestStyleRanges().
      catch(this.setFocus).
      /* For some reason one more tick before attachMutationEvents is required */
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

  componentWillReceiveProps: function (props) {
    this.setupRequestHandler(props);

    if (typeof props.focus === 'boolean') {
      this.setShortcutsEnabled(props.focus);
      this.immediateState.focus = props.focus;

      if (props.focus === false && this.immediateState.focus === true) {
        this.blurInput();
      } else if (props.focus === true && this.immediateState.focus === false) {
        this.setFocus();
      }
    }

    if (typeof props.caret === 'number') {
      this.immediateState.caret = props.caret;
      this.setFocus();
    }

    if (typeof props.query === 'string' && props.query !== this.immediateState.query) {
      this.immediateState.query = props.query;
      this.setState({query: props.query, placeholderEnabled: !!props.query}, props.query ? this.requestStyleRanges : noop);
    }
  },

  setFocus: function () {
    var queryLength = this.immediateState.query != null && this.immediateState.query.length;
    var newCaretPosition = this.immediateState.caret < queryLength ? this.immediateState.caret : queryLength;
    var currentCaretPosition = this.caret.getPosition({avoidFocus: true});

    if (this.immediateState.focus && !this.props.disabled && currentCaretPosition !== -1) {
      // Set to end of field value if newCaretPosition is inappropriate
      this.caret.setPosition(newCaretPosition >= 0 ? newCaretPosition : -1);
      this.scrollInput();
    }
  },

  scrollInput: function () {
    var input = this.refs.input.getDOMNode();
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
      if (!this.mouseIsDownOnPopup) {
        this.closePopup();
      }
    } else {
      this.setFocus();
    }

    this.props.onFocusChange({focus: focus});
    this.setShortcutsEnabled(focus);
  },

  handleInput: function () {
    var props = {
      query: $(this.refs.input.getDOMNode()).text().replace(/\s/g, ' '),
      caret: this.caret.getPosition(),
      focus: true
    };

    var currentQueryIsEmpty = this.immediateState.query === '';
    var newQueryIsEmpty = props.query === '';

    if (newQueryIsEmpty !== currentQueryIsEmpty) {
      this.setState({placeholderEnabled: newQueryIsEmpty});
    }

    this.props.onChange(props);
    this.immediateState = props;
    this.requestData();
  },

  // It's necessary to prevent new element creation before any other hooks
  handleEnter: function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  },

  handleTab: function (e) {
    var list = this._popup && this._popup.refs.List;
    var suggestion = list && (list.getSelected() || list.getFirst());

    if (suggestion && this._popup && this._popup.isVisible()) {
      e.preventDefault();
      return this.handleComplete(suggestion, true);
    }

    if (this.state.loading) {
      e.preventDefault();
      return false;
    }

    return true;
  },

  handleCaretMove: function (e) {
    var caret = this.caret.getPosition();
    var popupHidden = (!this._popup || !this._popup.isVisible()) && e.type === 'click';

    if (!this.props.disabled && (caret !== this.immediateState.caret || popupHidden)) {
      this.immediateState.caret = caret;
      this.scrollInput();
      this.requestData();
    }
  },

  handleResponse: function (params) {
    var deferred = when.defer();
    var state = {
      loading: false
    };

    if ((params.query === this.immediateState.query || this.immediateState.query === undefined) &&
      (params.caret === this.immediateState.caret || this.immediateState.caret === undefined)) {
      deferred.resolve(params.suggestions);

      state.query = params.query;
      state.placeholderEnabled = !params.query;

      // Do not update deep equal styleRanges to simplify shouldComponentUpdate check
      if (!deepEquals(this.state.styleRanges, params.styleRanges)) {
        state.styleRanges = params.styleRanges;
      }
    } else {
      deferred.reject(new Error('Current and response queries mismatch'));
    }

    this.setState(state);

    return deferred.promise;
  },

  handleApply: function () {
    this.closePopup();
    return this.props.onApply(this.immediateState);
  },

  handleComplete: function (data, replace) {
    if (!data || !data.data) {
      this.handleApply();

      return;
    }

    var suggestion = data.data;
    var prefix = suggestion.prefix || '';
    var suffix = suggestion.suffix || '';

    var state = {
      caret: suggestion.caret,
      query: this.immediateState.query.substr(0, suggestion.completionStart) + prefix + suggestion.option + suffix
    };

    if (replace) {
      state.query += this.immediateState.query.substr(suggestion.completionEnd + suffix.length);
    } else {
      state.query += this.immediateState.query.substr(this.immediateState.caret);
    }

    this.props.onChange(state);

    var focusState = {focus: true};
    this.props.onFocusChange(focusState);

    this.immediateState = mixIn(state, focusState);
    this.closePopup();
    this.setState({
      placeholderEnabled: !state.query,
      query: state.query
    });
    this.requestData();
  },

  requestStyleRanges: function () {
    if (!this.immediateState.query) {
      return when.reject(new Error('Query is empty'));
    }

    return this.sendRequest({
      query: this.immediateState.query,
      caret: this.immediateState.caret,
      omitSuggestions: true
    })
      .then(this.handleResponse)
      .catch(noop);
  },

  requestHandler: function () {
    if (this.props.disabled) {
      return;
    }

    this.sendRequest(this.immediateState).
      then(this.handleResponse).
      then(this.renderPopup).
      catch(noop);
  },

  sendRequest: function (params) {
    var dataPromise = when(this.props.dataSource(params)).delay(1000);

    // Close popup after timeout between long requests
    dataPromise.
      timeout(500).
      with(this).
      catch(when.TimeoutError, function() {
        this.setState({
          loading: true
        });

        if (params.query === this.immediateState.query) {
          this.closePopup();
        }
      }).
      catch(noop);

    return dataPromise;
  },

  getPopupOffset: function (suggestions) {
    var input = this.refs.input.getDOMNode();
    // First suggestion should be enough?
    var suggestion = suggestions && suggestions[0];

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

  renderPopup: function (suggestions) {
    if (!suggestions.length) {
      this.closePopup();
      return;
    }

    var renderedSuggestions = this.renderSuggestions(suggestions);

    if (!this._popup || !this._popup.isMounted()) {
      this._popup = PopupMenu.renderComponent(
        <PopupMenu
          anchorElement={this.getDOMNode()}
          autoRemove={false} // required to prevent popup unmount on Esc
          className={this.props.popupClassName}
          corner={PopupMenu.PopupProps.Corner.BOTTOM_LEFT}
          data={renderedSuggestions}
          hint={this.props.hint}
          hintOnSelection={this.props.hintOnSelection}
          left={this.getPopupOffset(suggestions)}
          maxHeight="screen"
          onMouseDown={this.trackPopupMouseState}
          onMouseUp={this.trackPopupMouseState}
          onSelect={this.handleComplete}
          shortcuts={true}
        />
      );
    } else {
      this._popup.setProps({
        data: renderedSuggestions,
        hint: this.props.hint,
        hintOnSelection: this.props.hintOnSelection,
        left: this.getPopupOffset(suggestions)
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
    var state = {
      caret: 0,
      query: '',
      focus: true
    };

    this.props.onChange(state);
    this.props.onClear();

    this.immediateState = state;
    this.setState({
      query: '',
      placeholderEnabled: true,
      loading: false
    });
  },

  renderSuggestions: function (suggestions) {
    var renderedSuggestions = [];

    suggestions.forEach(function (suggestion, index, arr) {
      var prevSuggestion = arr[index - 1] && arr[index - 1].group;

      if (prevSuggestion !== suggestion.group) {

        renderedSuggestions.push({
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

      renderedSuggestions.push(item);
    });

    return renderedSuggestions;
  },

  renderLetter: function (letter, index) {
    // \u00a0 === &nbsp;
    var letterValue = letter === ' ' ? '\u00a0' : letter;
    // Despite warning we don't need key here because of renderComponentToStaticMarkup
    return <span className={this.getLetterClass(index)}>{letterValue}</span>;
  },

  shouldComponentUpdate: function (props, state) {
    return state.query !== this.state.query ||
      state.loading !== this.state.loading ||
      state.styleRanges !== this.state.styleRanges ||
      state.placeholderEnabled !== this.state.placeholderEnabled ||
      props.placeholder !== this.props.placeholder ||
      props.disabled !== this.props.disabled ||
      props.clear !== this.props.clear ||
      props.glass !== this.props.glass;
  },

  /** @override */
  render: function () {
    var renderPlaceholder = !!this.props.placeholder && this.state.placeholderEnabled;
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
      );

    return (
      <div className="ring-query-assist"
        onMouseDown={this.trackInputMouseState}
        onMouseUp={this.trackInputMouseState}
        >
        <ContentEditable
          className={inputClasses} ref="input"
          disabled={this.props.disabled}
          dangerousHTML={query}
          onComponentUpdate={this.setFocus}

          onBlur={this.handleFocusChange}
          onClick={this.handleCaretMove}
          onFocus={this.handleFocusChange}
          onInput={this.handleInput}
          onKeyDown={this.handleEnter}
          onKeyPress={this.handleEnter}
          onKeyUp={this.handleCaretMove}

          spellCheck="false" />

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
