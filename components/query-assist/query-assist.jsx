/**
 * @fileoverview Query Assist
 */

import 'babel/polyfill';
import React, { PropTypes, DOM, createClass } from 'react';
import { findDOMNode } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import mixin from 'react-mixin';
import when from 'when';
import debounce from 'mout/function/debounce';
import deepEquals from 'mout/lang/deepEquals';
import classNames from 'classnames';

import RingComponent from 'ring-component/ring-component';
import factory from 'factory-decorator/factory-decorator';
import Caret from 'caret/caret';
import ContentEditable from 'contenteditable/contenteditable';
import NgModelMixin from 'ngmodel/ngmodel';
import PopupMenu from '../popup-menu/popup-menu';
import Icon from '../icon/icon';
import Loader from '../loader/loader';
import ShortcutsMixin from 'shortcuts/shortcuts__mixin';
import Global from 'global/global';

import './query-assist.scss';
import '../input/input.scss';

const generateUniqueId = Global.getUIDGenerator('ring-query-assist-');

// Use for IE11 and down to 9
const impotentIE = document.documentMode <= 11;  // TODO Proper browser detection?
const mutationEvent = 'DOMSubtreeModified';

const INPUT_BORDER_WIDTH = 1;
const POPUP_COMPENSATION = INPUT_BORDER_WIDTH +
  PopupMenu.ListProps.Dimension.ITEM_PADDING +
  PopupMenu.PopupProps.Dimension.BORDER_WIDTH;

