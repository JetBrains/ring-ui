import {Component, ComponentRef, ReactNode, SyntheticEvent} from 'react';
import * as React from 'react';
import debounce from 'just-debounce-it';
import classNames from 'classnames';
import deepEqual from 'deep-equal';
import searchIcon from '@jetbrains/icons/search';
import closeIcon from '@jetbrains/icons/close-12px';

import getUID from '../global/get-uid';
import dataTests from '../global/data-tests';
import {getRect, preventDefault} from '../global/dom';
import Caret, {Position} from '../caret/caret';
import ContentEditable from '../contenteditable/contenteditable';
import PopupMenu from '../popup-menu/popup-menu';
import LoaderInline from '../loader-inline/loader-inline';
import Shortcuts from '../shortcuts/shortcuts';
import rerenderHOC from '../global/rerender-hoc';
import Button from '../button/button';
import Icon from '../icon/icon';
import {ControlsHeight, ControlsHeightContext} from '../global/controls-height';
import {Size} from '../input/input';
import {ShortcutsMap} from '../shortcuts/core';

import inputStyles from '../input/input.css';

import {I18nContext} from '../i18n/i18n-context';

import QueryAssistSuggestions, {
  QueryAssistSuggestion,
  SuggestionItem
} from './query-assist__suggestions';

import styles from './query-assist.css';

const POPUP_COMPENSATION = PopupMenu.ListProps.Dimension.ITEM_PADDING +
  PopupMenu.PopupProps.Dimension.BORDER_WIDTH;

const ngModelStateField = 'query';

function noop() {}

function cleanText(text: string) {
  return text.replace(/([\n\r])+/g, ' ');
}

export interface QueryAssistTranslations {
  searchTitle: string
  clearTitle: string
}

export interface FocusChange {
  focus: boolean
}

export interface QueryAssistChange {
  query: string
  prevCaret?: number | null;
  caret: number
  focus?: boolean
  selection?: Position | number | null
  dirty?: boolean
  suggestionsQuery?: string
}

export interface QueryAssistResponse {
  query?: string | undefined
  caret?: number | undefined
  styleRanges?: readonly StyleRange[] | undefined
  suggestions?: readonly QueryAssistSuggestion[] | undefined
}

export interface QueryAssistRequestParams {
  query: string
  caret: number
  omitSuggestions?: boolean
}

export interface QueryAssistProps {
  /**
   * Called when the query is applied. An object with fields `caret`, `focus` and `query` is passed as an argument
   */
  onApply: (change: QueryAssistChange) => void
  /**
   * Called when the query is changed. An object with fields `caret` and `query` is passed as an argument
   */
  onChange: (change: QueryAssistChange) => void
  /**
   * Called when the suggestion is applied
   */
  onApplySuggestion: (suggestion: QueryAssistSuggestion, change: QueryAssistChange) => void
  /**
   * Called when the query is cleared. Called without arguments
   */
  onClear: () => void
  /**
   * Called when the focus status is changed. An object with fields `focus` is passed as an argument
   */
  onFocusChange: (change: FocusChange) => void
  translations?: QueryAssistTranslations | null | undefined
  /**
   * Open suggestions popup during the initial render
   */
  autoOpen?: boolean | null | undefined | 'force'
  /**
   * Initial caret position
   */
  caret?: number | null | undefined
  /**
   * Show clickable "cross" icon on the right which clears the query
   */
  clear?: boolean | null | undefined
  /**
   * Additional class for the component
   */
  className?: string | null | undefined
  /**
   * Additional class for the popup
   */
  popupClassName?: string | null | undefined
  /**
   * Additional class for the input
   */
  inputClassName?: string | null | undefined
  /**
   * Data source function
   */
  dataSource: (params: QueryAssistRequestParams) => Promise<QueryAssistResponse> |
    QueryAssistResponse
  /**
   * Input debounce delay
   */
  delay?: number | null | undefined
  /**
   * Disable the component
   */
  disabled?: boolean | undefined
  /**
   * Initial focus
   */
  focus?: boolean | null | undefined
  /**
   * Hint under the suggestions list
   */
  hint?: string | null | undefined
  /**
   * Hint under the suggestions list visible when a suggestion is selected
   */
  hintOnSelection?: string | null | undefined
  /**
   * Show clickable "glass" icon on the right which applies the query
   */
  glass?: boolean | null | undefined
  /**
   * Show loader when a data request is in process
   */
  loader?: boolean | null | undefined
  /**
   * Field placeholder value
   */
  placeholder?: string | null | undefined
  /**
   * Initial query
   */
  query?: string | null | undefined
  useCustomItemRender?: boolean | null | undefined
  actions?: ReactNode[] | null | undefined
  'data-test'?: string | null | undefined
  huge?: boolean | null | undefined
  size: Size
}

