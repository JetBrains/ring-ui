import React from 'react';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import Popup from '../popup/popup';
import SelectPopup from './select__popup';
import List, {ListHint} from '../list/list';
import Input from '../input/input';
import Icon from '../icon/icon';
import Button from '../button/button';
import './select.scss';

/**
 * @name Select
 * @category Components
 * @description Displays a select.
 * @example-file ./select.examples.html
 */

const ngModelStateField = 'selected';

function noop() {}

/**
 * @enum {number}
 */
const Type = {
  BUTTON: 0,
  INPUT: 1,
  CUSTOM: 2
};

/**
 * @name Select
 * @constructor
 * @extends {RingComponentWithShortcuts}
 */
export default class Select extends RingComponentWithShortcuts {
  static Type = Type;
  static ngModelStateField = ngModelStateField;

  static defaultProps = {
    data: [],
    filter: false,   // enable filter (BUTTON or CUSTOM mode)
    multiple: false, // multiple can be an object - see demo for more information
    clear: false,    // enable clear button that clears the "selected" state
    loading: false,  // show a loading indicator while data is loading
    disabled: false, // disable select

    loadingMessage: 'Loading...',
    notFoundMessage: 'No options found',

    type: Type.BUTTON,
    targetElement: null,  // element to bind the popup to (select BUTTON or INPUT by default)
    popupContainer: null, // element to attach the popup to
    hideSelected: false,  // INPUT mode: clears the input after an option is selected (useful when the selection is displayed in some custom way elsewhere)
    allowAny: false,      // INPUT mode: allows any value to be entered, hides the dropdown icon
    hideArrow: false,     // hide dropdown arrow icon

    maxHeight: 250,       // height of the options list, without the filter and the 'Add' button
    minWidth: 'target',   // Popup width

    selected: null,       // current selection (item / array of items)

    label: 'Please select option',  // BUTTON label or INPUT placeholder (nothing selected)
    selectedLabel: '',              // BUTTON label or INPUT placeholder (something selected)
    hint: null,           // hint text to display under the list

    shortcuts: false,

    onBeforeOpen: noop,
    onLoadMore: noop,
    onOpen: noop,
    onClose: noop,
    onFilter: noop,       // search string as first argument
    onFocus: noop,
    onBlur: noop,
    onKeyDown: noop,

    onSelect: noop,       // single + multi
    onDeselect: noop,     // multi
    onChange: noop,       // multi

    onAdd: noop,          // search string as first argument

    onDone: noop,
    onReset: noop
  };

  state = {
    data: [],
    selected: (this.props.multiple ? [] : null),
    selectedIndex: null,
    filterString: null,
    shortcuts: false,
    popupShortcuts: false,
    prevFilterValue: ''
  };

  ngModelStateField = ngModelStateField;
  _popup = null;
  _addButton = null;
  _multipleMap = {};

  getShortcutsProps() {
    return {
      map: {
        enter: ::this._onEnter,
        esc: ::this._onEsc,
        up: ::this._inputShortcutHandler,
        down: ::this._inputShortcutHandler,
        right: noop,
        left: noop,
        'shift+up': noop,
        'shift+down': noop,
        space: noop
      },
      scope: ::this.constructor.getUID('ring-select-')
    };
  }

  _onEnter() {
    this.props.onDone();

    if (!this._popup.isVisible() && this.props.allowAny) {
      return true;
    }

    return undefined;
  }

  _onEsc(event) {
    if (!this._popup.isVisible()) {
      return true;
    } else if (this.props.multiple || !this.props.getInitial) {
      return false;
    }

    const selected = {
      key: Math.random(),
      label: this.props.getInitial()
    };

    this.setState({selected}, function () {
      this.props.onChange(selected, event);
      this.props.onReset();
    });

    return undefined;
  }

  _inputShortcutHandler() {
    if (this.state.focused && this._popup && !this._popup.isVisible()) {
      this._clickHandler();
    }
  }

  _handleMultipleToggling(multiple) {
    const empty = Select._getEmptyValue(multiple);
    this.setState({selected: empty}, function () {
      this.props.onChange(empty);
    });
    this._rebuildMultipleMap(empty, multiple);
  }

  willMount() {
    // set selected element if provided during init
    if (this.props.selected) {
      this.setState({
        selected: this.props.selected,
        selectedIndex: this._getSelectedIndex(this.props.selected, this.props.data)
      });
    }
  }

  didMount() {
    this._createPopup();
    this._rebuildMultipleMap(this.state.selected, this.props.multiple);
  }

  willUnmount() {
    if (this._popup) {
      this._popup.remove();
    }
  }

