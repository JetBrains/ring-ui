import React, {
  ButtonHTMLAttributes,
  Component,
  ComponentType,
  CSSProperties,
  Fragment,
  HTMLAttributes,
  ReactNode, RefCallback,
  SyntheticEvent
} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import chevronDownIcon from '@jetbrains/icons/chevron-10px';
import closeIcon from '@jetbrains/icons/close';
import deepEqual from 'deep-equal';

import {Anchor} from '../dropdown/dropdown';
import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Popup from '../popup/popup';
import List, {ActiveItemContext, SelectHandlerParams} from '../list/list';
import Input, {Size} from '../input/input';
import Shortcuts from '../shortcuts/shortcuts';
import Button from '../button/button';
import dataTests from '../global/data-tests';
import getUID from '../global/get-uid';
import rerenderHOC from '../global/rerender-hoc';
import fuzzyHighlight from '../global/fuzzy-highlight';
import Theme from '../global/theme';
import memoize from '../global/memoize';

import {ListDataItem} from '../list/consts';

import {Directions} from '../popup/popup.consts';

import {isArray} from '../global/typescript-utils';

import SelectPopup, {Filter, FilterFn, Multiple, Tags} from './select__popup';
import styles from './select.css';


/**
 * @name Select
 */

function noop() {}

/**
 * @enum {number}
 */
enum Type {
  BUTTON = 'BUTTON',
  INPUT = 'INPUT',
  CUSTOM = 'CUSTOM',
  INLINE = 'INLINE',
  MATERIAL = 'MATERIAL',
  INPUT_WITHOUT_CONTROLS = 'INPUT_WITHOUT_CONTROLS'
}

const ICON_WIDTH = 20;
const getStyle = memoize((iconsLength: number) => ({
  paddingRight: iconsLength * ICON_WIDTH
}));

const isInputMode = (type: Type) => type === Type.INPUT || type === Type.INPUT_WITHOUT_CONTROLS;

type SelectItemData<T> = T & {
  key: string | number
  isResetItem?: boolean | null | undefined
  separator?: boolean | null | undefined
}

export type SelectItem<T = unknown> = ListDataItem<SelectItemData<T>>

function getLowerCaseLabel<T>(item: SelectItem<T>) {
  if (
    List.isItemType(List.ListProps.Type.SEPARATOR, item) ||
    List.isItemType(List.ListProps.Type.HINT, item) ||
    typeof item.label !== 'string'
  ) {
    return null;
  }

  return item.label.toLowerCase();
}

function doesLabelMatch<T>(itemToCheck: SelectItem<T>, fn: (label: string) => boolean) {
  const lowerCaseLabel = getLowerCaseLabel(itemToCheck);

  if (lowerCaseLabel == null) {
    return true;
  }

  return fn(lowerCaseLabel);
}

function getFilterFn<T>(filter: Filter<T> | boolean): FilterFn<T> {
  if (typeof filter === 'object') {
    if (filter.fn) {
      return filter.fn;
    }

    if (filter.fuzzy) {
      return (itemToCheck, checkString) =>
        doesLabelMatch(itemToCheck, lowerCaseLabel =>
          fuzzyHighlight(checkString, lowerCaseLabel).matched
        );
    }
  }

  return (itemToCheck, checkString) =>
    doesLabelMatch(itemToCheck, lowerCaseLabel =>
      lowerCaseLabel.indexOf(checkString) >= 0
    );
}

function buildMultipleMap<T>(selected: SelectItem<T>[]) {
  return selected.reduce((acc: Record<string, boolean>, item) => {
    acc[item.key] = true;
    return acc;
  }, {});
}

export interface Add {
  alwaysVisible?: boolean | null | undefined
  regexp?: RegExp | null | undefined
  minlength?: number | null | undefined
  label?: ((filterString: string) => string) | string | null | undefined
  prefix?: string | null | undefined
  delayed?: boolean | null | undefined
}

export interface DataTestProps {
  'data-test'?: string | null | undefined
}

export interface CustomAnchorProps {
  wrapperProps: HTMLAttributes<HTMLElement> & DataTestProps & {ref: RefCallback<HTMLElement>}
  buttonProps: ButtonHTMLAttributes<HTMLButtonElement> & DataTestProps,
  popup: ReactNode
}

export interface BaseSelectProps<T = unknown> {
  data: readonly SelectItem<T>[]
  filter: boolean | Filter<T>
  clear: boolean
  loading: boolean
  disabled: boolean
  loadingMessage: string
  notFoundMessage: string
  type: Type
  size: Size
  hideSelected: boolean
  allowAny: boolean
  maxHeight: number
  hideArrow: boolean
  directions: readonly Directions[]
  label: string
  selectedLabel: ReactNode
  inputPlaceholder: string
  shortcutsEnabled: boolean
  onBeforeOpen: () => void
  onLoadMore: () => void
  onOpen: () => void
  onFilter: (value: string) => void
  onFocus: () => void
  onBlur: () => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onSelect: (selected: SelectItem<T> | null, event?: Event | SyntheticEvent) => void
  onDeselect: (selected: SelectItem<T> | null) => void
  onAdd: (value: string) => void
  onDone: () => void
  onReset: () => void
  dir: 'ltr' | 'rtl'
  targetElement?: HTMLElement | null | undefined
  className?: string | null | undefined
  buttonClassName?: string | null | undefined
  id?: string | undefined
  getInitial?: (() => string) | null | undefined
  minWidth?: number | undefined
  popupClassName?: string | null | undefined
  popupStyle?: CSSProperties | undefined
  top?: number | undefined
  left?: number | undefined
  renderOptimization?: boolean | undefined
  ringPopupTarget?: string | null | undefined
  hint?: ReactNode
  add?: Add | null | undefined
  compact?: boolean | null | undefined
  theme?: string | null | undefined
  customAnchor?: ((props: CustomAnchorProps) => ReactNode) | null | undefined
  disableMoveOverflow?: boolean | null | undefined
  disableScrollToActive?: boolean | null | undefined
  'data-test'?: string | null | undefined
}