export interface StyleRange {
  style: string
  start: number
  length: number
}

interface QueryAssistState {
  dirty: boolean | undefined
  query: string | null | undefined
  placeholderEnabled: boolean
  shortcuts?: boolean
  suggestions: readonly QueryAssistSuggestion[]
  showPopup: boolean
  prevQuery?: string | null | undefined
  loading?: boolean
  styleRanges?: readonly StyleRange[]
}

interface CaretPositionParams {
  fromContentEditable?: boolean | null | undefined
  forceSetCaret?: boolean | null | undefined
}

interface HistoryEntry {
  query: string | null | undefined
  caret: Position | number
}

/**
 * @name Query Assist
 */
/**
 * ## Data source function

 Component class calls a data source function when user input happens and passes an object with fields \`caret\`, \`focus\` and \`query\` as the only argument.
 The function must return an object with the fields described below. The object can be optionally wrapped in a Promise.

 ### Return object fields

 \`caret\` and \`query\` should just return server values provided to data source function.
 These fields allow the Query Assist component to recognise and drop earlier responses from the server.

 + __caret__ (\`string=0\`) Caret from request
 + __query__ (\`string=''\`) Query from request
 + __styleRanges__ (\`Array<suggestion>=\`) Array of \`styleRange\` objects, used to highlight the request in the input field
 + __suggestions__ (\`Array<styleRange>\`) Array of \`suggestion\` objects to show.

 ### **styleRange** object fields

 start \`number\` Range start (in characters)
 length \`number\` Range length (in characters)
 style \`string\` Style of the range. Possible values: \`text\`, \`field_value\`, \`field_name\`, \`operator\`

 ### **suggestion** object fields

 + __prefix__ \`string=\` Suggestion option prefix
 + __option__ \`string\` Suggestion option
 + __suffix__ \`string=\` Suggestion option suffix
 + __description__ \`string=\` Suggestion option description. Is not visible when a group is set
 + __matchingStart__ \`number\` (required when matchingEnd is set) Start of the highlighted part of an option in the suggestions list (in characters)
 + __matchingEnd__ \`number\` (required when matchingEnd is set) End of the highlighted part of an option in the suggestions list (in characters)
 + __caret__ \`number\` Caret position after option completion (in characters)
 + __completionStart__ \`number\` Where to start insertion (or replacement, when completing with the \`Tab\` key) of the completion option (in characters)
 + __completionEnd__ \`number\` Where to end insertion of the completion option (in characters)
 + __group__ \`string=\` Group title. Options with the same title are grouped under it
 + __icon__ \`string=\` Icon URI, Data URI is possible
 */
export default class QueryAssist extends Component<QueryAssistProps> {
  static defaultProps = {
    onApply: noop,
    onChange: noop,
    onApplySuggestion: noop,
    onClear: noop,
    onFocusChange: noop,
    size: Size.L
  };

  static getDerivedStateFromProps({query}: QueryAssistProps, {prevQuery}: QueryAssistState) {
    const nextState: Partial<QueryAssistState> = {prevQuery: query};
    if (typeof query === 'string' && query !== prevQuery) {
      nextState.query = query;
      nextState.placeholderEnabled = !query;
    }
    return nextState;
  }

  constructor(props: QueryAssistProps) {
    super(props);

    const query = props.query || '';

    this.immediateState = {
      query,
      caret: typeof props.caret === 'number' && Number.isFinite(props.caret)
        ? props.caret
        : query.length,
      focus: Boolean(props.autoOpen || props.focus)
    };
  }

  state: QueryAssistState = {
    dirty: !this.props.query,
    query: this.props.query,
    placeholderEnabled: !this.props.query,
    shortcuts: !!this.props.focus,
    suggestions: [],
    showPopup: false
  };