  willReceiveProps(newProps) {
    if ('selected' in newProps) {
      const selected = newProps.selected ? newProps.selected : Select._getEmptyValue(this.props.multiple);
      this.setState({
        selected,
        selectedIndex: this._getSelectedIndex(selected, (newProps.data ? newProps.data : this.props.data))
      });
      this._rebuildMultipleMap(selected, this.props.multiple);
    }

    if (newProps.multiple !== this.props.multiple) {
      this._handleMultipleToggling(newProps.multiple);
    }
  }

  didUpdate() {
    this._refreshPopup();
  }

  static _getEmptyValue(multiple) {
    return multiple ? [] : null;
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

      if ((this.props.multiple && item.key === selected[0].key) || (!this.props.multiple && item.key === selected.key)) {
        return i;
      }
    }

    return null;
  }

  _createPopup() {
    if (!this._popup) {
      const anchorElement = this.props.targetElement || this.node;
      const container = this.props.popupContainer;

      this._popup = Popup.renderPopup(
        <SelectPopup
          maxHeight={this.props.maxHeight}
          minWidth={this.props.minWidth}
          directions={this.props.directions}
          className={this.props.popupClassName}
          top={this.props.top}
          left={this.props.left}
          filter={this.isInputMode() ? false : this.props.filter} // disable popup filter in INPUT mode
          anchorElement={anchorElement}
          onClose={::this._onClose}
          onSelect={::this._listSelectHandler}
          onFilter={::this._filterChangeHandler}
          onLoadMore={::this.props.onLoadMore}
        />,
        {container}
      );
    }
  }

  _refreshPopup() {
    if (this._popup.isVisible()) {
      this._showPopup();
    }
  }

  _showPopup() {
    const data = this.getListItems(this.filterValue());
    let message = null;

    if (this.props.loading) {
      message = this.props.loadingMessage;
    } else if (!data.length) {
      message = this.props.notFoundMessage;
    }

    if (!data.length && this.props.allowAny) {
      if (this._popup.isVisible()) {
        this._hidePopup();
      }
      return;
    }

    const shouldScrollToTop = this._popup.props.data && this._popup.props.data.length && this._popup.props.data.length > data.length;
    this._popup.rerender({
      data,
      toolbar: this.getToolbar(),
      message,
      loading: this.props.loading,
      activeIndex: this.state.selectedIndex
    });
  /**
   * The number of items in the list usually decreases after filtering.
   * When items are filtered, results should be displayed to the user starting from the top.
   */
    if (shouldScrollToTop) {
      this._popup.listScrollToIndex(0);
    }

    this._popup.forceUpdate(() => {
      !this._popup.isVisible() && this.props.onOpen();
      this._popup.show();
    });
  }

  _hidePopup(tryFocusAnchor) {
    const isVisible = this._popup.isVisible();

    if (isVisible) {
      this.props.onClose();

      this._popup.hide();

      if (this.node) {
        let restoreFocusNode = tryFocusAnchor ? (this.props.targetElement || this.node) : this.node;
        if (this.props.type === Type.INPUT) {
          restoreFocusNode = findDOMNode(this.refs.filter);
        }

        restoreFocusNode.focus();
      }
    }
  }

  addHandler() {
    this._hidePopup();
    this.props.onAdd(this.filterValue());
  }

  getToolbar() {
    const isToolbarHasElements = this._addButton || this.props.hint;
    if (!isToolbarHasElements) {
      return null;
    }

    let hint = null;
    let addButton = null;

    if (this.props.hint) {
      hint = (
        <ListHint
          key={this.props.hint + Type.ITEM}
          label={this.props.hint}
        />
      );
    }

    if (this._addButton) {
      const prefix = this.props.add.prefix;
      addButton = (
        <div
          className="ring-select__button"
          onClick={::this.addHandler}
        >
            <span className="ring-select__button__plus">{'+'}</span>{prefix ? `${prefix} ` : ''}<span>{this._addButton.label}</span>
        </div>
      );
    }

    return (
      <div className="ring-select__toolbar">
      {addButton}
      {hint}
    </div>);
  }

  getListItems(rawFilterString) {
    let filterString = rawFilterString.trim();

    if (this.isInputMode() && this.state.selected && filterString === this.state.selected.label) {
      filterString = ''; // ignore multiple if it is exactly the selected item
    }

    const filteredData = [];
    let exactMatch = false;

    const check = this.props.filter.fn || function (itemToCheck, checkString) {
      if (checkString === '') {
        return true;
      }
      // by default, skip separators and hints
      if (List.isItemType(List.ListProps.Type.SEPARATOR, itemToCheck) || List.isItemType(List.ListProps.Type.HINT, itemToCheck)) {
        return true;
      }

      return itemToCheck.label.match(new RegExp(checkString, 'ig'));
    };

    for (let i = 0; i < this.props.data.length; i++) {
      const item = this.props.data[i];
      if (check(item, filterString, this.props.data)) {
        exactMatch = (item.label === filterString);

        if (this.props.multiple && !this.props.multiple.removeSelectedItems) {
          item.checkbox = !!this._multipleMap[item.key];
        }

        // Ignore item if it's multiple and is already selected
        if (!(this.props.multiple && this.props.multiple.removeSelectedItems && this._multipleMap[item.key])) {
          filteredData.push(item);
        }
      }
    }

    this._addButton = null;
    if ((this.props.add && filterString && !exactMatch) || (this.props.add && this.props.add.alwaysVisible)) {
      if (!(this.props.add.regexp && !this.props.add.regexp.test(filterString)) &&
      !(this.props.add.minlength && filterString.length < +this.props.add.minlength) ||
      this.props.add.alwaysVisible) {

        this._addButton = {
          prefix: this.props.add.prefix,
          label: this.props.add.label || filterString
        };
      }
    }

    return filteredData;
  }

  filterValue(setValue) {
    if (this.isInputMode() || this.props.filter) {
      const filter = findDOMNode(this.isInputMode() ? this.refs.filter : this._popup.refs.filter);

      if (typeof setValue === 'string' || typeof setValue === 'number') {
        filter.value = setValue;
      } else {
        return filter.value;
      }
    } else {
      return '';
    }

    return undefined;
  }

  isInputMode() {
    return (this.props.type === Type.INPUT);
  }

  isButtonMode() {
    return (this.props.type === Type.BUTTON);
  }

  _clickHandler() {
    if (this._popup && !this.props.disabled) {
      if (this._popup.isVisible()) {
        this._hidePopup();
      } else {
        this.props.onBeforeOpen();
        this._showPopup();
      }
    }
  }

  _filterChangeHandler(event) {
    if (this.isInputMode() && !this.state.focused) {
      return;
    }

    let filterValue = this.filterValue();

    if (filterValue === this.state.prevFilterValue) {
      return;
    }

    this.setState({prevFilterValue: filterValue});

    filterValue = filterValue.replace(/^\s+/g, '');
    this.props.onFilter(filterValue);
    if (this.props.allowAny) {
      const fakeSelected = {
        key: Math.random(),
        label: filterValue
      };
      this.setState({
        selected: filterValue === '' ? null : fakeSelected,
        selectedIndex: null
      }, function () {
        this.props.onSelect(fakeSelected, event);
        this.props.onChange(fakeSelected, event);
      });
    }
    !this._popup.isVisible() && this.props.onBeforeOpen();
    this._showPopup();
  }

  _rebuildMultipleMap(selected, multiple) {
    if (selected && multiple) {
      this._multipleMap = {};
      for (let i = 0; i < selected.length; i++) {
        this._multipleMap[selected[i].key] = true;
      }
    }
  }

  _listSelectHandler(selected, event) {
    const isItem = List.isItemType.bind(null, List.ListProps.Type.ITEM);
    const isCustomItem = List.isItemType.bind(null, List.ListProps.Type.CUSTOM);
    const isSelectItemEvent = event && (event.type === 'select' || event.type === 'keydown');
    if (isSelectItemEvent) {
      event.preventDefault();
    }

    if ((!isItem(selected) && !isCustomItem(selected)) || selected.disabled) {
      return;
    }

    if (!this.props.multiple) {
      this.setState({
        selected,
        selectedIndex: this._getSelectedIndex(selected, this.props.data)
      }, () => {
        const newFilterValue = this.isInputMode() && !this.props.hideSelected ? this._getItemLabel(selected) : '';
        this.filterValue(newFilterValue);
        this.props.onFilter(newFilterValue);
        this.props.onSelect(selected, event);
        this.props.onChange(selected, event);
        this._hidePopup(isSelectItemEvent);
      });
    } else {
      if (!selected.key) {
        throw new Error('Multiple selection requires each item to have the "key" property');
      }

      const currentSelection = this.state.selected;
      if (!this._multipleMap[selected.key]) {
        this._multipleMap[selected.key] = true;
        currentSelection.push(selected);
        this.props.onSelect && this.props.onSelect(selected, event);
      } else {
        Reflect.deleteProperty(this._multipleMap, selected.key);
        for (let i = 0; i < currentSelection.length; i++) {
          if (selected.key === currentSelection[i].key) {
            currentSelection.splice(i, 1);
            break;
          }
        }
        this.props.onDeselect && this.props.onDeselect(selected);
      }

      this.setState({
        selected: currentSelection,
        selectedIndex: this._getSelectedIndex(selected, this.props.data)
      }, function () {
        // redraw items
        if (this.props.multiple) {
          // setTimeout solves events order and bubbling issue
          setTimeout(() => {
            this.isInputMode() && this.clearFilter();
            this._showPopup();
          }, 0);
        }
      });

      this.props.onChange(currentSelection, event);
    }
  }

  _onClose(event) {
    if (this.isInputMode()) {
      if (!this.props.allowAny) {
        if (this.props.hideSelected || !this.state.selected || this.props.multiple) {
          this.clearFilter();
        } else if (this.state.selected) {
          this.filterValue(this._getItemLabel(this.state.selected));
        }
      }
    }
    // it's necessary to focus anchor on pressing ESC
    const isKeyboardEvent = event && event.type === 'keydown';
    this._hidePopup(isKeyboardEvent);
  }

  clearFilter() {
    this.filterValue('');
  }

  clear(event) {
    const empty = Select._getEmptyValue(this.props.multiple);

    this.setState({
      selected: empty,
      selectedIndex: null
    }, () => {
      this.props.onChange(empty, event);
    });

    return false;
  }

  _focusHandler() {
    this.props.onFocus();

    this.setState({
      shortcuts: true,
      focused: true
    });
  }

  _blurHandler() {
    this.props.onBlur();

    if (this._popup && this._popup.isVisible() && !this._popup.isClickingPopup) {
      window.setTimeout(() => {
        this.props.onClose();
        this._popup.hide();
      });
    }

    this.setState({
      shortcuts: false,
      focused: false
    });
  }

  _inputShortcutsEnabled() {
    if (!this._popup || this._popup.isVisible()) {
      return false;
    } else {
      return this.state.focused;
    }
  }

  _selectionIsEmpty() {
    return (this.props.multiple && !this.state.selected.length) || !this.state.selected;
  }

  _getSelectedLabel() {
    if (this._selectionIsEmpty()) {
      return this.props.label;
    } else {
      return this.props.selectedLabel || this._getSelectedString();
    }
  }

  _getButtonLabel() {
    return this._getSelectedLabel();
  }

  _getInputPlaceholder() {
    if (!this.props.allowAny) {
      return this._getSelectedLabel();
    } else {
      return '';
    }
  }

  _getSelectedString() {
    if (this.props.multiple) {
      const labels = [];
      for (let i = 0; i < this.state.selected.length; i++) {
        labels.push(this._getItemLabel(this.state.selected[i]));
      }
      return labels.join(', ');
    } else {
      return this._getItemLabel(this.state.selected);
    }
  }

  _getItemLabel(item) {
    return item.selectedLabel || item.label;
  }

  _getIcons() {
    const icons = [];

    if (this.props.clear && this.state.selected) {
      icons.push(
        <span
          className="ring-select__clear-icon"
          key="close"
          onClick={::this.clear}
        >
        <Icon
          glyph={require('jetbrains-icons/close.svg')}
          size={Icon.Size.Size14}
        />
      </span>);
    }

    if (this.state.selected && this.state.selected.icon) {
      icons.push(
        <span
          className="ring-select__selected-icon"
          key="selected"
          style={{backgroundImage: `url(${this.state.selected.icon})`}}
        />
      );
    }

    if (!this.props.hideArrow) {
      icons.push(
        <Icon
          glyph={require('jetbrains-icons/caret-down.svg')}
          key="hide"
          size={Icon.Size.Size16}
        />
      );
    }

    return icons;
  }

  render() {
    const buttonCS = classNames({
      'ring-select': true,
      'ring-select_disabled': this.props.disabled,
      'ring-select_input-mode': this.isInputMode(),
      'ring-button_disabled': this.props.disabled && !this.isInputMode(),
      'ring-js-shortcuts': true
    }, this.props.className);

    const icons = this._getIcons();

    const style = {
      paddingRight: 8 + icons.length * 16
    };

    const iconsNode = <span className="ring-select__icons">{icons}</span>;

    if (this.isInputMode()) {
      const inputCS = classNames({
        'ring-js-shortcuts': true,
        'ring-input_disabled': this.props.disabled
      });

      let filterValue;
      if (this.props.allowAny && this.state.selected) {
        filterValue = this._getItemLabel(this.state.selected);
      }

      return (
        <div
          className={buttonCS}
          onClick={::this._clickHandler}
        >
          <Input
            ref="filter"
            disabled={this.props.disabled}
            value={filterValue}
            className={inputCS}
            style={style}
            onInput={::this._filterChangeHandler}
            onChange={noop}
            onFocus={::this._focusHandler}
            onBlur={::this._blurHandler}
            shortcuts={this._inputShortcutsEnabled()}
            placeholder={this._getInputPlaceholder()}
            onKeyDown={::this.props.onKeyDown}
          />
          {iconsNode}
        </div>
      );
    } else if (this.isButtonMode()) {
      return (
        <Button
          className={buttonCS}
          disabled={this.props.disabled}
          onClick={::this._clickHandler}
          style={style}
          type="button"
        >
          <span className="ring-select__label">{this._getButtonLabel()}</span>
          {iconsNode}
        </Button>
      );
    } else {
      return <span />;
    }
  }
}
