/**
 * @fileoverview Query Assist
 */

import React, {PropTypes, DOM} from 'react';
import {findDOMNode} from 'react-dom';
import debounce from 'mout/function/debounce';
import deepEquals from 'mout/lang/deepEquals';
import classNames from 'classnames';

import {getRect} from '../dom/dom';
import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import Caret from '../caret/caret';
import ContentEditable from '../contenteditable/contenteditable';
import PopupMenu from '../popup-menu/popup-menu';
import Icon from '../icon/icon';
import LoaderInline from '../loader-inline/loader-inline';

import './query-assist.scss';
import '../input/input.scss';

// Use for IE11 and down to 9
const impotentIE = document.documentMode <= 11;  // TODO Proper browser detection?
const mutationEvent = 'DOMSubtreeModified';

const INPUT_BORDER_WIDTH = 1;
const POPUP_COMPENSATION = INPUT_BORDER_WIDTH +
  PopupMenu.ListProps.Dimension.ITEM_PADDING +
  PopupMenu.PopupProps.Dimension.BORDER_WIDTH;

const ngModelStateField = 'query';

function noop() {}

/**
 * @name QueryAssist
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="QueryAssist">
     <file name="index.html">
       <div id="example">
       </div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var hubConfig = require('ring-ui/site/hub-config');

       var QueryAssist = require('ring-ui/components/query-assist/query-assist');
       var Auth = require('ring-ui/components/auth/auth');

       var log = function(obj) {
         var div = document.createElement('div');
         div.innerHTML = JSON.stringify(obj);
         document.getElementById('example').appendChild(div);
       };

       var auth = new Auth(hubConfig);

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
         <div ng-form="testForm">
           <p>{{ ctrl.query || 'no value' }}</p>
           <p>form is dirty = <strong>{{ testForm.$dirty }}</strong></p>

           <div react="QueryAssist"
                clear="true"
                x-data-source="ctrl.source(query, caret, omitSuggestions)"
                glass="true"
                focus="ctrl.focus"
                ng-model="ctrl.query"
                on-apply="ctrl.save(query)"
                on-change="ctrl.change(query)"
                on-focus-change="ctrl.focusChange(focus)"
                placeholder="{{ placeholder }}"
                hint="{{ 'Press ⇥ to complete first item' }}"
                hint-on-selection="{{ 'Press ↩ to complete selected item' }}"></div>

           <p ng-repeat="query in ctrl.queries track by $index">{{ query }}</p>
         </div>
       </div>
     </file>

     <file name="index.js" webpack="true">
       var hubConfig = require('ring-ui/site/hub-config');

       require('angular');
       require('ring-ui/components/auth-ng/auth-ng');
       require('ring-ui/components/react-ng/react-ng')({
        QueryAssist: require('ring-ui/components/query-assist/query-assist')
       });

       angular.module('test', ['Ring.react-ng', 'Ring.auth'])
         .config(function (authProvider) {
           authProvider.config(hubConfig);
         })
         .controller('testCtrl', function($http, $scope) {
           var ctrl = this;
           ctrl.queries = [];
           ctrl.query = 'query';
           ctrl.focus = true;

           ctrl.save = function(query) {
             ctrl.queries.unshift(query);
             ctrl.query = null;
             $scope.$apply();
             $scope.testForm.$setPristine(true);
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
             console.log('ctrl.change:: Query = ', query);
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

             return $http.get(hubConfig.serverUri + '/api/rest/users/queryAssist', config).
               then(function(data) {
                 return data.data;
               });
           }
         });
     </file>
   </example>
 */
export default class QueryAssist extends RingComponentWithShortcuts {
  static ngModelStateField = ngModelStateField;

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
    loader: PropTypes.bool,
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

  constructor(...props) {
    super(...props);

    this.boundRequestHandler = ::this.requestHandler;
  }

  ngModelStateField = ngModelStateField;

  getShortcutsProps() {
    return {
      map: {
        del: noop,
        enter: ::this.handleComplete,
        'ctrl+space': ::this.handleCtrlSpace,
        tab: ::this.handleTab,
        right: noop,
        left: noop,
        space: noop
      },
      scope: ::this.constructor.getUID('ring-query-assist-')
    };
  }

  // See http://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web
  blurInput() {
    window.getSelection().removeAllRanges();
  }

  didMount() {
    const query = this.props.query || '';

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
      then(() => new Promise(resolve => setTimeout(resolve, 0))).
      then(::this.attachMutationEvents);
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
    if ((this.requestData === this.boundRequestHandler) === Boolean(props.delay)) {
      if (typeof props.delay === 'number') {
        this.requestData = debounce(this.boundRequestHandler, props.delay);
      } else {
        this.requestData = this.boundRequestHandler;
      }
    }
  }