  componentDidMount() {
    const query = this.props.query || '';

    this.immediateState = {
      query,
      caret: typeof this.props.caret === 'number' && Number.isFinite(this.props.caret)
        ? this.props.caret
        : query.length,
      focus: Boolean(this.props.autoOpen || this.props.focus)
    };

    this.setupRequestHandler(this.props.delay);

    if (this.props.autoOpen === 'force' || this.props.autoOpen && query.length > 0) {
      this.requestHandler().
        catch(noop);
    } else {
      this.requestStyleRanges().catch(noop);
    }

    this.setCaretPosition();
    this._pushHistory(this.state);
  }

  shouldComponentUpdate(props: QueryAssistProps, state: QueryAssistState) {
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
      props.actions !== this.props.actions ||
      props.loader !== this.props.loader ||
      props.glass !== this.props.glass;
  }

  componentDidUpdate(prevProps: QueryAssistProps) {
    const {caret, delay, query} = this.props;
    const queryChanged = query !== prevProps.query;

    this.updateFocus(prevProps);
    this.setupRequestHandler(delay);

    const shouldSetCaret = typeof caret === 'number' && caret !== prevProps.caret;
    if (shouldSetCaret) {
      this.immediateState.prevCaret = prevProps.caret;
      this.immediateState.caret = caret;
    }

    if (typeof query === 'string' && queryChanged && query !== this.immediateState.query) {
      this.immediateState.query = query;

      if (query && (this.props.autoOpen === 'force' || prevProps.autoOpen && query.length > 0)) {
        this.requestData?.();
      } else if (query) {
        this.requestStyleRanges();
      }
    }
  }

  static ngModelStateField = ngModelStateField;

  immediateState: QueryAssistChange;
  requestData?: (afterCompletion?: boolean) => void;
  ngModelStateField = ngModelStateField;
  // An array of {query: string; caret: number}[]
  historyStack: HistoryEntry[] = [];
  mouseIsDownOnPopup?: boolean;

  handleFocusChange = (e: SyntheticEvent) => {
    // otherwise it's blur and false
    const focus = e.type === 'focus';
    this.immediateState.focus = focus;

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

    this.setState({shortcuts: focus});
  };

  node?: HTMLElement | null;
  nodeRef = (node: HTMLElement | null) => {
    this.node = node;
  };

  updateFocus({focus, caret}: QueryAssistProps) {
    const isCaretChanged = caret !== this.props.caret;
    const isFocusChanged = focus !== this.props.focus;

    if (isFocusChanged || isCaretChanged) {
      const focusValue = isFocusChanged ? this.props.focus : true;
      this.setFocus(focusValue);
    }
  }

  setCaretPosition = (params: CaretPositionParams = {}) => {
    const queryLength = this.immediateState.query != null ? this.immediateState.query.length : 0;
    const newCaretPosition =
       this.immediateState.caret < queryLength
         ? this.immediateState.caret
         : queryLength;
    if (params.fromContentEditable) {
      this.immediateState.selection = this.immediateState.selection
        ? this.immediateState.selection
        : this.state.query && this.state.query.length || null;
    }
    if (this.immediateState.focus && !this.props.disabled) {
      if (typeof this.immediateState.selection === 'number' &&
        Number.isInteger(this.immediateState.selection) && this.immediateState.selection > -1) {
        // Set to end of field value if newCaretPosition is inappropriate
        this.caret?.setPosition(newCaretPosition >= 0 ? newCaretPosition : -1);
        this.scrollInput();
      } else if (this.immediateState.selection &&
        typeof this.immediateState.selection === 'object' &&
        this.immediateState.selection.startOffset !== undefined) {
        this.caret?.setPosition(this.immediateState.selection);
      } else if (this.immediateState.selection === undefined || params.forceSetCaret) {
        this.caret?.setPosition(-1);
      }
    }
  };

  scrollInput() {
    const caretOffset = this.caret?.getOffset();

    if (this.input?.clientWidth !== this.input?.scrollWidth && caretOffset != null &&
      this.input?.clientWidth != null && caretOffset > this.input.clientWidth) {
      this.input.scrollLeft += caretOffset;
    }
  }

  getQuery() {
    return this.input?.textContent?.replace(/\s/g, ' ') ?? '';
  }

  isRenderingGlassOrLoader() {
    const renderLoader = this.props.loader !== false && this.state.loading;
    return this.props.glass || renderLoader;
  }

  togglePlaceholder = () => {
    const query = this.getQuery();
    const currentQueryIsEmpty = this.immediateState.query === '';
    const newQueryIsEmpty = query === '';

    if (newQueryIsEmpty !== currentQueryIsEmpty) {
      this.setState({placeholderEnabled: newQueryIsEmpty});
    }
  };

