import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import debounce from 'mout/function/debounce';
import deepEquals from 'mout/lang/deepEquals';
import classNames from 'classnames';
import searchIcon from 'jetbrains-icons/search.svg';
import closeIcon from 'jetbrains-icons/close.svg';

import getUID from '../global/get-uid';
import {getRect, preventDefault} from '../global/dom';
import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import Caret from '../caret/caret';
import ContentEditable from '../contenteditable/contenteditable';
import PopupMenu from '../popup-menu/popup-menu';
import Icon from '../icon/icon';
import LoaderInline from '../loader-inline/loader-inline';

import './query-assist.scss';
import '../input-legacy/input-legacy.scss';

const POPUP_COMPENSATION = PopupMenu.ListProps.Dimension.ITEM_PADDING +
  PopupMenu.PopupProps.Dimension.BORDER_WIDTH;

const ngModelStateField = 'query';
const ICON_ID_LENGTH = 44;

function noop() {}

function cleanText(text) {
  return text.trim().replace(/([\n\r])+/g, ' ');
}

/**
 * @name Query Assist
 * @constructor
 * @category Components
 * @extends {ReactComponent}
 * @example-file ./query-assist.examples.html
 * @description
 *
 ## Component params

 __autoOpen__ `bool=false` Open suggestions popup during the initial render\
 __caret__ `number=query.length` Initial caret position\
 __clear__ `bool=false` Show clickable "cross" icon on the right which clears the query\
 __className__ `string=''` Additional class for the component\
 __popupClassName__ `string=''` Additional class for the popup\
 __dataSource__ `func` Data source function\
 __delay__ `number=0` Input debounce delay\
 __disabled__ `bool=false` Disable the component\
 __focus__ `bool=false` Initial focus\
 __hint__ `string=''` Hint under the suggestions list\
 __hintOnSelection__ `string=''` Hint under the suggestions list visible when a suggestion is selected\
 __glass__ `bool=false` Show clickable "glass" icon on the right which applies the query\
 __loader__ `bool=false` Show loader when a data request is in process\
 __placeholder__ `string=''` Field placeholder value\
 __onApply__ `func=` Called when the query is applied. An object with fields `caret`, `focus` and `query` is passed as an argument\
 __onChange__ `func=`  Called when the query is changed. An object with fields `caret` and `query` is passed as an argument\
 __onClear__ `func=` Called when the query is cleared. Called without arguments\
 __onFocusChange__ `func` Called when the focus status is changed. An object with fields `focus` is passed as an argument\
 __shortcuts__ `bool=true` Enable shortcut\
 __query__ `string=''` Initial query

 ## Data source function

 Component class calls a data source function when user input happens and passes an object with fields `caret`, `focus` and `query` as the only argument.
 The function must return an object with the fields described below. The object can be optionally wrapped in a Promise.

 ### return object fields

 `caret` and `query` should just return server values provided to data source function.
 These fields allow the Query Assist component to recognise and drop earlier responses from the server.

 __caret__ (`string=0`) Caret from request\
 __query__ (`string=''`) Query from request\
 __styleRanges__ (`Array<suggestion>=`) Array of `styleRange` objects, used to highlight the request in the input field\
 __suggestions__ (`Array<styleRange>`) Array of `suggestion` objects to show.

 ### `styleRange` object fields

 start `number` Range start (in characters)\
 length `number` Range length (in characters)\
 style `string` Style of the range. Possible values: `text`, `field_value`, `field_name`, `operator`

 ### `suggestion` object fields

 __prefix__ `string=` Suggestion option prefix\
 __option__ `string` Suggestion option\
 __suffix__ `string=` Suggestion option suffix\
 __description__ `string=` Suggestion option description. Is not visible when a group is set\
 __matchingStart__ `number` (required when matchingEnd is set) Start of the highlighted part of an option in the suggestions list (in characters)\
 __matchingEnd__ `number` (required when matchingEnd is set) End of the highlighted part of an option in the suggestions list (in characters)\
 __caret__ `number` Caret position after option completion (in characters)\
 __completionStart__ `number` Where to start insertion (or replacement, when completing with the `Tab` key) of the completion option (in characters)\
 __completionEnd__ `number` Where to end insertion of the completion option (in characters)\
 __group__ `string=` Group title. Options with the same title are grouped under it\
 __icon__ `string=` Icon URI, Data URI is possible

 */