  willUnmount() {
    if (this._popup) {
      this._popup.remove();
    }

    if (impotentIE) {
      this.input.removeEventListener(mutationEvent, ::this.handleInput);
    }
  }

  willReceiveProps(props) {
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
    const queryLength = this.immediateState.query != null && this.immediateState.query.length;
    const newCaretPosition = this.immediateState.caret < queryLength ? this.immediateState.caret : queryLength;
    const currentCaretPosition = this.caret.getPosition({avoidFocus: true});

    if (this.immediateState.focus && !this.props.disabled && currentCaretPosition !== -1) {
      // Set to end of field value if newCaretPosition is inappropriate
      this.caret.setPosition(newCaretPosition >= 0 ? newCaretPosition : -1);
      this.scrollInput();
    }
  }

  scrollInput() {
    const caretOffset = this.caret.getOffset();

    if (this.input.clientWidth !== this.input.scrollWidth && caretOffset > this.input.clientWidth) {
      this.input.scrollLeft = this.input.scrollLeft + caretOffset;
    }
  }

  handleFocusChange(e) {
    // otherwise it's blur and false
    const focus = e.type === 'focus';

    // Track mouse state to avoid focus loss on clicks on icons.
    // Doesn't handle really edge cases like shift+tab while mouse button is pressed.
    if (!this.node || (!focus && this.mouseIsDownOnInput)) {
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

    if (!this.mouseIsDownOnPopup) {
      this.props.onFocusChange({focus: focus});
    }

    this.setShortcutsEnabled(focus);
  }

  handleInput() {
    const props = {
      query: this.input.textContent.replace(/\s/g, ' '),
      caret: this.caret.getPosition(),
      focus: true
    };

    if (this.immediateState.query === props.query) {
      return;
    }

    const currentQueryIsEmpty = this.immediateState.query === '';
    const newQueryIsEmpty = props.query === '';

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
    const list = this._popup && this._popup.refs.List;
    const suggestion = list && (list.getSelected() || list.getFirst());

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
    const caret = this.caret.getPosition();
    const popupHidden = (!this._popup || !this._popup.isVisible()) && e.type === 'click';

    if (!this.props.disabled && (caret !== this.immediateState.caret || popupHidden)) {
      this.immediateState.caret = caret;
      this.scrollInput();
      this.requestData();
    }
  }

  handleResponse(params) {
    return new Promise((resolve, reject) => {
      if ((params.query === this.immediateState.query || this.immediateState.query === undefined) &&
        (params.caret === this.immediateState.caret || this.immediateState.caret === undefined)) {
        resolve(params.suggestions);

        const state = {
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
        reject(new Error('Current and response queries mismatch'));
      }
    });
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

    const currentCaret = this.immediateState.caret;
    const suggestion = data.data;
    const prefix = suggestion.prefix || '';
    const suffix = suggestion.suffix || '';

    const state = {
      caret: suggestion.caret,
      query: this.immediateState.query.substr(0, suggestion.completionStart) + prefix + suggestion.option + suffix
    };

    if (replace) {
      state.query += this.immediateState.query.substr(suggestion.completionEnd);
    } else {
      state.query += this.immediateState.query.substr(this.immediateState.caret);
    }

    this.props.onChange(state);

    const focusState = {focus: true};
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
      return Promise.reject(new Error('Query is empty'));
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
    const value = this.props.dataSource(params);
    const dataPromise = Promise.resolve(value);

    // Close popup after timeout between long requests
    const timeout = window.setTimeout(() => {
      this.setState({
        loading: true
      });

      if (params.query === this.immediateState.query) {
        this.closePopup();
      }
    }, 500);

    dataPromise.then(() => window.clearTimeout(timeout));

    return dataPromise;
  }

  getPopupOffset(suggestions) {
    // First suggestion should be enough?
    const suggestion = suggestions && suggestions[0];

    // Check of suggestion begins not from the end
    const completionStart = suggestion &&
      suggestion.completionStart !== suggestion.completionEnd &&
      suggestion.completionStart;

    const completionStartNode = this.input.firstChild &&
      suggestion.completionStart !== false &&
      suggestion.completionStart != null &&
      this.input.firstChild.childNodes[completionStart];

    let offset = completionStartNode &&
      (getRect(completionStartNode).right - getRect(this.input).left);

    if (!offset) {
      const caret = this.caret.getOffset();

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
    const LETTER_CLASS = 'ring-query-assist__letter';

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
    if (!suggestions.length || !this.node) {
      this.closePopup();
      return;
    }

    const renderedSuggestions = this.renderSuggestions(suggestions);

    if (!this._popup || !this._popup.node) {
      this._popup = PopupMenu.renderPopup(
        <PopupMenu
          anchorElement={this.node}
          autoRemove={false} // required to prevent popup unmount on Esc
          className={this.props.popupClassName}
          directions={[PopupMenu.PopupProps.Directions.BOTTOM_RIGHT, PopupMenu.PopupProps.Directions.TOP_RIGHT]}
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
    const state = {
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
    const renderedSuggestions = [];

    suggestions.forEach((suggestion, index, arr) => {
      const prevSuggestion = arr[index - 1] && arr[index - 1].group;

      if (prevSuggestion !== suggestion.group) {

        renderedSuggestions.push({
          key: suggestion.option + suggestion.group + PopupMenu.ListProps.Type.SEPARATOR,
          description: suggestion.group,
          rgItemType: PopupMenu.ListProps.Type.SEPARATOR
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

      const prefix = !!suggestion.prefix && <span className="ring-list__service">{suggestion.prefix}</span>;
      const suffix = !!suggestion.suffix && <span className="ring-list__service">{suggestion.suffix}</span>;

      label = DOM.span(null, prefix, before, option, after, suffix);

      const item = {
        key: suggestion.prefix + suggestion.option + suggestion.suffix + suggestion.group + suggestion.description,
        label: label,
        rgItemType: PopupMenu.ListProps.Type.ITEM,
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
    const letterValue = letter === ' ' ? '\u00a0' : letter;
    // Despite warning we don't need key here because of renderToStaticMarkup
    return (
      <span
        className={this.getLetterClass(index)}
        key={index + letter}
      >{letterValue}</span>
    );
  }

  shouldUpdate(props, state) {
    return state.query !== this.state.query ||
      state.loading !== this.state.loading ||
      state.styleRanges !== this.state.styleRanges ||
      state.placeholderEnabled !== this.state.placeholderEnabled ||
      props.placeholder !== this.props.placeholder ||
      props.disabled !== this.props.disabled ||
      props.clear !== this.props.clear ||
      props.loader !== this.props.loader ||
      props.glass !== this.props.glass;
  }

  refInput(node) {
    if (!node) {
      return;
    }

    this.input = findDOMNode(node);
    this.caret = new Caret(this.input);
  }

  render() {
    const renderPlaceholder = !!this.props.placeholder && this.state.placeholderEnabled;
    const renderClear = this.props.clear && !!this.state.query;
    const renderLoader = this.props.loader !== false && this.state.loading;
    const renderGlass = this.props.glass && !renderLoader;
    const renderGlassOrLoader = this.props.glass || renderLoader;

    const inputClasses = classNames({
      'ring-query-assist__input ring-input ring-js-shortcuts': true,
      'ring-query-assist__input_gap': renderGlassOrLoader !== renderClear &&
        (renderGlassOrLoader || renderClear),
      'ring-query-assist__input_double-gap': renderGlassOrLoader && renderClear,
      'ring-input_disabled': this.props.disabled
    });

    return (
      <div
        className="ring-query-assist"
        onMouseDown={::this.trackInputMouseState}
        onMouseUp={::this.trackInputMouseState}
      >
        <ContentEditable
          className={inputClasses}
          ref={::this.refInput}
          disabled={this.props.disabled}
          onComponentUpdate={::this.setFocus}

          onBlur={::this.handleFocusChange}
          onClick={::this.handleCaretMove}
          onFocus={::this.handleFocusChange}
          onInput={::this.handleInput}
          onKeyDown={::this.handleEnter}
          onKeyPress={::this.handleEnter}
          onKeyUp={::this.handleCaretMove}

          spellCheck="false"
        >{this.state.query && <span>{this.state.query.split('').map(::this.renderLetter)}</span>}</ContentEditable>

        {renderPlaceholder &&
        <span
          className="ring-query-assist__placeholder"
          ref="placeholder"
          onClick={::this.handleCaretMove}
        >
          {this.props.placeholder}
        </span>}
        {renderGlass &&
        <Icon
          className="ring-query-assist__icon"
          ref="glass"
          color="gray"
          glyph={require('jetbrains-icons/search.svg')}
          onClick={::this.handleApply}
          size={Icon.Size.Size16}
        />}
        {renderLoader &&
        <div
          className="ring-query-assist__icon ring-query-assist__icon_loader"
          ref="loader"
        >
          <LoaderInline/>
        </div>}
        {renderClear &&
        <Icon
          className="ring-query-assist__icon ring-query-assist__icon_clear"
          ref="clear"
          color="gray"
          glyph={require('jetbrains-icons/close.svg')}
          onClick={::this.clearQuery}
          size={Icon.Size.Size16}
        />}
      </div>
    );
  }
}