  isComposing?: boolean;
  handleInput = (e: Event | SyntheticEvent) => {
    this.togglePlaceholder();
    const currentCaret = this.caret?.getPosition();
    const props = {
      dirty: true,
      query: this.getQuery(),
      caret: typeof currentCaret === 'number'
        ? currentCaret
        : currentCaret?.position ?? 0,
      focus: true
    };

    if (this.immediateState.query === props.query && !this.isComposing) {
      this.handleCaretMove(e);
      return;
    }

    if (this.isComposing) {
      return;
    }

    this.immediateState = props;

    if (this.state.query) {
      let i = 0;
      while (
        this.state.query[i] === this.immediateState.query[i] && i < this.state.query.length - 1
      ) {
        i++;
      }
      const diff = this.immediateState.query.length - this.state.query.length;
      const originalIndex = this.immediateState.caret - diff;
      const ranges = [...(this.state.styleRanges ?? [])];

      const range = ranges.
        find(r => originalIndex >= r.start && originalIndex <= r.start + r.length);

      if (range) {
        range.length += diff;
      }

      ranges.filter(r => r.start > originalIndex).forEach(r => {
        r.start += diff;
      });
    }

    this.props.onChange(props);
    if (this.props.autoOpen === 'force' || props.query.length > 0) {
      this.requestData?.();
    }
  };

