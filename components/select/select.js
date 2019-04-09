import React, {Component, Fragment} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import chevronDownIcon from '@jetbrains/icons/chevron-down.svg';
import closeIcon from '@jetbrains/icons/close.svg';

import {Anchor} from '../dropdown/dropdown';
import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Popup from '../popup/popup';
import List from '../list/list';
import Input, {Size} from '../input/input';
import Shortcuts from '../shortcuts/shortcuts';
import Icon from '../icon';
import Button from '../button/button';
import buttonStyles from '../button/button.css';
import getUID from '../global/get-uid';
import rerenderHOC from '../global/rerender-hoc';
import fuzzyHighlight from '../global/fuzzy-highlight';
import Theme from '../global/theme';
import memoize from '../global/memoize';

import SelectPopup from './select__popup';
import styles from './select.css';

/**
 * @name Select
 * @category Components
 * @tags Ring UI Language
 * @description Displays a select.
 * @example-file ./select.examples.html
 */

function noop() {}

/**
 * @enum {number}
 */
const Type = {
  BUTTON: 'BUTTON',
  INPUT: 'INPUT',
  CUSTOM: 'CUSTOM',
  INLINE: 'INLINE',
  MATERIAL: 'MATERIAL',
  INPUT_WITHOUT_CONTROLS: 'INPUT_WITHOUT_CONTROLS'
};

const ICON_WIDTH = 20;
const getStyle = memoize(iconsLength => ({
  paddingRight: iconsLength * ICON_WIDTH
}));

/**
 * @name Select
 * @constructor
 * @extends {Component}
 */
// eslint-disable-next-line react/no-deprecated
export default class Select extends Component {
  static Type = Type;
  static Size = Size;
  static Theme = Theme;

  static _getEmptyValue(multiple) {
    return multiple ? [] : null;
  }