export interface SingleSelectProps<T = unknown> extends BaseSelectProps<T> {
  multiple: false
  onClose: (selected: SelectItem<T> | null) => void
  onChange: (selected: SelectItem<T> | null, event?: Event | SyntheticEvent) => void
  selected?: SelectItem<T> | null | undefined
  tags?: null | undefined
}

export interface MultipleSelectProps<T = unknown> extends BaseSelectProps<T> {
  multiple: true | Multiple
  selected: readonly SelectItem<T>[]
  onClose: (selected: SelectItem<T>[]) => void
  onChange: (selected: SelectItem<T>[], event?: Event | SyntheticEvent) => void
  tags?: Tags | boolean | null | undefined
}

type SelectProps<T = unknown> = SingleSelectProps<T> | MultipleSelectProps<T>

interface AddButton {
  prefix: string | null | undefined
  label: string
  delayed: boolean
}

export interface SelectState<T = unknown> {
  data: SelectItem<T>[]
  shownData: SelectItem<T>[]
  selected: SelectItem<T> | SelectItem<T>[] | null | undefined
  selectedIndex: number | null
  filterValue: string
  shortcutsEnabled: boolean
  popupShortcuts: boolean
  showPopup: boolean
  prevData: readonly SelectItem<T>[]
  prevSelected: SelectItem<T> | readonly SelectItem<T>[] | null | undefined
  prevMultiple: Multiple | boolean | null | undefined
  multipleMap: Record<string, boolean>
  addButton: AddButton | null
  focused?: boolean
}

function getListItems<T = unknown>(
  props: SelectProps<T>,
  state: Partial<SelectState<T>>,
  rawFilterString: string,
  data = props.data
) {
  let filterString = rawFilterString.trim();

  if (isInputMode(props.type) && state.selected && !Array.isArray(state.selected) &&
    filterString === state.selected.label) {
    filterString = ''; // ignore multiple if it is exactly the selected item
  }
  const lowerCaseString = filterString.toLowerCase();

  const filteredData = [];
  let exactMatch = false;

  const check = getFilterFn(props.filter);

  for (let i = 0; i < data.length; i++) {
    const item = {...data[i]};
    if (check(item, lowerCaseString, data)) {
      exactMatch = (item.label === filterString);

      if (props.multiple &&
        !(typeof props.multiple === 'object' && props.multiple.removeSelectedItems)) {
        item.checkbox = !!state.multipleMap?.[item.key];
      }

      if (
        props.multiple &&
        typeof props.multiple === 'object' &&
        props.multiple.limit &&
        Array.isArray(state.selected)
      ) {
        item.disabled = props.multiple.limit === state.selected.length &&
          !state.selected.find(selectedItem => selectedItem.key === item.key);
      }

      // Ignore item if it's multiple and is already selected
      if (
        !(props.multiple &&
          typeof props.multiple === 'object' &&
          props.multiple.removeSelectedItems &&
          state.multipleMap?.[item.key])
      ) {
        filteredData.push(item);
      }
    }
  }

  let addButton = null;
  const {add} = props;
  if (
    (add && filterString && !exactMatch) ||
    (add && add.alwaysVisible)
  ) {
    if (
      !(add.regexp && !add.regexp.test(filterString)) &&
      !(add.minlength && filterString.length < +add.minlength) ||
      add.alwaysVisible
    ) {
      let label;

      if (add.label) {
        label = (typeof add.label === 'function') ? add.label(filterString) : add.label;

      } else {
        label = filterString;
      }

      addButton = {
        prefix: add.prefix,
        label,
        delayed: add.delayed ?? true
      };
    }
  }

  return {filteredData, addButton};
}

function getSelectedIndex<T>(
  selected: SelectItem<T> | readonly SelectItem<T>[] | null | undefined,
  data: readonly SelectItem<T>[]
) {
  const firstSelected = Array.isArray(selected) ? selected[0] : selected;
  if (firstSelected == null) {
    return null;
  }

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    if (item.key === undefined) {
      continue;
    }

    if (item.key === firstSelected.key) {
      return i;
    }
  }

  return null;
}

const getItemLabel = <T, >({selectedLabel, label}: SelectItem<T>): string => {
  if (selectedLabel != null) {
    return selectedLabel;
  }
  return typeof label === 'string' ? label : '';
};

const getValueForFilter = <T, >(
  selected: SelectItem<T> | readonly SelectItem<T>[] | null | undefined,
  type: Type,
  filterValue: string
): string => (selected && !isArray(selected) && isInputMode(type)
    ? getItemLabel(selected)
    : filterValue);

