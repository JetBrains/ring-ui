window.source = {
  "title": "Select",
  "url": "select.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport classNames from 'classnames';\nimport PropTypes from 'prop-types';\n\nimport {Anchor} from '../dropdown/dropdown';\nimport Avatar, {Size as AvatarSize} from '../avatar/avatar';\nimport Popup from '../popup/popup';\nimport List from '../list/list';\nimport Input, {Size} from '../input/input';\nimport Shortcuts from '../shortcuts/shortcuts';\nimport Icon, {ChevronDownIcon, CloseIcon} from '../icon';\nimport Button from '../button/button';\nimport buttonStyles from '../button/button.css';\nimport getUID from '../global/get-uid';\nimport rerenderHOC from '../global/rerender-hoc';\nimport fuzzyHighlight from '../global/fuzzy-highlight';\nimport Theme from '../global/theme';\n\nimport SelectPopup from './select__popup';\nimport styles from './select.css';\n\n/**\n * @name Select\n * @category Components\n * @tags Ring UI Language\n * @description Displays a select.\n * @example-file ./select.examples.html\n */\n\nfunction noop() {}\n\n/**\n * @enum {number}\n */\nconst Type = {\n  BUTTON: 'BUTTON',\n  INPUT: 'INPUT',\n  CUSTOM: 'CUSTOM',\n  INLINE: 'INLINE',\n  MATERIAL: 'MATERIAL',\n  INPUT_WITHOUT_CONTROLS: 'INPUT_WITHOUT_CONTROLS'\n};\n\n/**\n * @name Select\n * @constructor\n * @extends {Component}\n */\n// eslint-disable-next-line react/no-deprecated\nexport default class Select extends Component {\n  static Type = Type;\n  static Size = Size;\n  static Theme = Theme;\n\n  static _getEmptyValue(multiple) {\n    return multiple ? [] : null;\n  }\n\n  static propTypes = {\n    className: PropTypes.string,\n    multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),\n    allowAny: PropTypes.bool,\n    filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),\n\n    getInitial: PropTypes.func,\n    onClose: PropTypes.func,\n    onOpen: PropTypes.func,\n    onDone: PropTypes.func,\n    onFilter: PropTypes.func,\n    onChange: PropTypes.func,\n    onReset: PropTypes.func,\n    onLoadMore: PropTypes.func,\n    onAdd: PropTypes.func,\n    onBeforeOpen: PropTypes.func,\n    onSelect: PropTypes.func,\n    onDeselect: PropTypes.func,\n    onFocus: PropTypes.func,\n    onBlur: PropTypes.func,\n    onKeyDown: PropTypes.func,\n\n    selected: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),\n    data: PropTypes.array,\n    tags: PropTypes.object,\n    targetElement: PropTypes.object,\n    loading: PropTypes.bool,\n    loadingMessage: PropTypes.string,\n    notFoundMessage: PropTypes.string,\n    maxHeight: PropTypes.number,\n    minWidth: PropTypes.number,\n    directions: PropTypes.array,\n    popupClassName: PropTypes.string,\n    top: PropTypes.number,\n    left: PropTypes.number,\n    renderOptimization: PropTypes.bool,\n    ringPopupTarget: PropTypes.string,\n    hint: List.ListHint.propTypes.label,\n    add: PropTypes.object,\n    type: PropTypes.oneOf(Object.values(Type)),\n    disabled: PropTypes.bool,\n    hideSelected: PropTypes.bool,\n    label: PropTypes.string,\n    selectedLabel: PropTypes.string,\n    clear: PropTypes.bool,\n    hideArrow: PropTypes.bool,\n    compact: PropTypes.bool,\n    size: PropTypes.oneOf(Object.values(Size)),\n    theme: PropTypes.string\n  };\n\n  static defaultProps = {\n    data: [],\n    filter: false, // enable filter (not in INPUT modes)\n    multiple: false, // multiple can be an object - see demo for more information\n    clear: false, // enable clear button that clears the \"selected\" state\n    loading: false, // show a loading indicator while data is loading\n    disabled: false, // disable select\n\n    loadingMessage: 'Loading...',\n    notFoundMessage: 'No options found',\n\n    type: Type.MATERIAL,\n    size: Size.M,\n    targetElement: null, // element to bind the popup to (select BUTTON or INPUT by default)\n    hideSelected: false, // INPUT mode: clears the input after an option is selected (useful when the selection is displayed in some custom way elsewhere)\n    allowAny: false, // INPUT mode: allows any value to be entered, hides the dropdown icon\n    hideArrow: false, // hide dropdown arrow icon\n\n    maxHeight: 600, // height of the options list, including the filter and the 'Add' button\n    directions: [\n      Popup.PopupProps.Directions.BOTTOM_RIGHT,\n      Popup.PopupProps.Directions.BOTTOM_LEFT,\n      Popup.PopupProps.Directions.TOP_LEFT,\n      Popup.PopupProps.Directions.TOP_RIGHT\n    ],\n\n    selected: null, // current selection (item / array of items)\n\n    label: '', // BUTTON label or INPUT placeholder (nothing selected)\n    selectedLabel: '', // BUTTON label or INPUT placeholder (something selected)\n    hint: null, // hint text to display under the list\n\n    shortcutsEnabled: false,\n\n    onBeforeOpen: noop,\n    onLoadMore: noop,\n    onOpen: noop,\n    onClose: noop,\n    onFilter: noop, // search string as first argument\n    onFocus: noop,\n    onBlur: noop,\n    onKeyDown: noop,\n\n    onSelect: noop, // single + multi\n    onDeselect: noop, // multi\n    onChange: noop, // multi\n\n    onAdd: noop, // search string as first argument\n\n    onDone: noop,\n    onReset: noop,\n\n    tags: null,\n    onRemoveTag: noop,\n    ringPopupTarget: null,\n    theme: Theme.LIGHT\n  };\n\n  state = {\n    data: [],\n    shownData: [],\n    selected: (this.props.multiple ? [] : null),\n    selectedIndex: null,\n    filterValue: this.props.filter && this.props.filter.value || '',\n    shortcutsEnabled: false,\n    popupShortcuts: false,\n    showPopup: false\n  };\n\n  componentWillMount() {\n    this.updateState(this.props, true);\n  }\n\n  componentDidMount() {\n    this._rebuildMultipleMap(this.state.selected, this.props.multiple);\n  }\n\n  componentWillReceiveProps(newProps) {\n    this.updateState(newProps);\n  }\n\n  componentDidUpdate(prevProps, prevState) {\n    const {showPopup} = this.state;\n\n    if (prevState.showPopup && !showPopup) {\n      this.props.onClose();\n    } else if (!prevState.showPopup && showPopup) {\n      this.props.onOpen();\n    }\n  }\n\n  shortcutsScope = getUID('select-');\n  _focusHandler = () => {\n    this.props.onFocus();\n\n    this.setState({\n      shortcutsEnabled: true,\n      focused: true\n    });\n  };\n\n  _blurHandler = () => {\n    this.props.onBlur();\n\n    if (this._popup && this._popup.isVisible() && !this._popup.isClickingPopup) {\n      window.setTimeout(() => {\n        this.setState({showPopup: false});\n      });\n    }\n\n    if (!this._popup.isClickingPopup) {\n      this.setState({\n        shortcutsEnabled: false,\n        focused: false\n      });\n    }\n  };\n\n  nodeRef = el => {\n    this.node = el;\n  };\n\n  _popup = null;\n  _addButton = null;\n  _multipleMap = {};\n\n  _onEnter = () => {\n    this.props.onDone();\n\n    if (!this._popup.isVisible() && this.props.allowAny) {\n      return true;\n    }\n\n    return undefined;\n  };\n\n  _onEsc = event => {\n    if (!this._popup.isVisible()) {\n      return true;\n    } else if (this.props.multiple || !this.props.getInitial) {\n      return false;\n    }\n\n    const selected = {\n      key: Math.random(),\n      label: this.props.getInitial()\n    };\n\n    this.setState({\n      selected,\n      filterValue: this.getValueForFilter(selected)\n    }, () => {\n      this.props.onChange(selected, event);\n      this.props.onReset();\n    });\n\n    return undefined;\n  };\n\n  _inputShortcutHandler = () => {\n    if (this.state.focused && this._popup && !this._popup.isVisible()) {\n      this._clickHandler();\n    }\n  };\n\n  _handleMultipleToggling(multiple) {\n    const empty = Select._getEmptyValue(multiple);\n    this.setState({selected: empty}, () => {\n      this.props.onChange(empty);\n    });\n    this._rebuildMultipleMap(empty, multiple);\n  }\n\n  getValueForFilter(selected) {\n    return selected && this.isInputMode() ? this._getItemLabel(selected) : this.state.filterValue;\n  }\n\n  updateState(props, initial) {\n    const {multiple} = this.props;\n\n    if ('data' in props && props.data !== this.props.data) {\n      const shownData = this.getListItems(this.filterValue(), props.data);\n      this.setState({shownData});\n\n      if (this.state.selected && props.data !== this.props.data) {\n        this.setState(prevState => ({\n          selectedIndex: this._getSelectedIndex(\n            prevState.selected,\n            props.data\n          ),\n          prevFilterValue: this.getValueForFilter(prevState.selected)\n        }));\n        this._rebuildMultipleMap(this.state.selected, multiple);\n      }\n    }\n\n    if ('selected' in props && (\n      initial ||\n      props.selected !== this.props.selected\n    )) {\n      const selected = props.selected || Select._getEmptyValue(multiple);\n\n      const selectedIndex = this._getSelectedIndex(\n        selected,\n        props.data || this.props.data\n      );\n\n      const newState = {\n        selected,\n        prevFilterValue: this.getValueForFilter(selected)\n      };\n\n      if (!multiple || !isSameSelected(this.props.selected, selected)) {\n        Object.assign(newState, {selectedIndex});\n      }\n\n      this.setState(newState);\n\n      this._rebuildMultipleMap(selected, multiple);\n    }\n\n    if (props.multiple !== multiple) {\n      this._handleMultipleToggling(props.multiple);\n    }\n\n    function isSameSelected(prevSelected, selected) {\n      if (!prevSelected || !selected || prevSelected.length !== selected.length) {\n        return false;\n      }\n\n      const keysMap = selected.reduce((result, item) => {\n        result[item.key] = true;\n        return result;\n      }, {});\n\n      return prevSelected.every(it => keysMap[it.key]);\n    }\n  }\n\n  _getSelectedIndex(selected, data) {\n    if ((this.props.multiple && !selected.length) || (!this.props.multiple && !selected)) {\n      return null;\n    }\n\n    for (let i = 0; i < data.length; i++) {\n      const item = data[i];\n\n      if (item.key === undefined) {\n        continue;\n      }\n\n      if (\n        (this.props.multiple && item.key === selected[0].key) ||\n        (!this.props.multiple && item.key === selected.key)\n      ) {\n        return i;\n      }\n    }\n\n    return null;\n  }\n\n  popupRef = el => {\n    this._popup = el;\n  };\n\n  _getResetOption() {\n    const isOptionsSelected = this.state.selected && this.state.selected.length;\n    const hasTagsResetProp = this.props.tags && this.props.tags.reset;\n    if (!isOptionsSelected || !hasTagsResetProp) {\n      return null;\n    }\n\n    const {reset} = this.props.tags;\n    return {\n      isResetItem: true,\n      separator: reset.separator,\n      key: reset.label,\n      rgItemType: List.ListProps.Type.ITEM,\n      label: reset.label,\n      glyph: reset.glyph,\n      iconSize: Icon.Size.Size14,\n      className: 'ring-select__clear-tags',\n      onClick: (item, event) => {\n        this.clear(event);\n        this._resetMultipleSelectionMap();\n        this.clearFilter();\n        this.props.onFilter('');\n        this.setState(prevState => ({\n          shownData: prevState.shownData.slice(reset.separator ? 2 : 1)\n        }));\n        this._redrawPopup();\n      }\n    };\n  }\n\n  _prependResetOption(shownData) {\n    const resetOption = this._getResetOption();\n    const margin = {rgItemType: List.ListProps.Type.MARGIN};\n    if (resetOption) {\n      const resetItems = [margin, resetOption, margin];\n      if (resetOption.separator) {\n        resetItems.push({\n          rgItemType: List.ListProps.Type.SEPARATOR\n        });\n      }\n      return resetItems.concat(shownData);\n    }\n    return shownData;\n  }\n\n  _renderPopup() {\n    const anchorElement = this.props.targetElement || this.node;\n    const {showPopup, shownData} = this.state;\n    const _shownData = this._prependResetOption(shownData);\n    let message = null;\n\n    if (this.props.loading) {\n      message = this.props.loadingMessage;\n    } else if (!shownData.length) {\n      message = this.props.notFoundMessage;\n    }\n\n    return (\n      <SelectPopup\n        data={_shownData}\n        message={message}\n        toolbar={showPopup && this.getToolbar()}\n        loading={this.props.loading}\n        activeIndex={this.state.selectedIndex}\n        hidden={!showPopup}\n        ref={this.popupRef}\n        maxHeight={this.props.maxHeight}\n        minWidth={this.props.minWidth}\n        directions={this.props.directions}\n        className={this.props.popupClassName}\n        top={this.props.top}\n        left={this.props.left}\n        filter={this.isInputMode() ? false : this.props.filter} // disable popup filter in INPUT mode\n        filterValue={this.state.filterValue}\n        anchorElement={anchorElement}\n        onCloseAttempt={this._onCloseAttempt}\n        onSelect={this._listSelectHandler}\n        onFilter={this._filterChangeHandler}\n        onClear={this.clearFilter}\n        onLoadMore={this.props.onLoadMore}\n        isInputMode={this.isInputMode()}\n        selected={this.state.selected}\n        tags={this.props.tags}\n        compact={this.props.compact}\n        renderOptimization={this.props.renderOptimization}\n        ringPopupTarget={this.props.ringPopupTarget}\n      />\n    );\n  }\n\n  _showPopup() {\n    if (!this.node) {\n      return;\n    }\n\n    const shownData = this.getListItems(this.filterValue());\n    this.setState({\n      showPopup: !!shownData.length || !this.props.allowAny,\n      shownData\n    });\n  }\n\n  _hidePopup(tryFocusAnchor) {\n    if (this.node && this.state.showPopup) {\n      this.setState({\n        showPopup: false,\n        filterValue: ''\n      });\n\n      if (tryFocusAnchor) {\n        const restoreFocusNode = this.props.targetElement ||\n          this.node.query('[data-test=ring-select__focus]');\n        if (restoreFocusNode) {\n          restoreFocusNode.focus();\n        }\n      }\n    }\n  }\n\n  addHandler = () => {\n    this._hidePopup();\n    this.props.onAdd(this.filterValue());\n  };\n\n  getToolbar() {\n    const isToolbarHasElements = this._addButton || this.props.hint;\n    if (!isToolbarHasElements) {\n      return null;\n    }\n\n    let hint = null;\n    let addButton = null;\n\n    if (this.props.hint) {\n      hint = (\n        <List.ListHint\n          label={this.props.hint}\n          data-test=\"ring-select-toolbar-hint\"\n        />\n      );\n    }\n\n    if (this._addButton) {\n      const {prefix, label, delayed} = this._addButton;\n      addButton = (\n        <Button\n          text\n          delayed={delayed}\n          className={styles.button}\n          onClick={this.addHandler}\n          data-test=\"ring-select-toolbar-button\"\n        >\n          {prefix ? `${prefix} ${label}` : label}\n        </Button>\n      );\n    }\n\n    return (\n      <div\n        className={classNames({\n          [styles.toolbar]: addButton\n        })}\n        data-test=\"ring-select-toolbar\"\n      >\n        {addButton}\n        {hint}\n      </div>\n    );\n  }\n\n  getLowerCaseLabel(item) {\n    if (\n      List.isItemType(List.ListProps.Type.SEPARATOR, item) ||\n      List.isItemType(List.ListProps.Type.HINT, item) ||\n      item.label == null\n    ) {\n      return null;\n    }\n\n    return item.label.toLowerCase();\n  }\n\n  doesLabelMatch(itemToCheck, fn) {\n    const lowerCaseLabel = this.getLowerCaseLabel(itemToCheck);\n\n    if (lowerCaseLabel == null) {\n      return true;\n    }\n\n    return fn(lowerCaseLabel);\n  }\n\n  getFilterFn() {\n    const {filter} = this.props;\n\n    if (filter.fn) {\n      return filter.fn;\n    }\n\n    if (filter.fuzzy) {\n      return (itemToCheck, checkString) =>\n        this.doesLabelMatch(itemToCheck, lowerCaseLabel =>\n          fuzzyHighlight(checkString, lowerCaseLabel).matched\n        );\n    }\n\n    return (itemToCheck, checkString) =>\n      this.doesLabelMatch(itemToCheck, lowerCaseLabel =>\n        lowerCaseLabel.indexOf(checkString) >= 0\n      );\n  }\n\n  getListItems(rawFilterString, data = this.props.data) {\n    let filterString = rawFilterString.trim();\n\n    if (this.isInputMode() && this.state.selected && filterString === this.state.selected.label) {\n      filterString = ''; // ignore multiple if it is exactly the selected item\n    }\n    const lowerCaseString = filterString.toLowerCase();\n\n    const filteredData = [];\n    let exactMatch = false;\n\n    const check = this.getFilterFn();\n\n    for (let i = 0; i < data.length; i++) {\n      const item = data[i];\n      if (check(item, lowerCaseString, data)) {\n        exactMatch = (item.label === filterString);\n\n        if (this.props.multiple && !this.props.multiple.removeSelectedItems) {\n          item.checkbox = !!this._multipleMap[item.key];\n        }\n\n        // Ignore item if it's multiple and is already selected\n        if (\n          !(this.props.multiple &&\n            this.props.multiple.removeSelectedItems &&\n            this._multipleMap[item.key])\n        ) {\n          filteredData.push(item);\n        }\n      }\n    }\n\n    this._addButton = null;\n    const {add} = this.props;\n    if (\n      (add && filterString && !exactMatch) ||\n      (add && add.alwaysVisible)\n    ) {\n      if (!(add.regexp && !add.regexp.test(filterString)) &&\n        !(add.minlength && filterString.length < +add.minlength) ||\n        add.alwaysVisible) {\n\n        this._addButton = {\n          prefix: add.prefix,\n          label: add.label || filterString,\n          delayed: add.hasOwnProperty('delayed') ? add.delayed : true\n        };\n      }\n    }\n\n    return filteredData;\n  }\n\n  filterValue(setValue) {\n    if (typeof setValue === 'string' || typeof setValue === 'number') {\n      this.setState({filterValue: setValue});\n    } else {\n      return this.state.filterValue;\n    }\n    return undefined;\n  }\n\n  isInputMode() {\n    return (this.props.type === Type.INPUT || this.props.type === Type.INPUT_WITHOUT_CONTROLS);\n  }\n\n  _clickHandler = () => {\n    if (!this.props.disabled) {\n      if (this.state.showPopup) {\n        this._hidePopup();\n      } else {\n        this.props.onBeforeOpen();\n        this._showPopup();\n      }\n    }\n  };\n\n  _filterChangeHandler = e => {\n    this._setFilter(e.target.value, e);\n  };\n\n  _setFilter = (value, event = {}) => {\n    if (this.isInputMode() && !this.state.focused) {\n      return;\n    }\n\n    if (value === this.state.filterValue) {\n      return;\n    }\n\n    const filterValue = value.replace(/^\\s+/g, '');\n    this.props.onFilter(filterValue);\n    if (this.props.allowAny) {\n      const fakeSelected = {\n        key: Math.random(),\n        label: filterValue\n      };\n      this.setState({\n        selected: filterValue === '' ? null : fakeSelected,\n        selectedIndex: null\n      }, () => {\n        this.props.onSelect(fakeSelected, event);\n        this.props.onChange(fakeSelected, event);\n      });\n    }\n    !this._popup.isVisible() && this.props.onBeforeOpen();\n\n    this.setState({filterValue}, () => {\n      this._showPopup();\n    });\n  };\n\n  _resetMultipleSelectionMap() {\n    this._multipleMap = {};\n    return this._multipleMap;\n  }\n\n  _rebuildMultipleMap(selected, multiple) {\n    if (selected && multiple) {\n      this._resetMultipleSelectionMap();\n      for (let i = 0; i < selected.length; i++) {\n        this._multipleMap[selected[i].key] = true;\n      }\n    }\n  }\n\n  _redrawPopup = () => {\n    if (this.props.multiple) {\n      setTimeout(() => { //setTimeout solves events order and bubbling issue\n        this.isInputMode() && this.clearFilter();\n        this._showPopup();\n      }, 0);\n    }\n  };\n\n  _listSelectHandler = (selected, event) => {\n    const isItem = List.isItemType.bind(null, List.ListProps.Type.ITEM);\n    const isCustomItem = List.isItemType.bind(null, List.ListProps.Type.CUSTOM);\n    const isSelectItemEvent = event && (event.type === 'select' || event.type === 'keydown');\n\n    if (isSelectItemEvent) {\n      event.preventDefault();\n    }\n\n    if ((!isItem(selected) && !isCustomItem(selected)) ||\n      selected.disabled ||\n      selected.isResetItem) {\n      return;\n    }\n\n    if (!this.props.multiple) {\n      this._hidePopup(isSelectItemEvent);\n      this.setState({\n        filterValue: '',\n        selected,\n        selectedIndex: this._getSelectedIndex(selected, this.props.data)\n      }, () => {\n        const newFilterValue = this.isInputMode() && !this.props.hideSelected\n          ? this._getItemLabel(selected)\n          : '';\n        this.filterValue(newFilterValue);\n        this.props.onFilter(newFilterValue);\n        this.props.onSelect(selected, event);\n        this.props.onChange(selected, event);\n      });\n    } else {\n      if (selected.key == null) {\n        throw new Error('Multiple selection requires each item to have the \"key\" property');\n      }\n\n      this.setState(prevState => {\n        const currentSelection = prevState.selected;\n        let nextSelection;\n\n        if (!this._multipleMap[selected.key]) {\n          this._multipleMap[selected.key] = true;\n          nextSelection = currentSelection.concat(selected);\n          this.props.onSelect && this.props.onSelect(selected, event);\n        } else {\n          delete this._multipleMap[selected.key];\n          nextSelection = currentSelection.filter(item => item.key !== selected.key);\n          this.props.onDeselect && this.props.onDeselect(selected);\n        }\n\n        this.props.onChange(nextSelection, event);\n\n        return {\n          filterValue: '',\n          selected: nextSelection,\n          selectedIndex: this._getSelectedIndex(selected, this.props.data)\n        };\n\n      }, this._redrawPopup);\n\n    }\n  };\n\n  _onCloseAttempt = (event, isEsc) => {\n    if (this.isInputMode()) {\n      if (!this.props.allowAny) {\n        if (this.props.hideSelected || !this.state.selected || this.props.multiple) {\n          this.clearFilter();\n        } else if (this.state.selected) {\n          this.filterValue(this._getItemLabel(this.state.selected));\n        }\n      }\n    }\n\n    const isTagRemoved = this.props.tags && event && event.target &&\n      event.target.matches('[data-test=\"ring-tag-remove\"]');\n\n    if (!isTagRemoved) {\n      this._hidePopup(isEsc);\n    }\n  };\n\n  clearFilter = () => {\n    this.filterValue('');\n  }\n\n  clear = event => {\n    if (event) {\n      event.stopPropagation();\n    }\n    const empty = Select._getEmptyValue(this.props.multiple);\n\n    this.setState({\n      selected: empty,\n      selectedIndex: null,\n      filterValue: ''\n    }, () => {\n      if (this.props.onChange) {\n        this.props.onChange(empty, event);\n      }\n    });\n\n    return false;\n  };\n\n  _selectionIsEmpty() {\n    return (this.props.multiple && !this.state.selected.length) || !this.state.selected;\n  }\n\n  _getLabel() {\n    return this.props.label || this.props.selectedLabel || 'Select an option';\n  }\n\n  _getInputPlaceholder() {\n    if (!this.props.allowAny) {\n      return this._getLabel();\n    } else {\n      return '';\n    }\n  }\n\n  _getSelectedString() {\n    if (this.props.multiple) {\n      const labels = [];\n      for (let i = 0; i < this.state.selected.length; i++) {\n        labels.push(this._getItemLabel(this.state.selected[i]));\n      }\n      return labels.filter(Boolean).join(', ');\n    } else {\n      return this._getItemLabel(this.state.selected);\n    }\n  }\n\n  _getItemLabel(item) {\n    const {selectedLabel, label} = item;\n    return selectedLabel != null ? selectedLabel : label;\n  }\n\n  _getIcons() {\n    const icons = [];\n\n    if (this.state.selected && this.state.selected.icon) {\n      icons.push(\n        <span\n          className={styles.selectedIcon}\n          key=\"selected\"\n          onClick={this._clickHandler}\n          style={{backgroundImage: `url(${this.state.selected.icon})`}}\n        />\n      );\n    }\n\n    if (this.props.clear && !this.props.disabled && this.state.selected) {\n      icons.push(\n        <Button\n          className={styles.clearIcon}\n          key=\"close\"\n          onClick={this.clear}\n          icon={CloseIcon}\n          iconSize={CloseIcon.Size.Size14}\n        />\n      );\n    }\n\n    if (!this.props.hideArrow) {\n      icons.push(\n        <ChevronDownIcon\n          key=\"hide\"\n          onClick={this._clickHandler}\n          size={ChevronDownIcon.Size.Size14}\n        />\n      );\n    }\n\n    return icons;\n  }\n\n  _getAvatar() {\n    return this.state.selected && this.state.selected.avatar && (\n      <Avatar\n        className={styles.avatar}\n        url={this.state.selected.avatar}\n        size={AvatarSize.Size20}\n      />\n    );\n  }\n\n  popupRef = el => {\n    this._popup = el;\n  };\n\n  buttonRef = el => {\n    this.button = el;\n  };\n\n  filterRef = el => {\n    this.filter = el;\n  };\n\n  getShortcutsMap() {\n    return {\n      enter: this._onEnter,\n      esc: this._onEsc,\n      up: this._inputShortcutHandler,\n      down: this._inputShortcutHandler,\n      right: noop,\n      left: noop,\n      'shift+up': noop,\n      'shift+down': noop,\n      space: noop\n    };\n  }\n\n  render() {\n    const {shortcutsEnabled} = this.state;\n    const classes = classNames(styles.select, 'ring-js-shortcuts', this.props.className, {\n      [styles[`size${this.props.size}`]]: this.props.type !== Type.INLINE,\n      [styles.disabled]: this.props.disabled\n    });\n\n    const icons = this._getIcons();\n\n    const style = {\n      // eslint-disable-next-line no-magic-numbers\n      paddingRight: icons.length * 20\n    };\n\n    const iconsNode = <span className={styles.icons}>{icons}</span>;\n\n    switch (this.props.type) {\n      case Type.INPUT_WITHOUT_CONTROLS:\n      case Type.INPUT: return (\n        <div\n          ref={this.nodeRef}\n          className={classNames(classes, styles.inputMode)}\n          onClick={this._clickHandler}\n          data-test=\"ring-select\"\n        >\n          {shortcutsEnabled && (\n            <Shortcuts\n              map={this.getShortcutsMap()}\n              scope={this.shortcutsScope}\n            />\n          )}\n          <Input\n            inputRef={this.filterRef}\n            disabled={this.props.disabled}\n            value={this.state.filterValue}\n            borderless={this.props.type === Type.INPUT_WITHOUT_CONTROLS}\n            style={style}\n            size={Size.FULL}\n            onChange={this._filterChangeHandler}\n            onFocus={this._focusHandler}\n            onBlur={this._blurHandler}\n\n            placeholder={this._getInputPlaceholder()}\n            onKeyDown={this.props.onKeyDown}\n            data-test=\"ring-select__focus\"\n          />\n          {this.props.type === Type.INPUT && iconsNode}\n          {this._renderPopup()}\n        </div>\n      );\n      case Type.BUTTON:\n        return (\n          <div\n            ref={this.nodeRef}\n            className={classNames(classes, styles.buttonMode)}\n            data-test=\"ring-select\"\n            onClick={this._clickHandler}\n          >\n            {shortcutsEnabled && (\n              <Shortcuts\n                map={this.getShortcutsMap()}\n                scope={this.shortcutsScope}\n              />\n            )}\n            <div\n              className={classNames(\n                buttonStyles.button,\n                buttonStyles[this.props.theme],\n                styles.buttonValue,\n                {\n                  [styles.buttonValueOpen]: this.state.showPopup\n                })\n              }\n              tabIndex={0}\n              disabled={this.props.disabled}\n              style={style}\n              data-test=\"ring-select__button\"\n            >\n              {this._getAvatar()}\n              {this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString()}\n              {iconsNode}\n            </div>\n            {this._renderPopup()}\n          </div>\n        );\n\n      case Type.MATERIAL:\n        return (\n          <div\n            ref={this.nodeRef}\n            className={classNames(classes, styles.materialMode)}\n            data-test=\"ring-select\"\n            onClick={this._clickHandler}\n          >\n            {shortcutsEnabled && (\n              <Shortcuts\n                map={this.getShortcutsMap()}\n                scope={this.shortcutsScope}\n              />\n            )}\n            {!this._selectionIsEmpty() && this.props.selectedLabel && (\n              <span className={styles.selectedLabel}>{this.props.selectedLabel}</span>\n            )}\n            <button\n              type=\"button\"\n              disabled={this.props.disabled}\n              className={classNames(styles.value, {\n                [styles.open]: this.state.showPopup,\n                [styles.label]: this._selectionIsEmpty()\n              })}\n              style={style}\n              data-test=\"ring-select__focus\"\n              ref={this.buttonRef}\n            >\n              {this._getAvatar()}\n              {this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString()}\n            </button>\n            {iconsNode}\n            {this._renderPopup()}\n          </div>\n        );\n      case Type.INLINE:\n        return (\n          <div\n            className={classes}\n            ref={this.nodeRef}\n            data-test=\"ring-select\"\n            onClick={this._clickHandler}\n          >\n            {shortcutsEnabled && (\n              <Shortcuts\n                map={this.getShortcutsMap()}\n                scope={this.shortcutsScope}\n              />\n            )}\n            <Anchor\n              data-test=\"ring-select__focus\"\n              disabled={this.props.disabled}\n            >\n              {this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString()}\n            </Anchor>\n            {this._renderPopup()}\n          </div>\n        );\n      default:\n        return (\n          <span ref={this.nodeRef} data-test=\"ring-select\">\n            {this._renderPopup()}\n          </span>\n        );\n    }\n  }\n}\n\nexport const RerenderableSelect = rerenderHOC(Select, {captureNode: false});\n",
  "examples": [
    {
      "name": "Select with a filter",
      "url": "examples/select/select-with-a-filter.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<p>test</p>\n<div id=\"demo\" class=\"demo\"></div>\n<button id=\"clear\">Clear selected</button>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\npadding: 8px;\nwidth: 50%;\n}\n\n:global(.demo) {\n  margin: 16px 0;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst data = [\n  {'label': 'One', 'key': '1', 'type': 'user'},\n  {'label': 'Group', 'key': '2', 'description': 'Long descriptions', 'type': 'user'},\n  {'label': 'Three', 'key': '3', 'type': 'user'},\n  {\n    'label': 'With icon',\n    key: 4,\n    icon: 'http://flagpedia.net/data/flags/mini/de.png'\n  }\n];\n\nfunction renderSelect() {\n  render(\n    <Select\n      selectedLabel=\"Option\"\n      label=\"Please select option\"\n      filter\n      clear\n      selected={data[1]}\n      data={data}\n    />,\n  document.getElementById('demo'));\n}\n\nrenderSelect();\n\ndocument.getElementById('clear').addEventListener('click', function () {\n  data.selected = null;\n  renderSelect();\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-button with a filter",
      "url": "examples/select/select-button-with-a-filter.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\" class=\"demo\"></div>\n<button id=\"clear\">Clear selected</button>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.demo) {\n  margin: 16px 0;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst data = [\n  {'label': 'One', 'key': '1', 'type': 'user'},\n  {'label': 'Group', 'key': '2', 'description': 'Long descriptions', 'type': 'user'},\n  {'label': 'Three', 'key': '3', 'type': 'user'},\n  {\n    'label': 'With icon',\n    key: 4,\n    icon: 'http://flagpedia.net/data/flags/mini/de.png'\n  }\n];\n\nfunction renderSelect() {\n  render(\n    <Select\n      type={Select.Type.BUTTON}\n      selectedLabel=\"Option\"\n      label=\"Please select option\"\n      filter\n      clear\n      selected={data[1]}\n      data={data}\n    />,\n  document.getElementById('demo'));\n}\n\nrenderSelect();\n\ndocument.getElementById('clear').addEventListener('click', function () {\n  data.selected = null;\n  renderSelect();\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Inline select with a filter",
      "url": "examples/select/inline-select-with-a-filter.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<p>test</p>\n<div id=\"demo\" class=\"demo\"></div>\n<button id=\"clear\">Clear selected</button>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  padding: 8px;\n  width: 50%;\n}\n\n:global(.demo) {\n  margin: 16px 0;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst data = [\n  {'label': 'One', 'key': '1', 'type': 'user'},\n  {'label': 'Group', 'key': '2', 'type': 'user'},\n  {'label': 'Three', 'key': '3', 'type': 'user'},\n];\n\nfunction renderSelect() {\n  render(\n    [\n      'Selected option is ',\n      <Select\n        key=\"select\"\n        type={Select.Type.INLINE}\n        filter\n        clear\n        selected={data[1]}\n        data={data}\n      />\n    ],\n    document.getElementById('demo')\n  );\n}\n\nrenderSelect();\n\ndocument.getElementById('clear').addEventListener('click', function () {\n  data.selected = null;\n  renderSelect();\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Inline select (opens to left)",
      "url": "examples/select/inline-select-opens-to-left.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<p>test</p>\n<div id=\"demo\" class=\"demo\"></div>\n<button id=\"clear\">Clear selected</button>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  padding: 8px;\n  padding-left: 64px;\n  width: 50%;\n}\n\n:global(.demo) {\n  margin: 16px 0;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\nimport Popup from '@jetbrains/ring-ui/components/popup/popup';\n\nconst data = [\n  {'label': 'One', 'key': '1', 'type': 'user'},\n  {'label': 'Group', 'key': '2', 'type': 'user'},\n  {'label': 'Three', 'key': '3', 'type': 'user'},\n];\n\nfunction renderSelect() {\n  render(\n    [\n      'Selected option is ',\n      <Select\n        key=\"select\"\n        type={Select.Type.INLINE}\n        selected={data[1]}\n        data={data}\n        directions={[Popup.PopupProps.Directions.BOTTOM_LEFT]}\n      />\n    ],\n    document.getElementById('demo')\n  );\n}\n\nrenderSelect();\n\ndocument.getElementById('clear').addEventListener('click', function () {\n  data.selected = null;\n  renderSelect();\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select with server-side filtering",
      "url": "examples/select/select-with-server-side-filtering.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\nimport React, {Component} from 'react';\nimport Source from '@jetbrains/ring-ui/components/list/list__users-groups-source';\nimport hubConfig from '@ring-ui/docs/components/hub-config';\nimport Auth from '@jetbrains/ring-ui/components/auth/auth';\n\nconst alwaysTrue = () => true;\n\nclass UserList extends Component {\n  state = {\n    users: [],\n    request: null\n  };\n  auth = new Auth(hubConfig);\n  source = new Source(this.auth, {\n    searchMax: 8\n  });\n\n  componentDidMount() {\n    this.auth.init();\n    this.loadData();\n  }\n\n  loadData = async query => {\n    const request = this.source.getForList(query);\n    this.setState({request});\n\n    const users = await request;\n\n    // only the latest request is relevant\n    if (this.state.request === request) {\n      this.setState({\n        users,\n        request: null\n      });\n    }\n  }\n\n  render() {\n    return (\n      <Select\n        data={this.state.users}\n        label=\"Set owner\"\n        selectedLabel=\"Owner\"\n        filter={{\n          placeholder: 'Search user or group',\n          fn: alwaysTrue // disable client filtering\n        }}\n        onFilter={this.loadData}\n        loading={!!this.state.request}\n      />\n    );\n  }\n}\n\nrender(<UserList />, document.getElementById('demo'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select with fuzzy search filter",
      "url": "examples/select/select-with-fuzzy-search-filter.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<p>test</p>\n<div id=\"demo\"></div>\n<button id=\"clear\">Clear selected</button>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\npadding: 8px;\nwidth: 50%;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\nimport '@jetbrains/ring-ui/components/input-size/input-size.scss';\n\nconst data = [\n  {'label': 'One', 'key': '1', 'type': 'user'},\n  {'label': 'Group', 'key': '2', 'type': 'user'},\n  {'label': 'Three', 'key': '3', 'type': 'user'},\n  {\n    'label': 'With icon',\n    key: 4,\n    icon: 'http://flagpedia.net/data/flags/mini/de.png'\n  }\n];\n\nfunction renderSelect() {\n  render(<Select filter={{fuzzy: true}} clear selected={data[1]} data={data}/>,\n  document.getElementById('demo'));\n}\n\nrenderSelect();\n\ndocument.getElementById('clear').addEventListener('click', function () {\n  data.selected = null;\n  renderSelect();\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select with a large dataset",
      "url": "examples/select/select-with-a-large-dataset.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\npadding: 8px;\nwidth: 50%;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst elementsNum = 100000;\nconst selectedIndex = parseInt(elementsNum / 2);\nconst dataset = [];\nfor (let i = 0; i < elementsNum; i++) {\n  dataset.push({\n    label: 'element ' + i,\n    key: i,\n    type: 'user'\n  });\n}\n\nrender(\n  <Select filter compact selected={dataset[selectedIndex]} data={dataset}/>,\n  document.getElementById('demo')\n);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Multiple select with a description",
      "url": "examples/select/multiple-select-with-a-description.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\npadding: 8px;\nwidth: 50%;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst deFlag = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAUCAIAAACMMcMmAAAAKklEQVRIx2NgGAWjgAbAh/aI4S7t0agdI9COzx00Rwz/z9Ecjdox8uwAACkGSkKIaGlAAAAAAElFTkSuQmCC';\nconst ruFlag = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAAOUlEQVR42u3TUQ0AIAwD0aIGt5OFBtx0mCBNljsD7+uWXwoEDPwPrvKJwJINDDwLvtqZnSwZGHgU3Kx2NIuI4wdUAAAAAElFTkSuQmCC';\nconst icons = [deFlag, ruFlag, undefined];\n\nconst elementsNum = 5;\nconst dataset = [];\nfor (let i = 0; i < elementsNum; i++) {\n  dataset.push({\n    'label': 'element ' + i,\n    'key': i,\n    description: 'description ' + i,\n    icon: icons[i % 3]\n  });\n}\n\nrender(\n  <Select filter selected={[dataset[0], dataset[3]]} multiple data={dataset}/>,\n  document.getElementById('demo')\n);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Disabled select",
      "url": "examples/select/disabled-select.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo1\"></div>\n<div id=\"demo2\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nrender(\n  <Select disabled loading/>,\n  document.getElementById('demo1')\n);\n\nrender(\n  <Select disabled loading type={Select.Type.INPUT}/>,\n  document.getElementById('demo2')\n);\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\npadding: 8px;\nwidth: 50%;\n}\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Simple input-based select",
      "url": "examples/select/simple-input-based-select.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst data = [];\nfor (let i = 0; i < 20; i++) {\n  data.push({'label': 'Item ' + i, 'key': i});\n}\n\nrender(\n  <Select type={Select.Type.INPUT} data={data} clear/>,\n  document.getElementById('demo')\n);\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  padding: 8px;\n  width: 50%;\n}\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Simple input-based select in suggest-only mode",
      "url": "examples/select/simple-input-based-select-in-suggest-only-mode.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst data = [];\nfor (let i = 0; i < 20; i++) {\n  data.push({'label': 'Item ' + i, 'key': i});\n}\n\nrender(<Select\n  type={Select.Type.INPUT}\n  allowAny\n  hideArrow\n  label=\"Placeholder without arrow\"\n  data={data}\n  selected={data[1]}\n/>, document.getElementById('demo'));\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  padding: 8px;\n  width: 50%;\n}\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Simple select with default filter mode enabled",
      "url": "examples/select/simple-select-with-default-filter-mode-enabled.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst data = [\n  {'label': 'One', 'key': '1'},\n  {'label': 'Two', 'key': '2', disabled: true},\n  {'label': 'Two One', 'key': '2.1', level: 1},\n  {'label': 'Two Two', 'key': '2.2', level: 1},\n  {'label': 'Three', 'key': '3'}\n];\n\nrender(<Select filter data={data}/>, document.getElementById('demo'));\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\npadding: 8px;\nwidth: 50%;\n}\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Simple select with default filter mode enabled and a loading indicator",
      "url": "examples/select/simple-select-with-default-filter-mode-enabled-and-a-loading-indicator.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst data = [\n  {'label': 'One', 'key': '1'},\n  {'label': 'Group', 'key': '2'},\n  {'label': 'Three', 'key': '3'}\n];\n\nrender(\n  <Select filter loading data={data} selected={data[1]}/>,\n  document.getElementById('demo')\n);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select with a customized filter and an 'Add item' button",
      "url": "examples/select/select-with-a-customized-filter-and-an-add-item-button.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst data = [];\nfor (let i = 0; i < 100; i++) {\n  data.push({\n    'label': 'Item long long long long long  long long long label ' + i,\n    'key': i\n  });\n}\n\nrender(<Select\n  filter={{\n    placeholder: 'Select me',\n    value: 'One'\n  }}\n  hint=\"Press down to do something\"\n  add={{\n    prefix: 'Add name'\n  }}\n  onAdd={value => console.log('Add', value)}\n  data={data}\n  selected={data[49]}\n  onSelect={selected => console.log('onSelect, selected item:', selected)}\n/>, document.getElementById('demo'));\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  padding: 8px;\n  width: 50%;\n}\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select with custom items and an 'Add item' button",
      "url": "examples/select/select-with-custom-items-and-an-add-item-button.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.label) {\n  border-radius: 3px;\n  color: #669ECC;\n  background-color: #E5F4FF;\n  padding-left: 8px;\n  margin: 2px 0;\n}\n\nbody {\n  padding: 8px;\n  width: 50%;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\nimport List from '@jetbrains/ring-ui/components/list/list';\nimport '@jetbrains/ring-ui/components/input-size/input-size.scss';\n\nconst data = [];\nfor (let i = 0; i < 100; i++) {\n  const label = `Label ${i}`;\n  data.push({\n    key: label,\n    label,\n    template: <span className=\"label\">{label}</span>,\n    rgItemType: List.ListProps.Type.CUSTOM\n  });\n}\n\nrender(<Select\n  filter\n  hint=\"Press down to do something\"\n  add={{\n    prefix: 'Add label'\n  }}\n  onAdd={value => console.log('Add', value)}\n  data={data}\n  onSelect={selected => console.log('onSelect, selected item:', selected)}\n/>, document.getElementById('demo'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select with an always visible 'Add item' button",
      "url": "examples/select/select-with-an-always-visible-add-item-button.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst data = [];\nfor (let i = 0; i < 10; i++) {\n  data.push({'label': 'Item ' + i, 'key': i});\n}\n\nrender(<Select\n  filter={{\n    placeholder: 'Select me',\n    value: 'One'\n  }}\n  add={{\n    alwaysVisible: true,\n    label: 'Create New Blah Blah'\n  }}\n  onAdd={value => console.log('Add', value)}\n  data={data}\n  onSelect={selected => console.log('onSelect, selected item:', selected)}\n/>, document.getElementById('demo'));\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  padding: 8px;\n  width: 50%;\n}\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Multiple-choice select with custom view",
      "url": "examples/select/multiple-choice-select-with-custom-view.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"multipleCustomView\"></div>\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nrender(<Select\n  filter\n  add={{\n    prefix: 'Add some item'\n  }}\n  multiple={{\n    label: 'Change selected items',\n    removeSelectedItems: false\n  }}\n  selected={[{'label': 'Two long label', 'key': '2'}]}\n  data={[\n    {'label': 'One long label', 'key': '1'},\n    {'label': 'Two long label', 'key': '2'},\n    {'label': 'Three long label', 'key': '3'}\n  ]}\n  onSelect={selected => console.log('onSelect, selected item:', selected)}\n  onDeselect={deselected => console.log('onDeselect, deselected item:', deselected)}\n  onChange={selection => {\n    console.log('onChange, selection:', selection);\n    const items = selection.map(item => item.label);\n    document.getElementById('multipleCustomView').innerHTML = items.join(', ');\n  }}\n/>, document.getElementById('demo'));\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  padding: 8px;\n  width: 50%;\n}\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select as a dropdown without filter",
      "url": "examples/select/select-as-a-dropdown-without-filter.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<button id=\"demoButton\">Click me</button>\n<div id=\"demo\"></div>\n<div id=\"changeResult\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst data = [];\nfor (let i = 0; i < 20; i++) {\n  data.push({\n    'label': 'Item ' + i,\n    'description': 'Description for the item lalalalala ' + i,\n    'key': i\n  });\n}\nconst select = render(\n  <Select\n    type={Select.Type.CUSTOM}\n    data={data}\n    onChange={selected => {\n      document.getElementById('changeResult').innerHTML = selected.label;\n    }}\n  />,\n  document.getElementById('demo')\n);\n\ndocument.getElementById('demoButton').onclick = function () {\n  select._clickHandler();\n}\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  padding: 8px;\n  width: 50%;\n}\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select with render optimization",
      "url": "examples/select/select-with-render-optimization.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  padding: 8px;\n  width: 50%;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\nimport List from '@jetbrains/ring-ui/components/list/list';\nimport '@jetbrains/ring-ui/components/input-size/input-size.scss';\n\nconst data = (new Array(1000)).join(',').split(',').map((item, index) => {\n  return {\n    label: 'Label ' + index,\n    key: index,\n    rgItemType: index % 10 ? List.ListProps.Type.ITEM : List.ListProps.Type.TITLE\n  }\n});\n\nrender(<Select filter data={data} />, document.getElementById('demo'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select fits to screen",
      "url": "examples/select/select-fits-to-screen.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\" style=\"position: absolute; bottom: 20px;\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\npadding: 8px;\nwidth: 50%;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Select from '@jetbrains/ring-ui/components/select/select';\n\nconst elementsNum = 1000;\nconst selectedIndex = parseInt(elementsNum / 2);\nconst dataset = [];\nfor (let i = 0; i < elementsNum; i++) {\ndataset.push({\nlabel: 'element ' + i,\nkey: i,\ntype: 'user'\n});\n}\n\nrender(\n<Select maxHeight={5000} filter compact selected={dataset[selectedIndex]} data={dataset}/>,\n  document.getElementById('demo')\n  );\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a select.",
  "attrs": {
    "name": "Select",
    "category": "Components",
    "tags": "Ring UI Language",
    "description": "Displays a select.",
    "example-file": "./select.examples.html"
  }
};