export default class QueryAssist extends RingComponentWithShortcuts {
  static ngModelStateField = ngModelStateField;

  static propTypes = {
    autoOpen: PropTypes.bool,
    caret: PropTypes.number,
    clear: PropTypes.bool,
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
    dirty: !this.props.query,
    query: this.props.query,
    placeholderEnabled: !this.props.query,
    shortcuts: true,
    suggestions: [],
    showPopup: false
  };

  ngModelStateField = ngModelStateField;

  getShortcutsProps() {
    return {
      map: {
        del: noop,
        enter: this.handleComplete,
        'command+enter': this.handleComplete,
        'ctrl+enter': this.handleComplete,
        'ctrl+space': this.handleCtrlSpace,
        tab: this.handleTab,
        right: noop,
        left: noop,
        space: noop,
        home: noop,
        end: noop
      },
      scope: getUID('ring-query-assist-')
    };
  }

  // See http://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web
  blurInput() {
    window.getSelection().removeAllRanges();
  }

  didMount() {
    const query = this.props.query || '';

    this.immediateState = {
      query,
      caret: Number.isFinite(this.props.caret) ? this.props.caret : query.length,
      focus: Boolean(this.props.autoOpen || this.props.focus)
    };

    this.setupRequestHandler(this.props.delay);
    this.setShortcutsEnabled(this.props.focus);

    if (this.props.autoOpen) {
      this.requestHandler().
        catch(noop).
        then(this.setCaretPosition);
    } else {
      this.requestStyleRanges().catch(noop);
    }

    this.setCaretPosition();
  }

  /**
   * Optionally setup data request delay. For each component create a separate
   * instance of the delayed function. This may help reduce the load on the server
   * when the user quickly inputs data.
   */
  setupRequestHandler(delay) {
    const needDelay = typeof delay === 'number';
    const hasDelay = this.requestData !== this.requestHandler;

    if (!this.requestData || hasDelay !== needDelay) {
      if (needDelay) {
        this.requestData = debounce(this.requestHandler, delay);
      } else {
        this.requestData = this.requestHandler;
      }
    }
  }

  willReceiveProps({caret, delay, query}) {
    this.setupRequestHandler(delay);
    const shouldSetCaret = typeof caret === 'number';

    if (shouldSetCaret) {
      this.immediateState.caret = caret;
    }

    if (typeof query === 'string' && query !== this.immediateState.query) {
      this.immediateState.query = query;
      let callback = noop;

      if (query && this.props.autoOpen) {
        callback = this.requestData;
      } else if (query) {
        callback = this.requestStyleRanges;
      }

      this.setState({query, placeholderEnabled: !query}, callback);
    }
  }

  didUpdate(prevProps) {
    this.updateFocus(prevProps);
  }

  componentWillUpdate() {}

  updateFocus({focus, caret}) {
    const isCaretChanged = caret !== this.props.caret;
    const isFocusChanged = focus !== this.props.focus;

    if (isFocusChanged || isCaretChanged) {
      const focusValue = isFocusChanged ? this.props.focus : true;
      this.setFocus(focusValue);
    }
  }

  setFocus(focus) {
    this.setShortcutsEnabled(focus);

    const isComponentFocused = Boolean(this.immediateState.focus);

    if (focus === false && isComponentFocused) {
      this.immediateState.focus = focus;
      this.blurInput();
    } else if (focus === true && !isComponentFocused) {
      this.immediateState.focus = focus;
      this.setCaretPosition();
    }
  }

  setCaretPosition = () => {
    const queryLength = this.immediateState.query != null && this.immediateState.query.length;
    const newCaretPosition =
      this.immediateState.caret < queryLength
        ? this.immediateState.caret
        : queryLength;
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

  handleFocusChange = e => {
    // otherwise it's blur and false
    const focus = e.type === 'focus';
    this.immediateState.focus = focus;

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
      this.setCaretPosition();
    }

    if (!this.mouseIsDownOnPopup) {
      this.props.onFocusChange({focus});
    }

    this.setShortcutsEnabled(focus);
  }

  getQuery() {
    return this.input.textContent.replace(/\s/g, ' ');
  }

  togglePlaceholder = () => {
    const query = this.getQuery();
    const currentQueryIsEmpty = this.immediateState.query === '';
    const newQueryIsEmpty = query === '';

    if (newQueryIsEmpty !== currentQueryIsEmpty) {
      this.setState({placeholderEnabled: newQueryIsEmpty});
    }
  }