function isSameSelected<T>(prevSelected: SelectItem<T>[], selected: SelectItem<T>[]) {
  if (!prevSelected || !selected || prevSelected.length !== selected.length) {
    return false;
  }

  const keysMap = selected.reduce((result: Record<string, boolean>, item) => {
    result[item.key] = true;
    return result;
  }, {});

  return prevSelected.every(it => keysMap[it.key]);
}

/**
 * @name Select
 * @constructor
 * @extends {Component}
 */
/**
 * Displays a select.
 */
export default class Select<T = unknown> extends Component<SelectProps<T>, SelectState<T>> {
  static defaultProps = {
    data: [],
    filter: false, // enable filter (not in INPUT modes)
    multiple: false, // multiple can be an object - see demo for more information
    clear: false, // enable clear button that clears the "selected" state
    loading: false, // show a loading indicator while data is loading
    disabled: false, // disable select

    loadingMessage: 'Loading...',
    notFoundMessage: 'No options found',

    type: Type.MATERIAL,
    size: Size.M,
    targetElement: null, // element to bind the popup to (select BUTTON or INPUT by default)
    hideSelected: false, // INPUT mode: clears the input after an option is selected (useful when the selection is displayed in some custom way elsewhere)
    allowAny: false, // INPUT mode: allows any value to be entered, hides the dropdown icon
    hideArrow: false, // hide dropdown arrow icon

    maxHeight: 600, // height of the options list, including the filter and the 'Add' button
    directions: [
      Popup.PopupProps.Directions.BOTTOM_RIGHT,
      Popup.PopupProps.Directions.BOTTOM_LEFT,
      Popup.PopupProps.Directions.TOP_LEFT,
      Popup.PopupProps.Directions.TOP_RIGHT
    ],

    selected: null, // current selection (item / array of items)

    label: '', // BUTTON or INPUT label (nothing selected)
    selectedLabel: '', // BUTTON or INPUT label (something selected)
    inputPlaceholder: '', // Placeholder for input modes
    hint: null, // hint text to display under the list

    shortcutsEnabled: false,

    onBeforeOpen: noop,
    onLoadMore: noop,
    onOpen: noop,
    onClose: noop,
    onFilter: noop, // search string as first argument
    onFocus: noop,
    onBlur: noop,
    onKeyDown: noop,

    onSelect: noop, // single + multi
    onDeselect: noop, // multi
    onChange: noop, // multi

    onAdd: noop, // search string as first argument

    onDone: noop,
    onReset: noop,

    tags: null,
    ringPopupTarget: null,
    dir: 'ltr'
  };

  static getDerivedStateFromProps<T = unknown>(
    nextProps: SelectProps<T>,
    prevState: SelectState<T>
  ) {
    const {multiple, data, type} = nextProps;
    const {prevSelected, prevData, prevMultiple, filterValue} = prevState;
    const nextState: Partial<SelectState<T>> = {
      prevData: data,
      prevSelected: nextProps.selected,
      prevMultiple: multiple
    };

    if ('data' in nextProps && data !== prevData) {
      const {filteredData, addButton} = getListItems(nextProps, prevState, filterValue, data);
      Object.assign(nextState, {shownData: filteredData, addButton});

      if (prevState.selected) {
        Object.assign(nextState, {
          selectedIndex: getSelectedIndex(
            prevState.selected,
            data,
          ),
          prevFilterValue: getValueForFilter(prevState.selected, type, filterValue)
        });
      }
    }

    if ('selected' in nextProps && nextProps.selected !== prevSelected) {
      const selected = nextProps.selected || (multiple ? [] : null);

      const selectedIndex = getSelectedIndex(
        selected,
        data || prevData,
      );

      Object.assign(nextState, {
        selected,
        prevFilterValue: getValueForFilter(selected, type, filterValue)
      });

      if (!Array.isArray(prevSelected) || !Array.isArray(selected) ||
        !isSameSelected(prevSelected, selected)) {
        Object.assign(nextState, {selectedIndex});
      }
    }

    if (prevMultiple !== multiple && !deepEqual(prevMultiple, multiple)) {
      nextState.selected = multiple ? [] : null;
    }

    const {selected} = {...prevState, ...nextState};
    if (selected && Array.isArray(selected)) {
      nextState.multipleMap = buildMultipleMap(selected);
      const {filteredData, addButton} = getListItems(nextProps, nextState, filterValue, data);
      Object.assign(nextState, {shownData: filteredData, addButton});
    }

    return nextState;
  }

  state: SelectState<T> = {
    data: [],
    shownData: [],
    selected: (this.props.multiple ? [] : null),
    selectedIndex: null,
    filterValue: this.props.filter && typeof this.props.filter === 'object' &&
      this.props.filter.value || '',
    shortcutsEnabled: false,
    popupShortcuts: false,
    showPopup: false,
    prevData: this.props.data,
    prevSelected: null,
    prevMultiple: this.props.multiple,
    multipleMap: {},
    addButton: null
  };

  componentDidUpdate(prevProps: SelectProps<T>, prevState: SelectState<T>) {
    const {showPopup, selected} = this.state;
    const {onClose, onOpen, onChange, multiple} = this.props;

    if (prevState.showPopup && !showPopup) {
      (onClose as (s: typeof selected) => void)(selected);
    } else if (!prevState.showPopup && showPopup) {
      onOpen();
    }

    if (multiple !== prevProps.multiple && !deepEqual(multiple, prevProps.multiple)) {
      (onChange as (s: typeof selected) => void)(selected);
    }
  }