  static propTypes = {
    className: PropTypes.string,
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
    selectedLabel: PropTypes.string,
    inputPlaceholder: PropTypes.string,
    clear: PropTypes.bool,
    hideArrow: PropTypes.bool,
    compact: PropTypes.bool,
    size: PropTypes.oneOf(Object.values(Size)),
    theme: PropTypes.string,
    customAnchor: PropTypes.func,
    disableMoveOverflow: PropTypes.bool,
    dir: PropTypes.oneOf(['ltr', 'rtl'])
  };

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
    onRemoveTag: noop,
    ringPopupTarget: null,
    theme: Theme.LIGHT,
    dir: 'ltr'
  };

  state = {
    data: [],
    shownData: [],
    selected: (this.props.multiple ? [] : null),
    selectedIndex: null,
    filterValue: this.props.filter && this.props.filter.value || '',
    shortcutsEnabled: false,
    popupShortcuts: false,
    showPopup: false
  };

  componentWillMount() {
    this.updateState(this.props, true);
  }

  componentDidMount() {
    this._rebuildMultipleMap(this.state.selected, this.props.multiple);
  }

  componentWillReceiveProps(newProps) {
    this.updateState(newProps);
  }

  componentDidUpdate(prevProps, prevState) {
    const {showPopup} = this.state;

    if (prevState.showPopup && !showPopup) {
      this.props.onClose();
    } else if (!prevState.showPopup && showPopup) {
      this.props.onOpen();
    }
  }

  shortcutsScope = getUID('select-');
  _focusHandler = () => {
    this.props.onFocus();

    this.setState({
      shortcutsEnabled: true,
      focused: true
    });
  };

  _blurHandler = () => {
    this.props.onBlur();

    if (this._popup && this._popup.isVisible() && !this._popup.isClickingPopup) {
      window.setTimeout(() => {
        this.setState({showPopup: false});
      });
    }

    if (!this._popup.isClickingPopup) {
      this.setState({
        shortcutsEnabled: false,
        focused: false
      });
    }
  };

  nodeRef = el => {
    this.node = el;
  };

  _popup = null;
  _addButton = null;
  _multipleMap = {};

  _onEnter = () => {
    this.props.onDone();

    if (!this._popup.isVisible() && this.props.allowAny) {
      return true;
    }

    return undefined;
  };

  _onEsc = event => {
    if (!this._popup.isVisible()) {
      return true;
    } else if (this.props.multiple || !this.props.getInitial) {
      return false;
    }

    const selected = {
      key: Math.random(),
      label: this.props.getInitial()
    };

    this.setState({
      selected,
      filterValue: this.getValueForFilter(selected)
    }, () => {
      this.props.onChange(selected, event);
      this.props.onReset();
    });

    return undefined;
  };

  _inputShortcutHandler = () => {
    if (this.state.focused && this._popup && !this._popup.isVisible()) {
      this._clickHandler();
    }
  };

  _handleMultipleToggling(multiple) {
    const empty = Select._getEmptyValue(multiple);
    this.setState({selected: empty}, () => {
      this.props.onChange(empty);
    });
    this._rebuildMultipleMap(empty, multiple);
  }

  getValueForFilter(selected) {
    return selected && this.isInputMode() ? this._getItemLabel(selected) : this.state.filterValue;
  }

  updateState(props, initial) {
    const {multiple} = this.props;

    if ('data' in props && props.data !== this.props.data) {
      const shownData = this.getListItems(this.filterValue(), props.data);
      this.setState({shownData});

      if (this.state.selected && props.data !== this.props.data) {
        this.setState(prevState => ({
          selectedIndex: this._getSelectedIndex(
            prevState.selected,
            props.data
          ),
          prevFilterValue: this.getValueForFilter(prevState.selected)
        }));
        this._rebuildMultipleMap(this.state.selected, multiple);
      }
    }

    if ('selected' in props && (
      initial ||
      props.selected !== this.props.selected
    )) {
      const selected = props.selected || Select._getEmptyValue(multiple);

      const selectedIndex = this._getSelectedIndex(
        selected,
        props.data || this.props.data
      );

      const newState = {
        selected,
        prevFilterValue: this.getValueForFilter(selected)
      };

      if (!multiple || !isSameSelected(this.props.selected, selected)) {
        Object.assign(newState, {selectedIndex});
      }

      this.setState(newState);

      this._rebuildMultipleMap(selected, multiple);
    }

    if (props.multiple !== multiple) {
      this._handleMultipleToggling(props.multiple);
    }

    function isSameSelected(prevSelected, selected) {
      if (!prevSelected || !selected || prevSelected.length !== selected.length) {
        return false;
      }

      const keysMap = selected.reduce((result, item) => {
        result[item.key] = true;
        return result;
      }, {});

      return prevSelected.every(it => keysMap[it.key]);
    }
  }

  _getSelectedIndex(selected, data) {
    if ((this.props.multiple && !selected.length) || (!this.props.multiple && !selected)) {
      return null;
    }

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (item.key === undefined) {
        continue;
      }

      if (
        (this.props.multiple && item.key === selected[0].key) ||
        (!this.props.multiple && item.key === selected.key)
      ) {
        return i;
      }
    }

    return null;
  }

  popupRef = el => {
    this._popup = el;
  };

  _getResetOption() {
    const isOptionsSelected = this.state.selected && this.state.selected.length;
    const hasTagsResetProp = this.props.tags && this.props.tags.reset;
    if (!isOptionsSelected || !hasTagsResetProp) {
      return null;
    }

    const {reset} = this.props.tags;
    return {
      isResetItem: true,
      separator: reset.separator,
      key: reset.label,
      rgItemType: List.ListProps.Type.ITEM,
      label: reset.label,
      glyph: reset.glyph,
      iconSize: Icon.Size.Size14,
      className: 'ring-select__clear-tags',
      onClick: (item, event) => {
        this.clear(event);
        this._resetMultipleSelectionMap();
        this.clearFilter();
        this.props.onFilter('');
        this.setState(prevState => ({
          shownData: prevState.shownData.slice(reset.separator ? 2 : 1)
        }));
        this._redrawPopup();
      }
    };
  }

  _prependResetOption(shownData) {
    const resetOption = this._getResetOption();
    const margin = {rgItemType: List.ListProps.Type.MARGIN};
    if (resetOption) {
      const resetItems = [margin, resetOption, margin];
      if (resetOption.separator) {
        resetItems.push({
          rgItemType: List.ListProps.Type.SEPARATOR
        });
      }
      return resetItems.concat(shownData);
    }
    return shownData;
  }

  _renderPopup() {
    const anchorElement = this.props.targetElement || this.node;
    const {showPopup, shownData} = this.state;
    const _shownData = this._prependResetOption(shownData);
    let message = null;

    if (this.props.loading) {
      message = this.props.loadingMessage;
    } else if (!shownData.length) {
      message = this.props.notFoundMessage;
    }

    return (
      <SelectPopup
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
        filterValue={this.state.filterValue}
        anchorElement={anchorElement}
        onCloseAttempt={this._onCloseAttempt}
        onSelect={this._listSelectHandler}
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
        dir={this.props.dir}
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

  _hidePopup(tryFocusAnchor) {
    if (this.node && this.state.showPopup) {
      this.setState({
        showPopup: false,
        filterValue: ''
      });

      if (tryFocusAnchor) {
        const restoreFocusNode = this.props.targetElement ||
          this.node.query('[data-test=ring-select__focus]');
        if (restoreFocusNode) {
          restoreFocusNode.focus();
        }
      }
    }
  }

  addHandler = () => {
    this._hidePopup();
    this.props.onAdd(this.filterValue());
  };

  getToolbar() {
    const isToolbarHasElements = this._addButton || this.props.hint;
    if (!isToolbarHasElements) {
      return null;
    }

    let hint = null;
    let addButton = null;

    if (this.props.hint) {
      hint = (
        <List.ListHint
          label={this.props.hint}
          data-test="ring-select-toolbar-hint"
        />
      );
    }

    if (this._addButton) {
      const {prefix, label, delayed} = this._addButton;
      addButton = (
        <Button
          text
          delayed={delayed}
          className={styles.button}
          onClick={this.addHandler}
          data-test="ring-select-toolbar-button"
        >
          {prefix ? `${prefix} ${label}` : label}
        </Button>
      );
    }

    return (
      <div
        className={classNames({
          [styles.toolbar]: addButton
        })}
        data-test="ring-select-toolbar"
      >
        {addButton}
        {hint}
      </div>
    );
  }

  getLowerCaseLabel(item) {
    if (
      List.isItemType(List.ListProps.Type.SEPARATOR, item) ||
      List.isItemType(List.ListProps.Type.HINT, item) ||
      item.label == null
    ) {
      return null;
    }

    return item.label.toLowerCase();
  }

  doesLabelMatch(itemToCheck, fn) {
    const lowerCaseLabel = this.getLowerCaseLabel(itemToCheck);

    if (lowerCaseLabel == null) {
      return true;
    }

    return fn(lowerCaseLabel);
  }

  getFilterFn() {
    const {filter} = this.props;

    if (filter.fn) {
      return filter.fn;
    }

    if (filter.fuzzy) {
      return (itemToCheck, checkString) =>
        this.doesLabelMatch(itemToCheck, lowerCaseLabel =>
          fuzzyHighlight(checkString, lowerCaseLabel).matched
        );
    }

    return (itemToCheck, checkString) =>
      this.doesLabelMatch(itemToCheck, lowerCaseLabel =>
        lowerCaseLabel.indexOf(checkString) >= 0
      );
  }

  getListItems(rawFilterString, data = this.props.data) {
    let filterString = rawFilterString.trim();

    if (this.isInputMode() && this.state.selected && filterString === this.state.selected.label) {
      filterString = ''; // ignore multiple if it is exactly the selected item
    }
    const lowerCaseString = filterString.toLowerCase();

    const filteredData = [];
    let exactMatch = false;

    const check = this.getFilterFn();

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (check(item, lowerCaseString, data)) {
        exactMatch = (item.label === filterString);

        if (this.props.multiple && !this.props.multiple.removeSelectedItems) {
          item.checkbox = !!this._multipleMap[item.key];
        }

        // Ignore item if it's multiple and is already selected
        if (
          !(this.props.multiple &&
            this.props.multiple.removeSelectedItems &&
            this._multipleMap[item.key])
        ) {
          filteredData.push(item);
        }
      }
    }

    this._addButton = null;
    const {add} = this.props;
    if (
      (add && filterString && !exactMatch) ||
      (add && add.alwaysVisible)
    ) {
      if (!(add.regexp && !add.regexp.test(filterString)) &&
        !(add.minlength && filterString.length < +add.minlength) ||
        add.alwaysVisible) {

        this._addButton = {
          prefix: add.prefix,
          label: add.label || filterString,
          delayed: add.hasOwnProperty('delayed') ? add.delayed : true
        };
      }
    }

    return filteredData;
  }

  filterValue(setValue) {
    if (typeof setValue === 'string' || typeof setValue === 'number') {
      this.setState({filterValue: setValue});
    } else {
      return this.state.filterValue;
    }
    return undefined;
  }

  isInputMode() {
    return (this.props.type === Type.INPUT || this.props.type === Type.INPUT_WITHOUT_CONTROLS);
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

  _filterChangeHandler = e => {
    this._setFilter(e.target.value, e);
  };

  _setFilter = (value, event = {}) => {
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
      };
      this.setState({
        selected: filterValue === '' ? null : fakeSelected,
        selectedIndex: null
      }, () => {
        this.props.onSelect(fakeSelected, event);
        this.props.onChange(fakeSelected, event);
      });
    }
    !this._popup.isVisible() && this.props.onBeforeOpen();

    this.setState({filterValue}, () => {
      this._showPopup();
    });
  };

  _resetMultipleSelectionMap() {
    this._multipleMap = {};
    return this._multipleMap;
  }

  _rebuildMultipleMap(selected, multiple) {
    if (selected && multiple) {
      this._resetMultipleSelectionMap();
      for (let i = 0; i < selected.length; i++) {
        this._multipleMap[selected[i].key] = true;
      }
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

  _listSelectHandler = (selected, event) => {
    const isItem = List.isItemType.bind(null, List.ListProps.Type.ITEM);
    const isCustomItem = List.isItemType.bind(null, List.ListProps.Type.CUSTOM);
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
        filterValue: '',
        selected,
        selectedIndex: this._getSelectedIndex(selected, this.props.data)
      }, () => {
        const newFilterValue = this.isInputMode() && !this.props.hideSelected
          ? this._getItemLabel(selected)
          : '';
        this.filterValue(newFilterValue);
        this.props.onFilter(newFilterValue);
        this.props.onSelect(selected, event);
        this.props.onChange(selected, event);
      });
    } else {
      if (selected.key == null) {
        throw new Error('Multiple selection requires each item to have the "key" property');
      }

      this.setState(prevState => {
        const currentSelection = prevState.selected;
        let nextSelection;

        if (!this._multipleMap[selected.key]) {
          this._multipleMap[selected.key] = true;
          nextSelection = currentSelection.concat(selected);
          this.props.onSelect && this.props.onSelect(selected, event);
        } else {
          delete this._multipleMap[selected.key];
          nextSelection = currentSelection.filter(item => item.key !== selected.key);
          this.props.onDeselect && this.props.onDeselect(selected);
        }

        this.props.onChange(nextSelection, event);

        return {
          filterValue: '',
          selected: nextSelection,
          selectedIndex: this._getSelectedIndex(selected, this.props.data)
        };

      }, this._redrawPopup);

    }
  };

  _onCloseAttempt = (event, isEsc) => {
    if (this.isInputMode()) {
      if (!this.props.allowAny) {
        if (this.props.hideSelected || !this.state.selected || this.props.multiple) {
          this.clearFilter();
        } else if (this.state.selected) {
          this.filterValue(this._getItemLabel(this.state.selected));
        }
      }
    }

    const isTagRemoved = this.props.tags && event && event.target &&
      event.target.matches('[data-test="ring-tag-remove"]');

    if (!isTagRemoved) {
      this._hidePopup(isEsc);
    }
  };

  clearFilter = e => {
    this._setFilter('', e);
  };

  clear = event => {
    if (event) {
      event.stopPropagation();
    }
    const empty = Select._getEmptyValue(this.props.multiple);

    this.setState({
      selected: empty,
      selectedIndex: null,
      filterValue: ''
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(empty, event);
      }
    });

    return false;
  };

  _selectionIsEmpty() {
    return (this.props.multiple && !this.state.selected.length) || !this.state.selected;
  }

  _getLabel() {
    return this.props.label || this.props.selectedLabel || 'Select an option';
  }

  _getSelectedString() {
    if (this.props.multiple) {
      const labels = [];
      for (let i = 0; i < this.state.selected.length; i++) {
        labels.push(this._getItemLabel(this.state.selected[i]));
      }
      return labels.filter(Boolean).join(', ');
    } else {
      return this._getItemLabel(this.state.selected);
    }
  }

  _getItemLabel(item) {
    const {selectedLabel, label} = item;
    return selectedLabel != null ? selectedLabel : label;
  }

  _getIcons() {
    const icons = [];

    if (this.state.selected && this.state.selected.icon) {
      icons.push(
        <span
          className={styles.selectedIcon}
          key="selected"
          onClick={this._clickHandler}
          style={{backgroundImage: `url(${this.state.selected.icon})`}}
        />
      );
    }

    if (this.props.clear && !this.props.disabled && this.state.selected) {
      icons.push(
        <Button
          className={styles.clearIcon}
          key="close"
          onClick={this.clear}
          icon={closeIcon}
          iconSize={Icon.Size.Size14}
        />
      );
    }

    if (!this.props.hideArrow) {
      icons.push(
        <Icon
          glyph={chevronDownIcon}
          key="hide"
          onClick={this._clickHandler}
          size={Icon.Size.Size14}
        />
      );
    }

    return icons;
  }

  _getAvatar() {
    return this.state.selected && this.state.selected.avatar && (
      <Avatar
        className={styles.avatar}
        url={this.state.selected.avatar}
        size={AvatarSize.Size20}
      />
    );
  }

  popupRef = el => {
    this._popup = el;
  };

  buttonRef = el => {
    this.button = el;
  };

  filterRef = el => {
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

  render() {
    const {shortcutsEnabled} = this.state;
    const classes = classNames(styles.select, 'ring-js-shortcuts', this.props.className, {
      [styles[`size${this.props.size}`]]: this.props.type !== Type.INLINE,
      [styles.disabled]: this.props.disabled
    });

    const icons = this._getIcons();

    const style = getStyle(icons.length);

    const iconsNode = <span className={styles.icons}>{icons}</span>;

    switch (this.props.type) {
      case Type.INPUT_WITHOUT_CONTROLS:
      case Type.INPUT: return (
        <div
          ref={this.nodeRef}
          className={classNames(classes, styles.inputMode)}
          onClick={this._clickHandler}
          data-test="ring-select"
        >
          {shortcutsEnabled && (
            <Shortcuts
              map={this.getShortcutsMap()}
              scope={this.shortcutsScope}
            />
          )}
          <Input
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
            data-test="ring-select"
            onClick={this._clickHandler}
          >
            {shortcutsEnabled && (
              <Shortcuts
                map={this.getShortcutsMap()}
                scope={this.shortcutsScope}
              />
            )}
            <div
              className={classNames(
                buttonStyles.button,
                buttonStyles[this.props.theme],
                styles.buttonValue,
                {
                  [styles.buttonValueOpen]: this.state.showPopup
                })
              }
              tabIndex={0}
              disabled={this.props.disabled}
              style={style}
              data-test="ring-select__button"
            >
              {this._getAvatar()}
              {this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString()}
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
            data-test="ring-select"
            onClick={this._clickHandler}
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
              type="button"
              disabled={this.props.disabled}
              className={classNames(styles.value, {
                [styles.open]: this.state.showPopup,
                [styles.label]: this._selectionIsEmpty()
              })}
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
            data-test="ring-select"
            onClick={this._clickHandler}
          >
            {shortcutsEnabled && (
              <Shortcuts
                map={this.getShortcutsMap()}
                scope={this.shortcutsScope}
              />
            )}
            <Anchor
              data-test="ring-select__focus"
              disabled={this.props.disabled}
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
                  'data-test': 'ring-select'
                },
                buttonProps: {
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
          <span ref={this.nodeRef} data-test="ring-select">
            {this._renderPopup()}
          </span>
        );
    }
  }
}

export const RerenderableSelect = rerenderHOC(Select, {captureNode: false});