  // To hide placeholder as quickly as possible, does not work in IE/Edge
  handleInput = () => {
    this.togglePlaceholder();
  }

  handleKeyUp = e => {
    const props = {
      dirty: true,
      query: this.getQuery(),
      caret: this.caret.getPosition(),
      focus: true
    };

    if (this.immediateState.query === props.query && !this.isComposing) {
      this.handleCaretMove(e);
      return;
    }

    this.togglePlaceholder();

    if (this.isComposing) {
      return;
    }

    this.immediateState = props;
    this.props.onChange(props);
    this.requestData();
  }

  // It's necessary to prevent new element creation before any other hooks
  handleEnter = e => {
    if (e.key === 'Enter') {
      preventDefault(e);
    }
  }

  handleTab = e => {
    const list = this._popup && this._popup.list;
    const suggestion = list && (list.getSelected() || list.getFirst());

    if (suggestion && this.state.showPopup) {
      preventDefault(e);

      if (this.getQuery() !== this.immediateState.suggestionsQuery) {
        return false;
      }

      return this.handleComplete(suggestion, true);
    }

    if (this.state.loading) {
      preventDefault(e);
      return false;
    }

    return true;
  }

  handlePaste(e) {
    const INSERT_COMMAND = 'insertText';
    if (e.clipboardData && document.queryCommandSupported(INSERT_COMMAND)) {
      preventDefault(e);
      const text = cleanText(e.clipboardData.getData('text/plain'));
      document.execCommand(INSERT_COMMAND, false, text);
    }
  }

  handleCaretMove = e => {
    if (this.isComposing) {
      return;
    }

    const caret = this.caret.getPosition();
    const popupHidden = (!this.state.showPopup) && e.type === 'click';

    if (!this.props.disabled && (caret !== this.immediateState.caret || popupHidden)) {
      this.immediateState.caret = caret;
      this.scrollInput();
      this.requestData();
    }
  }

  // eslint-disable-next-line no-unused-vars
  handleStyleRangesResponse = ({suggestions, ...restProps}) => this.handleResponse(restProps);

  // eslint-disable-next-line max-len
  handleResponse = ({query = '', caret = 0, styleRanges, suggestions = []}) => new Promise((resolve, reject) => {
    if (
      query === this.getQuery() &&
      (caret === this.immediateState.caret ||
      this.immediateState.caret === undefined)
    ) {
      // Do not setState on unmounted component
      if (!this.node) {
        return;
      }

      const state = {
        dirty: this.immediateState.dirty,
        loading: false,
        placeholderEnabled: !query,
        query,
        suggestions,
        showPopup: !!suggestions.length
      };

      this.immediateState.suggestionsQuery = query;

      // Do not update deep equal styleRanges to simplify shouldComponentUpdate check
      if (!deepEquals(this.state.styleRanges, styleRanges)) {
        state.styleRanges = styleRanges;
      }

      this.setState(state, resolve);
    } else {
      reject(new Error('Current and response queries mismatch'));
    }
  });

  handleApply = () => {
    this.closePopup();
    this.immediateState.dirty = false;
    // Only set dirty to false when query is saved already
    if (this.immediateState.query === this.state.query) {
      this.setState({dirty: false});
    }
    return this.props.onApply(this.immediateState);
  }

  handleComplete = (data, replace) => {
    if (!data || !data.data) {
      this.handleApply();

      return;
    }

    const query = this.getQuery();
    const currentCaret = this.immediateState.caret;
    const suggestion = data.data;
    const prefix = suggestion.prefix || '';
    const suffix = suggestion.suffix || '';

    const state = {
      caret: suggestion.caret,
      query: query.substr(0, suggestion.completionStart) + prefix + suggestion.option + suffix
    };

    if (typeof replace === 'boolean' && replace) {
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
      this.setCaretPosition();
    }

    this.closePopup();
    this.requestData();
  }

  requestStyleRanges = () => {
    const {query, caret} = this.immediateState;

    if (!query) {
      return Promise.reject(new Error('Query is empty'));
    }

    return this.sendRequest({query, caret, omitSuggestions: true}).
      then(this.handleStyleRangesResponse).
      catch(noop);
  }