  static Type = Type;
  static Size = Size;
  static Theme = Theme;

  id = getUID('select-');
  shortcutsScope = this.id;
  listId = `${this.id}:list`;
  private _focusHandler = () => {
    this.props.onFocus();

    this.setState({
      shortcutsEnabled: true,
      focused: true
    });
  };

  private _blurHandler = () => {
    this.props.onBlur();

    if (this._popup && this._popup.isVisible() && !this._popup.isClickingPopup) {
      window.setTimeout(() => {
        this.setState({showPopup: false});
      });
    }

    if (!this._popup?.isClickingPopup) {
      this.setState({
        shortcutsEnabled: false,
        focused: false
      });
    }
  };

  node?: HTMLElement | null;
  nodeRef = (el: HTMLElement | null) => {
    this.node = el;
  };

  _popup: SelectPopup<SelectItemData<T>> | null = null;

  onEmptyPopupEnter = () => {
    if (this.state.addButton) {
      this.addHandler();
    }
  };

  private _onEnter = () => {
    if (this.state.addButton && this.state.shownData.length === 0) {
      this.addHandler();
    }

    this.props.onDone();

    if (!this._popup?.isVisible() && this.props.allowAny) {
      return true;
    }

    return undefined;
  };

  private _onEsc = (event: KeyboardEvent) => {
    if (!this._popup?.isVisible()) {
      return true;
    } else if (this.props.multiple || !this.props.getInitial) {
      return false;
    }

    const selected = {
      key: Math.random(),
      label: this.props.getInitial()
    } as SelectItem<T>;

    this.setState({
      selected,
      filterValue: this.getValueForFilter(selected)
    }, () => {
      (this.props.onChange as (s: typeof selected, e?: Event) => void)(selected, event);
      this.props.onReset();
    });

    return undefined;
  };

  _inputShortcutHandler = () => {
    if (this.state.focused && this._popup && !this._popup.isVisible()) {
      this._clickHandler();
    }
  };

  getValueForFilter(selected: SelectItem<T> | readonly SelectItem<T>[] | null | undefined): string {
    return getValueForFilter(selected, this.props.type, this.state.filterValue);
  }

  _getSelectedIndex(
    selected: SelectItem<T> | readonly SelectItem<T>[] | null | undefined,
    data: readonly SelectItem<T>[]
  ) {
    return getSelectedIndex(selected, data);
  }

  popupRef = (el: SelectPopup<SelectItemData<T>> | null) => {
    this._popup = el;
  };

  _getResetOption(): SelectItem<T> | null {
    const isOptionsSelected = Array.isArray(this.state.selected) && this.state.selected.length;
    const reset = this.props.tags && typeof this.props.tags === 'object'
      ? this.props.tags.reset
      : null;
    if (!isOptionsSelected || !reset) {
      return null;
    }

    const resetHandler = (item: SelectItem<T>, event: Event | SyntheticEvent) => {
      this.clear(event);
      this.clearFilter();
      this.props.onFilter('');
      this.setState(prevState => ({
        shownData: prevState.shownData.slice(reset.separator ? 2 : 1),
        multipleMap: {}
      }));
      this._redrawPopup();
    };

    return {
      isResetItem: true,
      separator: reset.separator,
      key: reset.label,
      rgItemType: List.ListProps.Type.CUSTOM,
      template: (
        <Button
          text
          className={styles.button}
          data-test="ring-select-reset-tags-button"
        >
          {reset.label}
        </Button>
      ),
      glyph: reset.glyph,
      onClick: resetHandler
    } as SelectItem<T>;
  }

  _prependResetOption(shownData: SelectItem<T>[]): SelectItem<T>[] {
    const resetOption = this._getResetOption();
    const margin = {rgItemType: List.ListProps.Type.MARGIN} as SelectItem<T>;
    if (resetOption) {
      const resetItems = [margin, resetOption, margin];
      if (resetOption.separator) {
        resetItems.push({
          rgItemType: List.ListProps.Type.SEPARATOR
        } as SelectItem<T>);
      }
      return resetItems.concat(shownData);
    }
    return shownData;
  }

  private _renderPopup() {
    const anchorElement = this.props.targetElement || this.node;
    const {showPopup, shownData} = this.state;
    const _shownData = this._prependResetOption(shownData);
    let message;

    if (this.props.loading) {
      message = this.props.loadingMessage;
    } else if (!shownData.length) {
      message = this.props.notFoundMessage;
    }

    return (
      <SelectPopup<SelectItemData<T>>
        data={_shownData}
        message={message}
        toolbar={showPopup && this.getToolbar()}
        loading={this.props.loading}
        activeIndex={this.state.selectedIndex}
        hidden={!showPopup}
        ref={this.popupRef}
        maxHeight={this.props.maxHeight}
        minWidth={this.props.minWidth}
        directions={this.props.directions}
        className={this.props.popupClassName}
        style={this.props.popupStyle}
        top={this.props.top}
        left={this.props.left}
        filter={this.isInputMode() ? false : this.props.filter} // disable popup filter in INPUT mode
        multiple={this.props.multiple}
        filterValue={this.state.filterValue}
        anchorElement={anchorElement}
        onCloseAttempt={this._onCloseAttempt}
        onSelect={this._listSelectHandler}
        onSelectAll={this._listSelectAllHandler}
        onFilter={this._filterChangeHandler}
        onClear={this.clearFilter}
        onLoadMore={this.props.onLoadMore}
        isInputMode={this.isInputMode()}
        selected={this.state.selected}
        tags={this.props.tags}
        compact={this.props.compact}
        renderOptimization={this.props.renderOptimization}
        ringPopupTarget={this.props.ringPopupTarget}
        disableMoveOverflow={this.props.disableMoveOverflow}
        disableScrollToActive={this.props.disableScrollToActive}
        dir={this.props.dir}
        onEmptyPopupEnter={this.onEmptyPopupEnter}
        listId={this.listId}
      />
    );
  }