const noop = function() {};

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
       var render = require('react-dom').render;
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
         render(
           QueryAssist.factory({
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
         <p>{{ ctrl.query }}</p>

         <div react="QueryAssist"
           clear="true"
           x-data-source="ctrl.source(query, caret, omitSuggestions)"
           glass="true"
           focus="ctrl.focus"
           query="ctrl.query"
           on-apply="ctrl.save(query)"
           on-change="ctrl.change(query)"
           on-focus-change="ctrl.focusChange(focus)"
           placeholder="{{ placeholder }}"
           hint="{{ 'Press ⇥ to complete first item' }}"
           hint-on-selection="{{ 'Press ↩ to complete selected item' }}"></div>

         <p ng-repeat="query in ctrl.queries track by $index">{{ query }}</p>
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
           ctrl.queries = [];
           ctrl.query = 'query';
           ctrl.focus = true;

           ctrl.save = function(query) {
             ctrl.queries.unshift(query);
             $scope.$apply();
           };

           function updateScope(name, value) {
             if (ctrl[name] !== value) {
               ctrl[name] = value;

               if (!$scope.$root.$$phase) {
                 $scope.$apply();
               }
             }
           }

           ctrl.change = function (query) {
             updateScope('query', query);
           };

           ctrl.focusChange = function (focus) {
             updateScope('focus', focus);
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
const ngModelStateField = {query: true, caret: true};

@factory
@mixin.decorate(ShortcutsMixin)
@mixin.decorate(ngModelStateField)
export default class QueryAssist extends RingComponent {
  static ngModelStateField = ngModelStateField;

  /** @override */
  static propTypes = {
    caret: PropTypes.number,
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    dataSource: PropTypes.func.isRequired,
    delay: PropTypes.number,
    disabled: PropTypes.bool,
    focus: PropTypes.bool,
    hint: PropTypes.string,
    hintOnSelection: PropTypes.string,
    glass: PropTypes.bool,
    placeholder: PropTypes.string,
    onApply: PropTypes.func,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    onFocusChange: PropTypes.func,
    query: PropTypes.string
  };

  static defaultProps = {
    onApply: noop,
    onChange: noop,
    onClear: noop,
    onFocusChange: noop
  };

  state = {
    query: this.props.query,
    placeholderEnabled: !this.props.query,
    shortcuts: true
  };

  ngModelStateField = ngModelStateField;

  getShortcutsProps() {
    return {
      map: {
        'enter': ::this.handleComplete,
        'ctrl+space': ::this.handleCtrlSpace,
        'tab': ::this.handleTab,
        'right': noop,
        'left': noop,
        'space': noop
      },
      scope: generateUniqueId()
    };
  }

  // See http://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web
  blurInput() {
    window.getSelection().removeAllRanges();
  }

  componentDidMount() {
    let query = this.props.query || '';

    this.immediateState = {
      query: query,
      caret: Number.isFinite(this.props.caret) ? this.props.caret : query.length,
      focus: this.props.focus
    };

    this.setupRequestHandler(this.props);
    this.setShortcutsEnabled(this.props.focus);

    this.requestStyleRanges().
      catch(::this.setFocus).
      /* For some reason one more tick before attachMutationEvents is required */
      delay(0).
      finally(::this.attachMutationEvents);
  }

  attachMutationEvents() {
    if (impotentIE) {
      this.input.addEventListener(mutationEvent, ::this.handleInput);
    }
  }

  /**
   * Optionally setup request data delay. For each component create separate instance of
   * delayed function.
   * This may help reduce the load on the server if the user quickly inputs data
   */
  setupRequestHandler(props) {
    if ((this.requestData === this.requestHandler) === Boolean(props.delay)) {
      if (typeof props.delay === 'number') {
        this.requestData = debounce(this.requestData, props.delay);
      } else {
        this.requestData = ::this.requestHandler;
      }
    }
  }

  componentWillUnmount() {
    if (this._popup) {
      this._popup.remove();
    }

    if (impotentIE) {
      this.input.removeEventListener(mutationEvent, ::this.handleInput);
    }
  }

  componentWillReceiveProps(props) {
    let setFocus;
    this.setupRequestHandler(props);

    if (typeof props.focus === 'boolean') {
      this.setShortcutsEnabled(props.focus);

      if (props.focus === false && this.immediateState.focus === true) {
        this.blurInput();
      } else if (props.focus === true && this.immediateState.focus === false) {
        setFocus = true;
      }

      this.immediateState.focus = props.focus;
    }

    if (typeof props.caret === 'number') {
      this.immediateState.caret = props.caret;
      setFocus = true;
    }

    if (setFocus) {
      this.setFocus();
    }

    if (typeof props.query === 'string' && props.query !== this.immediateState.query) {
      this.immediateState.query = props.query;
      this.setState({query: props.query, placeholderEnabled: !props.query}, props.query ? this.requestStyleRanges : noop);
    }
  }

  setFocus() {
    let queryLength = this.immediateState.query != null && this.immediateState.query.length;
    let newCaretPosition = this.immediateState.caret < queryLength ? this.immediateState.caret : queryLength;
    let currentCaretPosition = this.caret.getPosition({avoidFocus: true});

    if (this.immediateState.focus && !this.props.disabled && currentCaretPosition !== -1) {
      // Set to end of field value if newCaretPosition is inappropriate
      this.caret.setPosition(newCaretPosition >= 0 ? newCaretPosition : -1);
      this.scrollInput();
    }
  }

  scrollInput() {
    let caretOffset = this.caret.getOffset();

    if (this.input.clientWidth !== this.input.scrollWidth && caretOffset > this.input.clientWidth) {
      this.input.scrollLeft = this.input.scrollLeft + caretOffset;
    }
  }

  handleFocusChange(e) {
    // otherwise it's blur and false
    let focus = e.type === 'focus';

    // Track mouse state to avoid focus loss on clicks on icons.
    // Doesn't handle really edge cases like shift+tab while mouse button is pressed.
    //if (!this.isMounted() || (!focus && this.mouseIsDownOnInput)) {
    if (!findDOMNode(this) || (!focus && this.mouseIsDownOnInput)) {
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
  }

  handleInput() {
    let props = {
      query: this.input.textContent.replace(/\s/g, ' '),
      caret: this.caret.getPosition(),
      focus: true
    };

    if (this.immediateState.query === props.query) {
      return;
    }

    let currentQueryIsEmpty = this.immediateState.query === '';
    let newQueryIsEmpty = props.query === '';

    if (newQueryIsEmpty !== currentQueryIsEmpty) {
      this.setState({placeholderEnabled: newQueryIsEmpty});
    }

    this.immediateState = props;
    this.props.onChange(props);
    this.requestData();
  }

  // It's necessary to prevent new element creation before any other hooks
  handleEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  handleTab(e) {
    let list = this._popup && this._popup.refs.List;
    let suggestion = list && (list.getSelected() || list.getFirst());

    if (suggestion && this._popup && this._popup.isVisible()) {
      e.preventDefault();
      return this.handleComplete(suggestion, true);
    }

    if (this.state.loading) {
      e.preventDefault();
      return false;
    }

    return true;
  }

  handleCaretMove(e) {
    let caret = this.caret.getPosition();
    let popupHidden = (!this._popup || !this._popup.isVisible()) && e.type === 'click';

    if (!this.props.disabled && (caret !== this.immediateState.caret || popupHidden)) {
      this.immediateState.caret = caret;
      this.scrollInput();
      this.requestData();
    }
  }

  handleResponse(params) {
    let deferred = when.defer();

    if ((params.query === this.immediateState.query || this.immediateState.query === undefined) &&
      (params.caret === this.immediateState.caret || this.immediateState.caret === undefined)) {
      deferred.resolve(params.suggestions);

      let state = {
        loading: false,
        placeholderEnabled: !params.query,
        query: params.query
      };

      // Do not update deep equal styleRanges to simplify shouldComponentUpdate check
      if (!deepEquals(this.state.styleRanges, params.styleRanges)) {
        state.styleRanges = params.styleRanges;
      }

      this.setState(state);
    } else {
      deferred.reject(new Error('Current and response queries mismatch'));
    }

    return deferred.promise;
  }

  handleApply() {
    this.closePopup();
    return this.props.onApply(this.immediateState);
  }

  handleComplete(data, replace) {
    if (!data || !data.data) {
      this.handleApply();

      return;
    }

    let currentCaret = this.immediateState.caret;
    let suggestion = data.data;
    let prefix = suggestion.prefix || '';
    let suffix = suggestion.suffix || '';

    let state = {
      caret: suggestion.caret,
      query: this.immediateState.query.substr(0, suggestion.completionStart) + prefix + suggestion.option + suffix
    };

    if (replace) {
      state.query += this.immediateState.query.substr(suggestion.completionEnd);
    } else {
      state.query += this.immediateState.query.substr(this.immediateState.caret);
    }

    this.props.onChange(state);

    let focusState = {focus: true};
    this.props.onFocusChange(focusState);

    if (state.query !== this.immediateState.query) {
      this.setState({
        placeholderEnabled: !state.query,
        query: state.query
      });
    }

    this.immediateState = Object.assign(state, focusState);

    if (this.immediateState.caret !== currentCaret) {
      this.setFocus();
    }

    this.closePopup();
    this.requestData();
  }

  requestStyleRanges() {
    if (!this.immediateState.query) {
      return when.reject(new Error('Query is empty'));
    }

    return this.sendRequest({
      query: this.immediateState.query,
      caret: this.immediateState.caret,
      omitSuggestions: true
    })
      .then(::this.handleResponse)
      .catch(noop);
  }

  requestHandler() {
    if (this.props.disabled) {
      return;
    }

    this.sendRequest(this.immediateState).
      then(::this.handleResponse).
      then(::this.renderPopup).
      catch(noop);
  }

  sendRequest(params) {
    let dataPromise = when(this.props.dataSource(params));

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
  }

  getPopupOffset(suggestions) {
    // First suggestion should be enough?
    let suggestion = suggestions && suggestions[0];

    // Check of suggestion begins not from the end
    let completionStart = suggestion &&
      suggestion.completionStart !== suggestion.completionEnd &&
      suggestion.completionStart;

    let completionStartNode = this.input.firstChild &&
      suggestion.completionStart !== false &&
      suggestion.completionStart != null &&
      this.input.firstChild.childNodes[completionStart];

    let offset = completionStartNode &&
      (completionStartNode.getBoundingClientRect().right - this.input.getBoundingClientRect().left);

    if (!offset) {
      let caret = this.caret.getOffset();

      // Do not compensate caret in the beginning of field
      if (caret === 0) {
        return caret;
      } else {
        offset = caret;
      }
    }

    return offset - POPUP_COMPENSATION;
  }

  // TODO Move to renderLeter and simplify
  getLetterClass(index) {
    let LETTER_CLASS = 'ring-query-assist__letter';

    return this.state.styleRanges &&
      this.state.styleRanges.
        filter(item => item.start <= index && item.start + item.length > index).
        map(item => LETTER_CLASS + '_' + item.style.replace('_', '-')).
        concat(LETTER_CLASS).
        join(' ') ||
      LETTER_CLASS;
  }

  handleCtrlSpace(e) {
    e.preventDefault();

    if (!this._popup || !this._popup.isVisible()) {
      this.requestData();
    }
  }

  trackPopupMouseState(e) {
    this.mouseIsDownOnPopup = e.type === 'mousedown';
  }

  trackInputMouseState(e) {
    this.mouseIsDownOnInput = e.type === 'mousedown';
  }

  renderPopup(suggestions) {
    if (!suggestions.length) {
      this.closePopup();
      return;
    }

    let renderedSuggestions = this.renderSuggestions(suggestions);

    if (!this._popup || !this._popup.isMounted()) {
      this._popup = PopupMenu.render(
        <PopupMenu
          anchorElement={findDOMNode(this)}
          autoRemove={false} // required to prevent popup unmount on Esc
          className={this.props.popupClassName}
          corner={PopupMenu.PopupProps.Corner.BOTTOM_LEFT}
          data={renderedSuggestions}
          hint={this.props.hint}
          hintOnSelection={this.props.hintOnSelection}
          left={this.getPopupOffset(suggestions)}
          maxHeight="screen"
          onMouseDown={::this.trackPopupMouseState}
          onMouseUp={::this.trackPopupMouseState}
          onSelect={::this.handleComplete}
          shortcuts={true}
        />
      );
    } else {
      this._popup.rerender({
        data: renderedSuggestions,
        hint: this.props.hint,
        hintOnSelection: this.props.hintOnSelection,
        left: this.getPopupOffset(suggestions)
      });
      this._popup.show();
    }
  }

  closePopup() {
    if (this._popup) {
      this._popup.close();
    }
  }

  clearQuery() {
    let state = {
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
  }

  renderSuggestions(suggestions) {
    let renderedSuggestions = [];

    suggestions.forEach((suggestion, index, arr) => {
      let prevSuggestion = arr[index - 1] && arr[index - 1].group;

      if (prevSuggestion !== suggestion.group) {

        renderedSuggestions.push({
          key: suggestion.option + suggestion.group + PopupMenu.ListProps.Type.SEPARATOR,
          description: suggestion.group,
          type: PopupMenu.ListProps.Type.SEPARATOR
        });
      }

      let label;
      let option;
      let before = false;
      let after = false;
      if (suggestion.matchingStart !== suggestion.matchingEnd) {
        before = suggestion.option.substring(0, suggestion.matchingStart);
        option = <span className="ring-list__highlight">{suggestion.option.substring(suggestion.matchingStart, suggestion.matchingEnd)}</span>;
        after = suggestion.option.substring(suggestion.matchingEnd);
      } else {
        option = suggestion.option;
      }

      let prefix = !!suggestion.prefix && <span className="ring-list__service">{suggestion.prefix}</span>;
      let suffix = !!suggestion.suffix && <span className="ring-list__service">{suggestion.suffix}</span>;

      label = DOM.span(null, prefix, before, option, after, suffix);

      let item = {
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
  }

  renderLetter(letter, index) {
    // \u00a0 === &nbsp;
    let letterValue = letter === ' ' ? '\u00a0' : letter;
    // Despite warning we don't need key here because of renderToStaticMarkup
    return <span className={this.getLetterClass(index)}>{letterValue}</span>;
  }

  shouldComponentUpdate(props, state) {
    return state.query !== this.state.query ||
      state.loading !== this.state.loading ||
      state.styleRanges !== this.state.styleRanges ||
      state.placeholderEnabled !== this.state.placeholderEnabled ||
      props.placeholder !== this.props.placeholder ||
      props.disabled !== this.props.disabled ||
      props.clear !== this.props.clear ||
      props.glass !== this.props.glass;
  }

  refInput(node) {
    if (!node) {
      return;
    }

    this.input = findDOMNode(node);
    this.caret = new Caret(this.input);
  }

  /** @override */
  render() {
    let renderPlaceholder = !!this.props.placeholder && this.state.placeholderEnabled;
    let renderClear = this.props.clear && !!this.state.query;
    let renderGlass = this.props.glass && !this.state.loading;
    let renderGlassOrLoader = this.props.glass || this.state.loading;

    let inputClasses = classNames({
      'ring-query-assist__input ring-input ring-js-shortcuts': true,
      'ring-query-assist__input_gap': renderGlassOrLoader !== renderClear &&
        (renderGlassOrLoader || renderClear),
      'ring-query-assist__input_double-gap': renderGlassOrLoader && renderClear,
      'ring-input_disabled': this.props.disabled
    });

    // TODO: Move to ContentEditable
    let query = this.state.query && renderToStaticMarkup(
        <span>{this.state.query.split('').map(::this.renderLetter)}</span>
      );

    return (
      <div className="ring-query-assist"
        onMouseDown={::this.trackInputMouseState}
        onMouseUp={::this.trackInputMouseState}
        >
        <ContentEditable
          className={inputClasses}
          ref={::this.refInput}
          disabled={this.props.disabled}
          dangerousHTML={query}
          onComponentUpdate={::this.setFocus}

          onBlur={::this.handleFocusChange}
          onClick={::this.handleCaretMove}
          onFocus={::this.handleFocusChange}
          onInput={::this.handleInput}
          onKeyDown={::this.handleEnter}
          onKeyPress={::this.handleEnter}
          onKeyUp={::this.handleCaretMove}

          spellCheck="false" />

        {renderPlaceholder && <span
          className="ring-query-assist__placeholder"
          onClick={::this.handleCaretMove}>
          {this.props.placeholder}
        </span>}
        {renderGlass && <Icon
          className="ring-query-assist__icon"
          color="gray"
          glyph="search"
          onClick={::this.handleApply}
          size={Icon.Size.Size16} />}
        {this.state.loading && <div
          className="ring-query-assist__icon ring-query-assist__icon_loader">
          <Loader modifier={Loader.Modifier.INLINE} />
        </div>}
        {renderClear && <Icon
          className="ring-query-assist__icon ring-query-assist__icon_clear"
          color="gray"
          glyph="close"
          onClick={::this.clearQuery}
          size={Icon.Size.Size16} />}
      </div>
    );
  }
}