  requestHandler = () => {
    if (this.props.disabled) {
      return Promise.reject(new Error('QueryAssist(ring-ui): null exception'));
    }

    const {query, caret} = this.immediateState;

    return this.sendRequest({query, caret}).
      then(this.handleResponse).
      catch(noop);
  }

  sendRequest(params) {
    const value = this.props.dataSource(params);
    const dataPromise = Promise.resolve(value);
    const CLOSE_POPUP_TIMEOUT = 500;

    // Close popup after timeout between long requests
    const timeout = window.setTimeout(() => {
      if (this.node) {
        this.setState({
          loading: true
        });
      }

      if (params.query === this.immediateState.query) {
        this.closePopup();
      }
    }, CLOSE_POPUP_TIMEOUT);

    dataPromise.then(() => window.clearTimeout(timeout));

    return dataPromise;
  }

  getPopupOffset(suggestions) {
    if (!this.input) {
      return 0;
    }

    // First suggestion should be enough?
    const suggestion = suggestions && suggestions[0];

    // Check if suggestion begins not from the end
    const completionStart = suggestion &&
      suggestion.completionStart !== suggestion.completionEnd &&
      suggestion.completionStart;

    const inputChildren = this.input.firstChild && this.input.firstChild.children;
    const completionStartNode = inputChildren &&
      Number.isInteger(completionStart) &&
      inputChildren[Math.min(completionStart, inputChildren.length - 1)];

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

  handleCtrlSpace = e => {
    preventDefault(e);

    if (!this.state.showPopup) {
      this.requestData();
    }
  }

  trackPopupMouseState = e => {
    this.mouseIsDownOnPopup = e.type === 'mousedown';
  }

  trackInputMouseState = e => {
    this.mouseIsDownOnInput = e.type === 'mousedown';
  }

  trackCompostionState = e => {
    this.isComposing = e.type !== 'compositionend';
  }

  closePopup = () => {
    if (this.node) {
      this.setState({showPopup: false});
    }
  }

  clearQuery = () => {
    const state = {
      dirty: false,
      caret: 0,
      query: '',
      focus: true
    };

    this.props.onChange(state);
    this.props.onClear();

    this.immediateState = state;
    this.setState({
      dirty: false,
      query: '',
      placeholderEnabled: true,
      loading: false
    });
  }

  renderSuggestions() {
    const renderedSuggestions = [];
    const {suggestions} = this.state;

    suggestions.forEach((suggestion, index, arr) => {
      const {ITEM, SEPARATOR} = PopupMenu.ListProps.Type;
      const {
        className,
        description,
        group,
        icon,
        matchingStart,
        matchingEnd,
        option,
        prefix = '',
        suffix = ''
      } = suggestion;
      const prevSuggestion = arr[index - 1] && arr[index - 1].group;
      const key = prefix + option + suffix + group + description +
        (icon ? icon.substring(icon.length - ICON_ID_LENGTH) : '');

      if (prevSuggestion !== group) {
        renderedSuggestions.push({
          key: option + group + SEPARATOR,
          description: group,
          rgItemType: SEPARATOR
        });
      }

      let wrappedOption;
      let before = '';
      let after = '';

      if (matchingStart !== matchingEnd) {
        before = option.substring(0, matchingStart);
        wrappedOption = (
          <span className="ring-query-assist__highlight">
            {option.substring(matchingStart, matchingEnd)}
          </span>
        );
        after = option.substring(matchingEnd);
      } else {
        wrappedOption = option;
      }

      const wrappedPrefix = prefix && <span className="ring-query-assist__service">{prefix}</span>;
      const wrappedSuffix = suffix && <span className="ring-query-assist__service">{suffix}</span>;

      const label = (
        <span className={className}>
          {wrappedPrefix}{before}{wrappedOption}{after}{wrappedSuffix}
        </span>
      );

      renderedSuggestions.push({
        key,
        icon,
        label,
        description,
        rgItemType: ITEM,
        data: suggestion
      });
    });

    return renderedSuggestions;
  }

  renderQuery() {
    const {dirty, styleRanges, query} = this.state;
    const classes = [];
    const LETTER_CLASS = 'ring-query-assist__letter';
    const LETTER_DEFAULT_CLASS = `${LETTER_CLASS}_default`;

    if (styleRanges && styleRanges.length) {
      styleRanges.forEach((item, index) => {
        if (dirty && index === styleRanges.length - 1 && item.style === 'text') {
          return;
        }
        const className = `${LETTER_CLASS}_${item.style.replace('_', '-')}`;

        for (let i = item.start; i < item.start + item.length; i++) {
          classes[i] = className;
        }
      });
    }

    return [...query].map((letter, index, letters) => {
      const className = classNames(LETTER_CLASS, classes[index] || LETTER_DEFAULT_CLASS);

      const dataTest = (letters.length - 1 === index)
        ? 'ring-query-assist-last-letter'
        : null;

      // \u00a0 === &nbsp;
      return (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={index + letter}
          className={className}
          data-test={dataTest}
        >{letter === ' ' ? '\u00a0' : letter}</span>
      );
    });
  }

  shouldUpdate(props, state) {
    return state.query !== this.state.query ||
      state.dirty !== this.state.dirty ||
      state.loading !== this.state.loading ||
      state.showPopup !== this.state.showPopup ||
      state.suggestions !== this.state.suggestions ||
      state.styleRanges !== this.state.styleRanges ||
      state.placeholderEnabled !== this.state.placeholderEnabled ||
      props.placeholder !== this.props.placeholder ||
      props.disabled !== this.props.disabled ||
      props.clear !== this.props.clear ||
      props.focus !== this.props.focus ||
      props.loader !== this.props.loader ||
      props.glass !== this.props.glass;
  }

  inputRef = node => {
    if (!node) {
      return;
    }

    this.input = findDOMNode(node);
    this.caret = new Caret(this.input);
  }

  popupRef = node => {
    this._popup = node;
  }

  placeholderRef = node => {
    this.placeholder = node;
  }

  glassRef = node => {
    this.glass = node;
  }

  loaderRef = node => {
    this.loader = node;
  }

  clearRef = node => {
    this.clear = node;
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
        onMouseDown={this.trackInputMouseState}
        onMouseUp={this.trackInputMouseState}
      >
        <ContentEditable
          className={inputClasses}
          data-test="ring-query-assist-input"
          ref={this.inputRef}
          disabled={this.props.disabled}
          onComponentUpdate={this.setCaretPosition}

          onBlur={this.handleFocusChange}
          onClick={this.handleCaretMove}
          onCompositionStart={this.trackCompostionState}
          onCompositionEnd={this.trackCompostionState}
          onFocus={this.handleFocusChange}
          onInput={this.handleInput}
          onKeyDown={this.handleEnter}
          onKeyUp={this.handleKeyUp}
          onPaste={this.handlePaste}

          spellCheck="false"
        >{this.state.query && <span>{this.renderQuery()}</span>}</ContentEditable>

        {renderPlaceholder && (
          <span
            className="ring-query-assist__placeholder"
            ref={this.placeholderRef}
            onClick={this.handleCaretMove}
          >
            {this.props.placeholder}
          </span>
        )}
        {renderGlass && (
          <Icon
            className="ring-query-assist__icon ring-query-assist__icon_glass"
            ref={this.glassRef}
            color="gray"
            glyph={searchIcon}
            onClick={this.handleApply}
            size={Icon.Size.Size16}
          />
        )}
        {renderLoader && (
          <div
            className="ring-query-assist__icon ring-query-assist__icon_loader"
            ref={this.loaderRef}
          >
            <LoaderInline/>
          </div>
        )}
        {renderClear && (
          <Icon
            className="ring-query-assist__icon ring-query-assist__icon_clear"
            ref={this.clearRef}
            color="gray"
            glyph={closeIcon}
            onClick={this.clearQuery}
            size={Icon.Size.Size16}
          />
        )}
        <PopupMenu
          hidden={!this.state.showPopup}
          onCloseAttempt={this.closePopup}
          ref={this.popupRef}
          anchorElement={this.node}
          keepMounted={true}
          attached={true}
          className={this.props.popupClassName}
          directions={[PopupMenu.PopupProps.Directions.BOTTOM_RIGHT]}
          data={this.renderSuggestions()}
          data-test="ring-query-assist-popup"
          hint={this.props.hint}
          hintOnSelection={this.props.hintOnSelection}
          left={this.getPopupOffset(this.state.suggestions)}
          maxHeight={PopupMenu.PopupProps.MaxHeight.SCREEN}
          onMouseDown={this.trackPopupMouseState}
          onMouseUp={this.trackPopupMouseState}
          onSelect={this.handleComplete}
        />
      </div>
    );
  }
}