  _showPopup() {
    if (!this.node) {
      return;
    }

    const shownData = this.getListItems(this.filterValue());
    this.setState({
      showPopup: !!shownData.length || !this.props.allowAny,
      shownData
    });
  }

  _hidePopup(tryFocusAnchor?: boolean) {
    if (this.node && this.state.showPopup) {
      this.setState({
        showPopup: false,
        filterValue: ''
      });

      if (tryFocusAnchor) {
        const restoreFocusNode = this.props.targetElement ||
          this.node.querySelector<HTMLElement>('[data-test~=ring-select__focus]');
        if (restoreFocusNode) {
          restoreFocusNode.focus();
        }
      }
    }
  }

  addHandler = () => {
    const value = this.filterValue();
    this._hidePopup();
    this.props.onAdd(value);
  };

  getToolbar() {
    const {hint} = this.props;
    const {prefix, label, delayed} = this.state.addButton || {};
    const isToolbarHasElements = this.state.addButton || hint;
    if (!isToolbarHasElements) {
      return null;
    }

    return (
      <div
        className={classNames({
          [styles.toolbar]: !!this.state.addButton
        })}
        data-test="ring-select-toolbar"
      >
        {this.state.addButton && (
          <Button
            text
            delayed={delayed}
            className={classNames(styles.button, styles.buttonSpaced)}
            onClick={this.addHandler}
            data-test="ring-select-toolbar-button"
          >
            {prefix ? `${prefix} ${label}` : label}
          </Button>
        )}
        {hint && (
          <List.ListHint
            label={hint}
            data-test="ring-select-toolbar-hint"
          />
        )}
      </div>
    );
  }

  getLowerCaseLabel = getLowerCaseLabel;
  doesLabelMatch = doesLabelMatch;

  getFilterFn() {
    return getFilterFn(this.props.filter);
  }

  getListItems(rawFilterString: string, data?: SelectItem<T>[]) {
    const {filteredData, addButton} = getListItems(this.props, this.state, rawFilterString, data);
    this.setState({addButton});

    return filteredData;
  }

  filterValue(): string
  filterValue(setValue: string): void
  filterValue(setValue?: string) {
    if (typeof setValue === 'string' || typeof setValue === 'number') {
      this.setState({filterValue: setValue});
      return undefined;
    } else {
      return this.state.filterValue;
    }
  }

  isInputMode() {
    return isInputMode(this.props.type);
  }

  _clickHandler = () => {
    if (!this.props.disabled) {
      if (this.state.showPopup) {
        this._hidePopup();
      } else {
        this.props.onBeforeOpen();
        this._showPopup();
      }
    }
  };