  // It's necessary to prevent new element creation before any other hooks
  handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      preventDefault(e);
    }
  };

  handleTab = (e: Event) => {
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
  };

  setState = (state: Partial<QueryAssistState>, resolve?: () => void) => {
    super.setState(state, () => {
      this._pushHistory(state);
      resolve?.();
    });
  };

  private _pushHistory(state: Partial<QueryAssistState>) {
    const queryIsSet = 'query' in state;
    const queryIsSame = this.historyStack[0]?.query === state.query;

    if (queryIsSet && !queryIsSame) {
      this.historyStack.unshift({
        query: state.query,
        caret: this.caret?.getPosition({avoidFocus: true}) ?? -1
      });
    }
  }

  undo = (e: Event) => {

    const previous = this.historyStack.splice(0, 2)[1];
    if (!previous) {
      return;
    }

    this.setState({query: previous.query}, () => {
      this.caret?.setPosition(previous.caret);
      this.handleInput(e);
    });
  };

  handlePaste = (e: React.ClipboardEvent) => {
    const INSERT_COMMAND = 'insertText';
    if (e.clipboardData && document.queryCommandSupported(INSERT_COMMAND)) {
      preventDefault(e);
      const text = cleanText(e.clipboardData.getData('text/plain'));
      document.execCommand(INSERT_COMMAND, false, text);
      this.handleInput(e);
    }
  };

  handleCaretMove = (e: Event | SyntheticEvent) => {
    if (this.isComposing) {
      return;
    }

    const currentCaret = this.caret?.getPosition();
    const caret = typeof currentCaret === 'number'
      ? currentCaret
      : currentCaret?.position ?? 0;
    const popupHidden = (!this.state.showPopup) && e.type === 'click';

    if (!this.props.disabled && (caret !== this.immediateState.caret || popupHidden)) {
      this.immediateState.prevCaret = this.immediateState.caret;
      this.immediateState.caret = caret;
      this.scrollInput();
      if (this.immediateState.query.length > 0) {
        this.requestData?.();
      }
    }

    if (this.props.autoOpen !== 'force' && this.immediateState.query.length < 1) {
      this.setState({showPopup: false});
    }
  };

  handleStyleRangesResponse = ({suggestions, ...restProps}: QueryAssistResponse) =>
    this.handleResponse(restProps);

  handleResponse = ({
    query = '',
    caret = 0,
    styleRanges,
    suggestions = []
  }: QueryAssistResponse, afterCompletion = false) => new Promise<void>((resolve, reject) => {
    if (
      query === this.getQuery() &&
      (caret === this.immediateState.caret ||
        this.immediateState.caret === undefined)
    ) {
      // Do not setState on unmounted component
      if (!this.node) {
        return;
      }

      const state: QueryAssistState = {
        dirty: this.immediateState.dirty,
        loading: false,
        placeholderEnabled: !query,
        query,
        suggestions,
        showPopup: !!suggestions.length && (this.props.autoOpen === 'force' || !afterCompletion)
      };

      this.immediateState.suggestionsQuery = query;

      // Do not update deep equal styleRanges to simplify shouldComponentUpdate check
      if (!deepEqual(this.state.styleRanges, styleRanges)) {
        state.styleRanges = styleRanges;
      }

      this.immediateState.selection = this.caret?.getPosition({avoidFocus: true});
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
  };

  handleComplete = (data?: SuggestionItem, replace?: boolean) => {
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
      prevCaret: currentCaret,
      caret: suggestion.caret ?? 0,
      selection: suggestion.caret ?? 0,
      query: query.substr(0, suggestion.completionStart) + prefix + suggestion.option + suffix
    };

    if (typeof replace === 'boolean' && replace) {
      state.query += this.immediateState.query.substr(suggestion.completionEnd ?? 0);
    } else {
      state.query += this.immediateState.query.substr(this.immediateState.caret);
    }

    this.props.onChange(state);
    this.props.onApplySuggestion(data.data, state);

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
    this.requestData?.(true);
  };

  requestStyleRanges = () => {
    const {query, caret} = this.immediateState;

    if (!query) {
      return Promise.reject(new Error('Query is empty'));
    }

    return this.sendRequest({query, caret, omitSuggestions: true}).
      then(this.handleStyleRangesResponse).
      catch(noop);
  };

  requestHandler = (afterCompletion = false) => {
    if (this.props.disabled) {
      return Promise.reject(new Error('QueryAssist(@jetbrains/ring-ui): null exception'));
    }

    const {query, caret} = this.immediateState;

    return this.sendRequest({query, caret}).
      then(data => this.handleResponse(data, afterCompletion)).
      catch(noop);
  };

  sendRequest(params: QueryAssistRequestParams) {
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

    dataPromise.
      then(() => window.clearTimeout(timeout)).
      catch(() => {
        window.clearTimeout(timeout);
        this.setState({loading: false});
      });

    return dataPromise;
  }

  getPopupOffset(suggestions: readonly QueryAssistSuggestion[]) {
    const ICON_SPACING = 12;
    const minOffset = this.isRenderingGlassOrLoader() ? ICON_SPACING : 0;

    if (!this.input) {
      return minOffset;
    }

    // First suggestion should be enough?
    const suggestion = suggestions && suggestions[0];

    // Check if suggestion begins not from the end
    const completionStart = suggestion &&
      suggestion.completionStart !== suggestion.completionEnd &&
      suggestion.completionStart;

    const inputChildren = this.input.firstChild instanceof Element &&
      this.input.firstChild.children;
    const completionStartNode = inputChildren &&
      typeof completionStart === 'number' &&
      inputChildren[Math.min(completionStart, inputChildren.length - 1)];

    let offset = completionStartNode &&
      (getRect(completionStartNode).right - getRect(this.input).left);

    if (!offset) {
      const caret = this.caret?.getOffset() ?? 0;

      // Do not compensate caret in the beginning of field
      if (caret === 0) {
        return minOffset;
      } else {
        offset = caret;
      }
    }

    const result = offset - POPUP_COMPENSATION;
    return result < minOffset ? minOffset : result;
  }

  handleCtrlSpace = (e: Event) => {
    preventDefault(e);

    if (!this.state.showPopup) {
      this.requestData?.();
    }
  };

  trackPopupMouseState = (e: SyntheticEvent) => {
    this.mouseIsDownOnPopup = e.type === 'mousedown';
  };

  trackCompositionState = (e: SyntheticEvent) => {
    this.isComposing = e.type !== 'compositionend';
  };

  closePopup = () => {
    if (this.node) {
      this.setState({showPopup: false});
    }
  };

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
  };

  blurInput() {
    this.immediateState.selection = null;
    if (!this.props.focus) {
      this.caret?.target.blur();
    }
  }

  /**
   * Optionally setup data request delay. For each component create a separate
   * instance of the delayed function. This may help reduce the load on the server
   * when the user quickly inputs data.
   */
  setupRequestHandler(delay?: number | null) {
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

  private _renderSuggestion(suggestion: QueryAssistSuggestion) {
    const {ITEM} = PopupMenu.ListProps.Type;
    const {description, icon, group} = suggestion;
    const key = QueryAssistSuggestions.createKey(suggestion);
    const label = QueryAssistSuggestions.renderLabel(suggestion);

    return {
      key,
      icon,
      label,
      description,
      group,
      rgItemType: ITEM,
      data: suggestion
    };
  }

  renderSuggestions() {
    const {suggestions} = this.state;
    if (!suggestions || !suggestions.length) {
      return [];
    }
    return QueryAssistSuggestions.renderList(suggestions, this._renderSuggestion);
  }

  renderQuery() {
    const {dirty, styleRanges, query} = this.state;
    const classes: string[] = [];
    const LETTER_CLASS = 'letter';
    const LETTER_DEFAULT_CLASS = styles.letterDefault;

    if (styleRanges && styleRanges.length) {
      styleRanges.forEach((item, index) => {
        if (dirty && index === styleRanges.length - 1 && item.style === 'text') {
          return;
        }
        const styleName = `${LETTER_CLASS}-${item.style.replace('_', '-')}`;

        for (let i = item.start; i < item.start + item.length; i++) {
          classes[i] = styles[styleName];
        }
      });
    }

    return query && Array.from(query).map((letter, index, letters) => {
      const className = classNames(styles.letter, classes[index] || LETTER_DEFAULT_CLASS);

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

  setFocus(focus: boolean | null | undefined) {
    this.setState({shortcuts: !!focus});

    const isComponentFocused = Boolean(this.immediateState.focus);

    if (focus === false && isComponentFocused) {
      this.immediateState.focus = focus;
      this.blurInput();
    } else if (focus === true && !isComponentFocused) {
      this.immediateState.focus = focus;
      this.setCaretPosition({forceSetCaret: true});
    }
  }

  input?: HTMLElement | null;
  caret?: Caret;
  inputRef = (node: HTMLElement | null) => {
    if (!node) {
      return;
    }

    this.input = node;
    this.caret = new Caret(this.input);
  };

  _popup?: PopupMenu<SuggestionItem> | null;
  popupRef = (node: PopupMenu<SuggestionItem> | null) => {
    this._popup = node;
  };

  placeholder?: HTMLElement | null;
  placeholderRef = (node: HTMLElement | null) => {
    this.placeholder = node;
  };

  glass?: ComponentRef<typeof Icon> | null;
  glassRef = (node: ComponentRef<typeof Icon> | null) => {
    this.glass = node;
  };

  loader?: HTMLElement | null;
  loaderRef = (node: HTMLElement | null) => {
    this.loader = node;
  };

  clear?: ComponentRef<typeof Button> | null;
  clearRef = (node: ComponentRef<typeof Button> | null) => {
    this.clear = node;
  };

  shortcutsScope = getUID('ring-query-assist-');
  shortcutsMap: ShortcutsMap = {
    del: noop,
    enter: () => this.handleComplete(),
    'command+enter': () => this.handleComplete(),
    'ctrl+enter': () => this.handleComplete(),
    'ctrl+space': this.handleCtrlSpace,
    tab: this.handleTab,
    'meta+z': this.undo,
    right: noop,
    left: noop,
    space: noop,
    home: noop,
    end: noop
  };

  listShortcutsMap: ShortcutsMap = {
    home: noop,
    end: noop
  };

  renderActions() {
    const actions = [...(this.props.actions || [])];
    const renderClear = this.props.clear && !!this.state.query;

    if (renderClear) {
      actions.push(
        <I18nContext.Consumer key={'clearAction'}>
          {({translate}) => (
            <Button
              icon={closeIcon}
              className={styles.clear}
              title={this.props.translations?.clearTitle ?? translate('clearTitle')}
              ref={this.clearRef}
              onClick={this.clearQuery}
              data-test="query-assist-clear-icon"
            />
          )}
        </I18nContext.Consumer>
      );
    }

    return actions;
  }

  render() {
    const {
      glass, 'data-test': dataTest, className, useCustomItemRender, huge, size, translations
    } = this.props;

    const renderPlaceholder = !!this.props.placeholder && this.state.placeholderEnabled;
    const renderLoader = this.props.loader !== false && this.state.loading;
    const renderGlass = glass && !renderLoader;
    const actions = this.renderActions();

    const containerClasses = classNames(className, inputStyles[`size${huge ? Size.FULL : size}`], {
      [styles.queryAssist]: true,
      [styles.withIcon]: (renderGlass && !huge) || renderLoader,
      [styles.huge]: huge,
      [styles.queryAssistDisabled]: this.props.disabled
    });

    const inputClasses = classNames(this.props.inputClassName, {
      [`${styles.input} ring-js-shortcuts`]: true,
      [styles.inputGap]: actions.length || this.isRenderingGlassOrLoader() && !glass,
      [styles.inputGap2]: actions.length === 2, // TODO: replace with flex-box layout
      [styles.inputRevertOrder]: !glass || huge
    });

    const placeholderStyles = classNames({
      [styles.placeholder]: true,
      [styles.hugePlaceholder]: huge,
      [styles.withoutGlass]: !glass || (!renderLoader && huge)
    });

    return (
      <ControlsHeightContext.Provider value={ControlsHeight.M}>
        <I18nContext.Consumer>
          {({translate}) => (
            <div
              data-test={dataTests('ring-query-assist', dataTest)}
              className={containerClasses}
              role="presentation"
              ref={this.nodeRef}
            >
              {this.state.shortcuts && (
                <Shortcuts
                  map={this.shortcutsMap}
                  scope={this.shortcutsScope}
                />
              )}

              {renderGlass && !huge && (
                <Icon
                  glyph={searchIcon}
                  className={styles.icon}
                  title={translations?.searchTitle ?? translate('searchTitle')}
                  ref={this.glassRef}
                  data-test="query-assist-search-icon"
                />
              )}

              {renderLoader && (
                <div
                  className={classNames(styles.icon, styles.loader, {
                    [styles.loaderOnTheRight]: !glass && !huge,
                    [styles.loaderActive]: renderLoader
                  })}
                  ref={this.loaderRef}
                >
                  <LoaderInline/>
                </div>
              )}

              <ContentEditable
                aria-label={translations?.searchTitle ?? translate('searchTitle')}
                className={inputClasses}
                data-test="ring-query-assist-input"
                inputRef={this.inputRef}
                disabled={this.props.disabled}
                onComponentUpdate={() => this.setCaretPosition({fromContentEditable: true})}

                onBlur={this.handleFocusChange}
                onClick={this.handleCaretMove}
                onCompositionStart={this.trackCompositionState}
                onCompositionEnd={this.trackCompositionState}
                onFocus={this.handleFocusChange}
                onInput={this.handleInput} // To support IE use the same method
                onKeyUp={this.handleInput} // to handle input and key up
                onKeyDown={this.handleEnter}
                onPaste={this.handlePaste}

                spellCheck="false"
              >{this.state.query && <span>{this.renderQuery()}</span>}</ContentEditable>

              {renderPlaceholder && (
                <button
                  type="button"
                  className={placeholderStyles}
                  ref={this.placeholderRef}
                  onClick={this.handleCaretMove}
                  data-test="query-assist-placeholder"
                  disabled={this.props.disabled}
                >
                  {this.props.placeholder}
                </button>
              )}

              {actions.length
                ? (
                  <div
                    data-test="ring-query-assist-actions"
                    className={styles.actions}
                  >{actions}</div>
                )
                : null}

              <PopupMenu
                hidden={!this.state.showPopup}
                onCloseAttempt={this.closePopup}
                ref={this.popupRef}
                anchorElement={this.node}
                keepMounted
                attached
                className={this.props.popupClassName}
                directions={[PopupMenu.PopupProps.Directions.BOTTOM_RIGHT]}
                data={useCustomItemRender ? this.state.suggestions : this.renderSuggestions()}
                data-test="ring-query-assist-popup"
                hint={this.props.hint}
                shortcutsMap={this.listShortcutsMap}
                hintOnSelection={this.props.hintOnSelection}
                left={this.getPopupOffset(this.state.suggestions)}
                maxHeight={PopupMenu.PopupProps.MaxHeight.SCREEN}
                onMouseDown={this.trackPopupMouseState}
                onMouseUp={this.trackPopupMouseState}
                onSelect={item => this.handleComplete(item)}
              />

              {glass && huge && (
                <div className={styles.rightSearchButton} data-test="query-assist-search-button">
                  <Icon
                    glyph={searchIcon}
                    className={styles.rightSearchIcon}
                    title={translations?.searchTitle ?? translate('searchTitle')}
                    onClick={this.handleApply}
                    ref={this.glassRef}
                    data-test="query-assist-search-icon"
                  />
                </div>
              )}
            </div>
          )}
        </I18nContext.Consumer>
      </ControlsHeightContext.Provider>
    );
  }
}

export type QueryAssistAttrs = JSX.LibraryManagedAttributes<typeof QueryAssist, QueryAssistProps>;

export const RerenderableQueryAssist = rerenderHOC(QueryAssist);