  _filterChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    this._setFilter(e.currentTarget.value, e);
  };

  private _setFilter = (value: string, event?: SyntheticEvent) => {
    if (this.isInputMode() && !this.state.focused) {
      return;
    }

    if (value === this.state.filterValue) {
      return;
    }

    const filterValue = value.replace(/^\s+/g, '');
    this.props.onFilter(filterValue);
    if (this.props.allowAny) {
      const fakeSelected = {
        key: Math.random(),
        label: filterValue
      } as SelectItem<T>;
      this.setState({
        selected: filterValue === '' ? null : fakeSelected,
        selectedIndex: null
      }, () => {
        this.props.onSelect(fakeSelected, event);
        (this.props.onChange as (selected: SelectItem<T>, event?: SyntheticEvent) => void)(
          fakeSelected,
          event
        );
      });
    }
    !this._popup?.isVisible() && this.props.onBeforeOpen();

    this.setState({filterValue}, () => {
      this._showPopup();
    });
  };

  private _rebuildMultipleMap(selected: SelectItem<T> | readonly SelectItem<T>[] | null) {
    if (Array.isArray(selected)) {
      this.setState({multipleMap: buildMultipleMap(selected)});
    }
  }

  _redrawPopup = () => {
    if (this.props.multiple) {
      setTimeout(() => { //setTimeout solves events order and bubbling issue
        this.isInputMode() && this.clearFilter();
        this._showPopup();
      }, 0);
    }
  };

  _listSelectHandler = (
    selected: SelectItem<T>,
    event?: Event,
    opts: SelectHandlerParams = {}
  ) => {
    const isItem = (item: SelectItem<T>) => List.isItemType(List.ListProps.Type.ITEM, item);
    const isCustomItem = (item: SelectItem<T>) => List.isItemType(List.ListProps.Type.CUSTOM, item);
    const isSelectItemEvent = event && (event.type === 'select' || event.type === 'keydown');
    if (isSelectItemEvent) {
      event.preventDefault();
    }

    if ((!isItem(selected) && !isCustomItem(selected)) ||
      selected.disabled ||
      selected.isResetItem) {
      return;
    }

    if (!this.props.multiple) {
      this._hidePopup(isSelectItemEvent);
      this.setState({
        selected,
        selectedIndex: this._getSelectedIndex(selected, this.props.data)
      }, () => {
        const newFilterValue = this.isInputMode() && !this.props.hideSelected
          ? getItemLabel(selected)
          : '';
        this.filterValue(newFilterValue);
        this.props.onFilter(newFilterValue);
        this.props.onSelect(selected, event);
        (this.props.onChange as (selected: SelectItem<T>, event?: Event) => void)(selected, event);
      });
    } else {
      const {tryKeepOpen} = opts;
      if (!tryKeepOpen) {
        this._hidePopup(isSelectItemEvent);
      }
      if (selected.key == null) {
        throw new Error('Multiple selection requires each item to have the "key" property');
      }

      this.setState(prevState => {
        const currentSelection = prevState.selected as SelectItem<T>[];
        let nextSelection: SelectItem<T>[];

        if (!prevState.multipleMap[selected.key]) {
          nextSelection = currentSelection.concat(selected);
          this.props.onSelect && this.props.onSelect(selected, event);
        } else {
          nextSelection = currentSelection.filter(item => item.key !== selected.key);
          this.props.onDeselect && this.props.onDeselect(selected);
        }

        (this.props.onChange as (selected: SelectItem<T>[], event?: Event) => void)(
          nextSelection,
          event
        );

        const nextState: Partial<SelectState<T>> = {

          selected: nextSelection,
          selectedIndex: this._getSelectedIndex(selected, this.props.data)
        };

        if (
          typeof this.props.multiple === 'object' && this.props.multiple.limit &&
          nextSelection.length === this.props.multiple.limit
        ) {
          nextState.shownData = prevState.shownData.
            map(item => (nextSelection.find(selectedItem => selectedItem.key === item.key)
              ? item
              : {...item, disabled: true}));
        }

        if (!prevState.multipleMap[selected.key]) {
          nextState.multipleMap = {...prevState.multipleMap, [selected.key]: true};
        } else {
          const {[selected.key]: _, ...restMultipleMap} = prevState.multipleMap;
          nextState.multipleMap = restMultipleMap;
        }

        return {...prevState, ...nextState};

      }, () => {
        if (tryKeepOpen) {
          this._redrawPopup();
        }
      });
    }
  };

  _listSelectAllHandler = (isSelectAll = true) => {
    const isItem = (item: SelectItem<T>) => List.isItemType(List.ListProps.Type.ITEM, item);
    const isCustomItem = (item: SelectItem<T>) => List.isItemType(List.ListProps.Type.CUSTOM, item);

    this.setState(prevState => {
      const currentSelection = prevState.selected as SelectItem<T>[];
      let nextSelection: SelectItem<T>[];

      if (isSelectAll) {
        nextSelection = this.props.data.filter(
          item => (isItem(item) || isCustomItem(item)) &&
            !item.disabled
        );
        nextSelection.
          filter(
            item => !(this.props.selected as SelectItem<T>[]).
              find(selectedItem => item.key === selectedItem.key)
          ).
          forEach(item => {
            this.props.onSelect && this.props.onSelect(item);
          });
      } else {
        nextSelection = [];
        currentSelection.
          forEach(item => {
            this.props.onDeselect && this.props.onDeselect(item);
          });
      }

      (this.props.onChange as (selected: SelectItem<T>[], event?: Event) => void)(
        nextSelection,
        event
      );

      return {
        filterValue: '',
        selected: nextSelection,
        selectedIndex: isSelectAll
          ? this._getSelectedIndex(
            nextSelection, this.props.data
          )
          : null,
        shownData: prevState.shownData.map(item => ({...item, checkbox: isSelectAll})),
        multipleMap: isSelectAll
          ? buildMultipleMap(this.props.data.filter(item => !item.disabled))
          : {}
      };
    }, this._redrawPopup);
  };

  private _onCloseAttempt = (event?: Event | SyntheticEvent, isEsc?: boolean) => {
    if (this.isInputMode()) {
      if (!this.props.allowAny) {
        if (this.props.hideSelected || !this.state.selected || this.props.multiple) {
          this.clearFilter();
        } else if (this.state.selected && !Array.isArray(this.state.selected)) {
          this.filterValue(getItemLabel(this.state.selected));
        }
      }
    }

    const isTagRemoved = this.props.tags && event && event.target &&
      event.target instanceof Element &&
      event.target.matches('[data-test="ring-tag-remove"]');

    if (!isTagRemoved) {
      this._hidePopup(isEsc);
    }
  };

  clearFilter = (e?: SyntheticEvent) => {
    this._setFilter('', e);
  };

  clear = (event?: Event | SyntheticEvent) => {
    if (event) {
      event.stopPropagation();
    }
    const empty = this.props.multiple ? [] : null;

    this.setState({
      selected: empty,
      selectedIndex: null,
      filterValue: ''
    }, () => {
      if (this.props.onChange) {
        (this.props.onChange as (
          selected: SelectItem<T> | SelectItem<T>[] | null,
          event?: Event | SyntheticEvent
        ) => void)(empty, event);
      }
    });

    return false;
  };

  _selectionIsEmpty() {
    return (Array.isArray(this.state.selected) && !this.state.selected.length) ||
      !this.state.selected;
  }

  private _getLabel() {
    return this.props.label ||
      (typeof this.props.selectedLabel === 'string' ? this.props.selectedLabel : null) ||
      'Select an option';
  }

  _getSelectedString() {
    if (Array.isArray(this.state.selected)) {
      const labels = [];
      for (let i = 0; i < this.state.selected.length; i++) {
        labels.push(getItemLabel(this.state.selected[i]));
      }
      return labels.filter(Boolean).join(', ');
    } else {
      return this.state.selected != null ? getItemLabel(this.state.selected) : null;
    }
  }

  private _getIcons() {
    const {selected} = this.state;
    const {disabled, clear, hideArrow} = this.props;
    const icons = [];

    if (!Array.isArray(selected) && selected?.icon) {
      icons.push(
        <button
          title="Toggle options popup"
          type="button"
          className={styles.selectedIcon}
          key="selected"
          disabled={this.props.disabled}
          onClick={this._clickHandler}
          style={{backgroundImage: `url(${selected.icon})`}}
        />
      );
    }

    if (clear && !disabled && !this._selectionIsEmpty()) {
      icons.push(
        <Button
          title="Clear selection"
          data-test="ring-clear-select"
          className={styles.clearIcon}
          key="close"
          disabled={this.props.disabled}
          onClick={this.clear}
          icon={closeIcon}
        />
      );
    }

    if (!hideArrow) {
      icons.push(
        <Button
          title="Toggle options popup"
          className={styles.chevron}
          iconClassName={styles.chevronIcon}
          icon={chevronDownIcon}
          key="hide"
          disabled={this.props.disabled}
          onClick={this._clickHandler}
        />
      );
    }

    return icons;
  }

  private _getAvatar() {
    return !Array.isArray(this.state.selected) &&
      (this.state.selected?.avatar || this.state.selected?.showGeneratedAvatar) && (
      <Avatar
        className={styles.avatar}
        url={this.state.selected.avatar}
        username={this.state.selected.username}
        size={AvatarSize.Size20}
      />
    );
  }

  button?: HTMLElement | null;
  buttonRef = (el: HTMLElement | null) => {
    this.button = el;
  };

  filter?: HTMLInputElement | null;
  filterRef = (el: HTMLInputElement | null) => {
    this.filter = el;
  };

  getShortcutsMap() {
    return {
      enter: this._onEnter,
      esc: this._onEsc,
      up: this._inputShortcutHandler,
      down: this._inputShortcutHandler,
      right: noop,
      left: noop,
      'shift+up': noop,
      'shift+down': noop,
      space: noop
    };
  }

  renderSelect(activeItemId: string | undefined) {
    const dataTest = this.props['data-test'];
    const {shortcutsEnabled} = this.state;
    const classes = classNames(styles.select, 'ring-js-shortcuts', this.props.className, {
      [styles[`size${this.props.size}`]]: this.props.type !== Type.INLINE,
      [styles.disabled]: this.props.disabled
    });

    const icons = this._getIcons();

    const style = getStyle(icons.length);

    const iconsNode = <span className={styles.icons}>{icons}</span>;
    const ariaProps = this.state.showPopup
      ? {
        'aria-owns': this.listId,
        'aria-activedescendant': activeItemId
      }
      : {};

    switch (this.props.type) {
      case Type.INPUT_WITHOUT_CONTROLS:
      case Type.INPUT: return (
        <div
          ref={this.nodeRef}
          className={classNames(classes, styles.inputMode)}
          data-test={dataTests('ring-select', dataTest)}
        >
          {shortcutsEnabled && (
            <Shortcuts
              map={this.getShortcutsMap()}
              scope={this.shortcutsScope}
            />
          )}
          <Input
            {...ariaProps}
            autoComplete="off"
            id={this.props.id}
            onClick={this._clickHandler}
            inputRef={this.filterRef}
            disabled={this.props.disabled}
            value={this.state.filterValue}
            borderless={this.props.type === Type.INPUT_WITHOUT_CONTROLS}
            style={style}
            size={Size.FULL}
            onChange={this._filterChangeHandler}
            onFocus={this._focusHandler}
            onBlur={this._blurHandler}

            label={this.props.type === Type.INPUT ? this._getLabel() : null}
            placeholder={this.props.inputPlaceholder}
            onKeyDown={this.props.onKeyDown}
            data-test="ring-select__focus"
            enableShortcuts={shortcutsEnabled
              ? Object.keys({
                ...this.getShortcutsMap(),
                ...this._popup?.list?.shortcutsMap
              })
              : undefined}
          />
          {this.props.type === Type.INPUT && iconsNode}
          {this._renderPopup()}
        </div>
      );
      case Type.BUTTON:
        return (
          <div
            ref={this.nodeRef}
            className={classNames(classes, styles.buttonMode)}
            data-test={dataTests('ring-select', dataTest)}
          >
            {shortcutsEnabled && (
              <Shortcuts
                map={this.getShortcutsMap()}
                scope={this.shortcutsScope}
              />
            )}
            <div className={styles.buttonContainer}>
              <Button
                {...ariaProps}
                id={this.props.id}
                onClick={this._clickHandler}
                className={classNames(
                  this.props.buttonClassName,
                  styles.buttonValue,
                  {
                    [styles.buttonValueOpen]: this.state.showPopup
                  })
                }
                disabled={this.props.disabled}
                style={style}
                data-test="ring-select__button ring-select__focus"
              >
                {this._getAvatar()}
                {this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString()}
              </Button>
              {iconsNode}
            </div>
            {this._renderPopup()}
          </div>
        );

      case Type.MATERIAL:
        return (
          <div
            ref={this.nodeRef}
            className={classNames(classes, styles.materialMode)}
            data-test={dataTests('ring-select', dataTest)}
          >
            {shortcutsEnabled && (
              <Shortcuts
                map={this.getShortcutsMap()}
                scope={this.shortcutsScope}
              />
            )}
            {!this._selectionIsEmpty() && this.props.selectedLabel && (
              <span className={styles.selectedLabel}>{this.props.selectedLabel}</span>
            )}
            <button
              {...ariaProps}
              id={this.props.id}
              onClick={this._clickHandler}
              type="button"
              disabled={this.props.disabled}
              className={classNames(this.props.buttonClassName, styles.value, {
                [styles.open]: this.state.showPopup,
                [styles.label]: this._selectionIsEmpty()
              })}
              aria-label={this._getLabel()}
              style={style}
              data-test="ring-select__focus"
              ref={this.buttonRef}
            >
              {this._getAvatar()}
              {this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString()}
            </button>
            {iconsNode}
            {this._renderPopup()}
          </div>
        );
      case Type.INLINE:
        return (
          <div
            className={classes}
            ref={this.nodeRef}
            data-test={dataTests('ring-select', dataTest)}
          >
            {shortcutsEnabled && (
              <Shortcuts
                map={this.getShortcutsMap()}
                scope={this.shortcutsScope}
              />
            )}
            <Anchor
              {...ariaProps}
              id={this.props.id}
              onClick={this._clickHandler}
              data-test="ring-select__focus"
              disabled={this.props.disabled}
              active={this.state.showPopup}
            >
              {this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString()}
            </Anchor>
            {this._renderPopup()}
          </div>
        );
      default:
        if (this.props.customAnchor) {
          return (
            <Fragment>
              {shortcutsEnabled && (
                <Shortcuts
                  map={this.getShortcutsMap()}
                  scope={this.shortcutsScope}
                />
              )}
              {this.props.customAnchor({
                wrapperProps: {
                  ref: this.nodeRef,
                  'data-test': dataTests('ring-select', dataTest)
                },
                buttonProps: {
                  ...ariaProps,
                  id: this.props.id,
                  onClick: this._clickHandler,
                  disabled: this.props.disabled,
                  children: this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString(),
                  'data-test': 'ring-select_focus'
                },
                popup: this._renderPopup()
              })}
            </Fragment>
          );
        }
        return (
          <span id={this.props.id} ref={this.nodeRef} data-test="ring-select">
            {this._renderPopup()}
          </span>
        );
    }
  }

  render() {
    return (
      <ActiveItemContext.Provider>
        <ActiveItemContext.ValueContext.Consumer>
          {activeItemId => this.renderSelect(activeItemId)}
        </ActiveItemContext.ValueContext.Consumer>
      </ActiveItemContext.Provider>
    );
  }
}

(Select as unknown as ComponentType<unknown>).propTypes = {
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  id: PropTypes.string,
  multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  allowAny: PropTypes.bool,
  filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),

  getInitial: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  onDone: PropTypes.func,
  onFilter: PropTypes.func,
  onChange: PropTypes.func,
  onReset: PropTypes.func,
  onLoadMore: PropTypes.func,
  onAdd: PropTypes.func,
  onBeforeOpen: PropTypes.func,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,

  selected: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  data: PropTypes.array,
  tags: PropTypes.object,
  targetElement: PropTypes.object,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  notFoundMessage: PropTypes.string,
  maxHeight: PropTypes.number,
  minWidth: PropTypes.number,
  directions: PropTypes.array,
  popupClassName: PropTypes.string,
  popupStyle: PropTypes.object,
  top: PropTypes.number,
  left: PropTypes.number,
  renderOptimization: PropTypes.bool,
  ringPopupTarget: PropTypes.string,
  hint: List.ListHint.propTypes.label,
  add: PropTypes.object,
  type: PropTypes.oneOf(Object.values(Type)),
  disabled: PropTypes.bool,
  hideSelected: PropTypes.bool,
  label: PropTypes.string,
  selectedLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  inputPlaceholder: PropTypes.string,
  clear: PropTypes.bool,
  hideArrow: PropTypes.bool,
  compact: PropTypes.bool,
  size: PropTypes.oneOf(Object.values(Size)),
  theme: PropTypes.string,
  customAnchor: PropTypes.func,
  disableMoveOverflow: PropTypes.bool,
  disableScrollToActive: PropTypes.bool,
  dir: PropTypes.oneOf(['ltr', 'rtl']),
  'data-test': PropTypes.string
};

export type SingleSelectAttrs<T = unknown> =
  JSX.LibraryManagedAttributes<typeof Select, SingleSelectProps<T>>
export type MultipleSelectAttrs<T = unknown> =
  JSX.LibraryManagedAttributes<typeof Select, MultipleSelectProps<T>>
export type SelectAttrs<T = unknown> = JSX.LibraryManagedAttributes<typeof Select, SelectProps<T>>

export const RerenderableSelect = rerenderHOC(Select);
