/**
 * @fileoverview Select
 * @jsx React.DOM
 */

require('./select.scss');

var React = require('react');
var Popup = require('popup/popup');
var SelectPopup = require('./select__popup');
var List = require('list/list');
var Input = require('input/input');
var Icon = require('icon/icon');
var Button = require('button/button');
var Loader = require('loader/loader');
var NgModelMixin = require('ngmodel/ngmodel');
var ngModelStateField = 'selected';

var ShortcutsMixin = require('shortcuts/shortcuts__mixin');

var Global = require('global/global');
var generateUniqueId = Global.getUIDGenerator('ring-select-');

function noop() {}

/**
 * @enum {number}
 */
var Type = {
  BUTTON: 0,
  INPUT: 1,
  CUSTOM: 2
};

/**
 * @name Select
 * @constructor
 * @mixes {Popup.Mixin}
 * @extends {ReactComponent}
 * @example
 <example name="Select with model that have type field">
   <file name="index.html">
     <div id="demo"></div>
   </file>
   <file name="index.js" webpack="true">
     var React = require('react');
     var Select = require('select/select');

     React.renderComponent(Select({filter: true}), document.getElementById('demo'))
     .setProps({data: [
        {'label': 'One', 'key': '1', 'type': 'user'},
        {'label': 'Group', 'key': '2', 'type': 'user'},
        {'label': 'Three', 'key': '3', 'type': 'user'}
      ], selected: {'label': 'Group', 'key': '2', 'type': 'user'}});
    </file>
 </example>

 <example name="Disabled select">
   <file name="index.html">
     <div id="demo1"></div>
     <div id="demo2"></div>
   </file>
   <file name="index.js" webpack="true">
     var React = require('react');
     var Select = require('select/select');

     React.renderComponent(Select({disabled: true, loading: true}), document.getElementById('demo1'));
     React.renderComponent(Select({disabled: true, loading: true, type: Select.Type.INPUT}), document.getElementById('demo2'));
   </file>
 </example>

 <example name="Simple input-based select">
   <file name="index.html">
     <div id="demo"></div>
   </file>
   <file name="index.js" webpack="true">
     var React = require('react');
     var Select = require('select/select');

     var data = [];
     for(var i = 0; i < 20; i++) {
       data.push({'label': 'Item ' + i, 'key': i});
     }

     React.renderComponent(Select({
       type: Select.Type.INPUT
     }), document.getElementById('demo'))
     .setProps({data: data});
   </file>
 </example>

 <example name="Simple input-based select in suggest-only mode">
   <file name="index.html">
     <div id="demo"></div>
   </file>
   <file name="index.js" webpack="true">
     var React = require('react');
     var Select = require('select/select');

     var data = [];
     for(var i = 0; i < 20; i++) {
       data.push({'label': 'Item ' + i, 'key': i});
     }

     React.renderComponent(Select({
       type: Select.Type.INPUT,
       allowAny: true,
       hideArrow: true,
       label: 'Placeholder without arrow'
     }), document.getElementById('demo'))
     .setProps({data: data, selected: data[1]});
   </file>
 </example>

 <example name="Simple select with default filter mode">
 <file name="index.html">
 <div id="demo"></div>
 </file>
 <file name="index.js" webpack="true">
   var React = require('react');
   var Select = require('select/select');

   React.renderComponent(Select({filter: true}), document.getElementById('demo'))
   .setProps({data: [
      {'label': 'One', 'key': '1'},
      {'label': 'Two', 'key': '2', disabled: true},
        {'label': 'Two One', 'key': '2.1', level: 1},
        {'label': 'Two Two', 'key': '2.2', level: 1},
      {'label': 'Three', 'key': '3'}
    ]});
 </file>
 </example>

 <example name="Simple select with default filter mode and loading indicator">
   <file name="index.html">
     <div id="demo"></div>
   </file>
   <file name="index.js" webpack="true">
     var React = require('react');
     var Select = require('select/select');

     React.renderComponent(Select({filter: true, loading: true}), document.getElementById('demo'))
     .setProps({data: [
        {'label': 'One', 'key': '1'},
        {'label': 'Group', 'key': '2'},
        {'label': 'Three', 'key': '3'}
      ], selected: {'label': 'Group', 'key': '2'}});
    </file>
 </example>


 <example name="Select with customized filter and an 'Add item' button">
   <file name="index.html">
     <div id="demo"></div>
   </file>
   <file name="index.js" webpack="true">
     var React = require('react');
     var Select = require('select/select');

     var data = [];
     for(var i = 0; i < 100; i++) {
       data.push({'label': 'Item long long long long long  long long long label ' + i, 'key': i});
     }

     React.renderComponent(Select({
       filter: {
         placeholder: 'Select me',
         value: 'One'
       }
     }), document.getElementById('demo'))
     .setProps({
      add: {
        prefix: 'Add name'
      },
      onAdd: function(value) {
        console.log('Add', value);
      },
      data: data,
      selected: data[49],
      'onSelect': function(selected) {
        console.log('onSelect, selected item:', selected);
      }});
   </file>
 </example>

  <example name="Select with always visible and fixed label 'Add item' button">
   <file name="index.html">
     <div id="demo"></div>
   </file>
   <file name="index.js" webpack="true">
     var React = require('react');
     var Select = require('select/select');

     var data = [];
     for(var i = 0; i < 10; i++) {
       data.push({'label': 'Item ' + i, 'key': i});
     }

     React.renderComponent(Select({
       filter: {
         placeholder: 'Select me',
         value: 'One'
       }
     }), document.getElementById('demo'))
     .setProps({
      add: {
        alwaysVisible: true,
        label: 'Create New Blah Blah'
      },
      onAdd: function(value) {
        console.log('Add', value);
      },
      data: data,
      'onSelect': function(selected) {
        console.log('onSelect, selected item:', selected);
      }});
   </file>
 </example>

 <example name="Multiple-choice select with custom view">
   <file name="index.html">
     <div id="multipleCustomView"></div>
     <div id="demo"></div>
   </file>
   <file name="index.js" webpack="true">
     var React = require('react');
     var Select = require('select/select');

     React.renderComponent(Select({
       filter: true,
       add: {
         prefix: 'Add some item'
       },
       multiple: {
         label: 'Change selected items', // override button label if something selected
         removeSelectedItems: false      // remove selected items from the list, useful with "disableLabelSelection" and custom display
       }, selected: [{'label': 'Two long label', 'key': '2'}]
     }), document.getElementById('demo'))
     .setProps({
        data: [
          {'label': 'One long label', 'key': '1'},
          {'label': 'Two long label', 'key': '2'},
          {'label': 'Three long label', 'key': '3'}
        ], 'onSelect': function(selected) {
          console.log('onSelect, selected item:', selected);
        }, 'onDeselect': function(deselected) {
          console.log('onDeselect, deselected item:', deselected);
        }, 'onChange': function(selection) {
          console.log('onChange, selection:', selection);
          var items = [];
          selection.forEach(function(item) {
            items.push(item.label);
          });
          document.getElementById('multipleCustomView').innerHTML = items.join(', ');
        }});
   </file>
 </example>
 */
var Select = React.createClass({
  mixins: [ShortcutsMixin, NgModelMixin],
  ngModelStateField: ngModelStateField,
  statics: {
    Type: Type,
    ngModelStateField: ngModelStateField
  },

  getDefaultProps: function () {
    return {
      data: [],
      filter: false,   // enable filter (BUTTON or CUSTOM mode)
      multiple: false, // multiple can be an object - see demo for more information
      clear: false,    // enable clear button that clears the "selected" state
      loading: false,  // show loading indicator while data is loading
      disabled: false, // disable select

      loadingMessage: 'Loading...',
      notFoundMessage: 'No options found',

      type: Type.BUTTON,
      targetElement: null,  // element to bind the popup to (select BUTTON or INPUT by default)
      hideSelected: false,  // INPUT mode: clears the input after an option is selected (useful when the selection is displayed in some custom way elsewhere)
      allowAny: false,      // INPUT mode: allows any value to be entered, hides the dropdown icon
      hideArrow: false,     // hide dropdown arrow icon

      maxHeight: 250,       // Height of options list, without the filter and 'Add' button
      minWidth: 'target',   // Popup width

      selected: null,       // current selection (item / array of items)

      label: 'Please select option',  // BUTTON label or INPUT placeholder (nothing selected)
      selectedLabel: '',              // BUTTON label or INPUT placeholder (something selected)

      shortcuts: false,

      onBeforeOpen: noop,
      onOpen: noop,
      onClose: noop,
      onFilter: noop,       // search string as first argument

      onSelect: noop,       // single + multi
      onDeselect: noop,     // multi
      onChange: noop,       // multi

      onAdd: noop,          // search string as first argument

      onDone: noop,
      onReset: noop
    };
  },

  getInitialState: function() {
    return {
      data: [],
      selected: (this.props.multiple ? [] : null),
      filterString: null,
      shortcuts: false,
      popupShortcuts: false,
      hint: null
    };
  },

  getShortcutsProps: function () {
    return {
      map: {
        'enter': this._onEnter,
        'esc': this._onEsc,
        'up': this._inputShortcutHandler,
        'down': this._inputShortcutHandler,
        'right': noop,
        'left': noop,
        'shift+up': noop,
        'shift+down': noop,
        'space': noop
      },
      scope: generateUniqueId()
    };
  },

  _onEnter: function() {
    this.props.onDone();
  },

  _onEsc: function() {
    if (this.props.multiple || !this.props.getInitial) {
      return;
    }

    var selected = {
      key: Math.random(),
      label: this.props.getInitial()
    };

    this.setState({
      selected: selected
    }, function() {
      this.props.onChange(selected);
      this.props.onReset();
    });
  },

  _inputShortcutHandler: function() {
    if (this.state.focused && this._popup && !this._popup.isVisible()) {
      this._clickHandler();
    }
  },

  _handleMultipleToggling: function (multiple) {
    var empty = multiple ? [] : null;
    this.setState({selected: empty}, function() {
      this.props.onChange(empty);
    });
    this._rebuildMultipleMap(empty, multiple);
  },

  componentWillMount: function() {
    // set selected element if provided during init
    if (this.props.selected) {
      this.setState({
        selected: this.props.selected,
        selectedIndex: this._getSelectedIndex(this.props.selected, this.props.data)
      });
    }
  },

  componentDidMount: function() {
    this._createPopup();
    this._rebuildMultipleMap(this.state.selected, this.props.multiple);
  },

  componentWillUnmount: function () {
    if (this._popup) {
      this._popup.remove();
    }
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.selected) {
      this.setState({
        selected: newProps.selected,
        selectedIndex: this._getSelectedIndex(newProps.selected, (newProps.data ? newProps.data : this.props.data))
      });
    }
    if (newProps.multiple !== this.props.multiple) {
      this._handleMultipleToggling(newProps.multiple);
    }
  },

  componentDidUpdate: function() {
    this._refreshPopup();
  },

  _getSelectedIndex: function(selected, data) {
    if ((this.props.multiple && !selected.length) || (!this.props.multiple && !selected)) {
      return null;
    }

    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      if (item.key === undefined) {
        continue;
      }

      if ((this.props.multiple && item.key === selected[0].key) || (!this.props.multiple && item.key === selected.key)) {
        return i;
      }
    }

    return null;
  },

  _popup: null,
  _createPopup: function() {
    if (!this._popup) {
      this._popup = Popup.renderComponent(
        <SelectPopup
          maxHeight={this.props.maxHeight}
          minWidth={this.props.minWidth}
          filter={this.isInputMode() ? false : this.props.filter} // disable popup filter in INPUT mode
          anchorElement={this.props.targetElement || this.getDOMNode()}
          onClose={this._onClose}
          onSelect={this._listSelectHandler}
          onFilter={this._filterChangeHandler} />);
    }
  },

  _refreshPopup: function() {
    if (this._popup.isVisible()) {
      this._showPopup();
    }
  },

  _showPopup: function() {
    var data = this.getListItems(this.filterValue());
    var message = null;
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

    this._popup.setProps({
      data: data,
      toolbar: this.getToolbar(),
      message: message,
      activeIndex: this.state.selectedIndex
    }, function() {
      !this._popup.isVisible() && this.props.onOpen();
      this._popup.show();
    }.bind(this));
  },

  _hidePopup: function() {
    this._popup.isVisible() && this.props.onClose();
    this._popup.hide();

    setTimeout(function () {
      if (this.isMounted()) {
        this.getDOMNode().focus();
      }
    }.bind(this), 0);
  },

  addHandler: function() {
    this._hidePopup();
    this.props.onAdd(this.filterValue());
  },

  getToolbar: function() {
    if (this._addButton) {
      return <div className="ring-select__button" onClick={this.addHandler}><span className="ring-select__button__plus">+</span>{this.props.add.prefix ? this.props.add.prefix + ' ' : ''}<b>{this._addButton.label}</b></div>;
    }
  },

  _addButton: null,
  getListItems: function(filterString) {
    filterString = filterString.trim();

    if (this.isInputMode() && this.state.selected && filterString === this.state.selected.label) {
      filterString = ''; // ignore multiple if it is exactly the selected item
    }

    var filteredData = [];
    var exactMatch = false;

    var check = this.props.filter.fn || function(itemToCheck, checkString) {
      // by default, skip separators and hints
      if (List.isItemType(List.ListProps.Type.SEPARATOR, itemToCheck) || List.isItemType(List.ListProps.Type.HINT, itemToCheck)) {
        return true;
      }

      return itemToCheck.label.match(new RegExp(checkString, 'ig'));
    };

    for (var i = 0; i < this.props.data.length; i++) {
      var item = this.props.data[i];
      if (filterString === '' || check(item, filterString, this.props.data)) {
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
  },

  filterValue: function(setValue) {
    if (this.isInputMode() || this.props.filter) {
      var filter = (this.isInputMode() ? this.refs.filter : this._popup.refs.filter).getDOMNode();

      if (typeof setValue === 'string' || typeof setValue === 'number') {
        filter.value = setValue;
      } else {
        return filter.value;
      }
    } else {
      return '';
    }
  },

  isInputMode: function() {
    return (this.props.type === Type.INPUT);
  },

  isButtonMode: function() {
    return (this.props.type === Type.BUTTON);
  },

  _clickHandler: function() {
    if (!this.props.disabled) {
      if (this._popup.isVisible()) {
        this._hidePopup();
      } else {
        this.props.onBeforeOpen();
        this._showPopup();
      }
    }
  },

  _filterChangeHandler: function() {
    var filterValue = this.filterValue().replace(/^\s+/g, '');
    this.props.onFilter(filterValue);
    if (this.props.allowAny) {
      var fakeSelected = {
        key: Math.random(),
        label: filterValue
      };
      this.setState({
        selected: filterValue === '' ? null : fakeSelected
      }, function() {
        this.props.onSelect(fakeSelected);
        this.props.onChange(fakeSelected);
      });
    }
    !this._popup.isVisible() && this.props.onBeforeOpen();
    this._showPopup();
  },

  _multipleMap: {},

  _rebuildMultipleMap: function(selected, multiple) {
    if (selected && multiple) {
      this._multipleMap = {};
      for (var i = 0; i < selected.length; i++) {
        this._multipleMap[selected[i].key] = true;
      }
    }
  },

  _listSelectHandler: function(selected) {
    var isItem = List.isItemType.bind(null, List.ListProps.Type.ITEM);
    var isCustomItem = List.isItemType.bind(null, List.ListProps.Type.CUSTOM);

    if ((!isItem(selected) && !isCustomItem(selected)) || selected.disabled) {
      return;
    }

    if (!this.props.multiple) {
      this.setState({
        selected: selected
      }, function() {
        var newFilterValue = this.isInputMode() && !this.props.hideSelected ? this._getItemLabel(selected) : '';
        this.filterValue(newFilterValue);
        this.props.onFilter(newFilterValue);
        this.props.onSelect(selected);
        this.props.onChange(selected);
        this._hidePopup();
      }.bind(this));
    } else {
      if (!selected.key) {
        throw new Error('Multiple selection requires each item to have the "key" property');
      }

      var currentSelection = this.state.selected;
      if (!this._multipleMap[selected.key]) {
        this._multipleMap[selected.key] = true;
        currentSelection.push(selected);
        this.props.onSelect && this.props.onSelect(selected);
      } else {
        delete this._multipleMap[selected.key];
        for (var i = 0; i < currentSelection.length; i++) {
          if (selected.key === currentSelection[i].key) {
            currentSelection.splice(i, 1);
            break;
          }
        }
        this.props.onDeselect && this.props.onDeselect(selected);
      }

      this.setState({
        selected: currentSelection
      }, function() {
        // redraw items
        if (this.props.multiple) {
          // setTimeout solves events order and bubbling issue
          setTimeout(function() {
            this.isInputMode() && this.clearFilter();
            this._showPopup();
          }.bind(this), 0);
        }
      });

      this.props.onChange(currentSelection);
    }
  },

  _onClose: function() {
    if (this.isInputMode()) {
      if (!this.props.allowAny) {
        if (this.props.hideSelected || !this.state.selected || this.props.multiple) {
          this.clearFilter();
        } else if (this.state.selected) {
          this.filterValue(this._getItemLabel(this.state.selected));
        }
      }
    }
    this._hidePopup();
  },

  clearFilter: function() {
    this.filterValue('');
  },

  clear: function() {
    var self = this;
    var empty = self.props.multiple ? [] : null;
    self.setState({
      selected: empty
    }, function() {
      self.props.onChange(empty);
    });

    return false;
  },

  _inputFocused: false,
  _focusHandler: function() {
    this.setState({
      shortcuts: true,
      focused: true
    });
  },

  _blurHandler: function() {
    this.setState({
      shortcuts: false,
      focused: false
    });
  },

  _inputShortcutsEnabled: function() {
    if (!this._popup || this._popup.isVisible()) {
      return false;
    } else {
      return this.state.focused;
    }
  },

  _selectionIsEmpty: function() {
    return (this.props.multiple && !this.state.selected.length) || !this.state.selected;
  },

  _getSelectedLabel: function () {
    if (this._selectionIsEmpty()) {
      return this.props.label;
    } else {
      return this.props.selectedLabel || this._getSelectedString();
    }
  },

  _getButtonLabel: function() {
    return this._getSelectedLabel();
  },

  _getInputPlaceholder: function() {
    if (!this.props.allowAny) {
      return this._getSelectedLabel();
    } else {
      return '';
    }
  },

  _getSelectedString: function() {
    if (this.props.multiple) {
      var labels = [];
      for (var i = 0; i < this.state.selected.length; i++) {
        labels.push(this._getItemLabel(this.state.selected[i]));
      }
      return labels.join(', ');
    } else {
      return this._getItemLabel(this.state.selected);
    }
  },

  _getItemLabel: function(item) {
    return item.selectedLabel || item.label;
  },

  _getIcons: function() {
    var icons = [];

    if (this.props.loading) {
      icons.push(<Loader modifier={Loader.Modifier.INLINE} />);
    }

    if (this.props.clear && this.state.selected) {
      icons.push(<span className="ring-link" onClick={this.clear}>
        <Icon glyph="close" size={Icon.Size.Size14}/>
      </span>);
    }

    if (this.state.selected && this.state.selected.icon) {
      icons.push(<span className="ring-select__selected-icon" style={{'background-image': 'url("' + this.state.selected.icon + '")'}}></span>);
    }

    if (!this.props.hideArrow) {
      icons.push(<Icon glyph="caret-down" size={Icon.Size.Size16} />);
    }

    return icons;
  },

  render: function () {
    var buttonCS = React.addons.classSet({
      'ring-select': true,
      'ring-select_disabled': this.props.disabled,
      'ring-select_input-mode': this.isInputMode(),
      'ring-btn_disabled': this.props.disabled && !this.isInputMode(),
      'ring-js-shortcuts': true
    });

    var icons = this._getIcons();

    var style = {
      'padding-right': 8 + icons.length * 16
    };

    var iconsNode = <span className="ring-select__icons">{icons}</span>;

    if (this.isInputMode()) {
      var inputCS = React.addons.classSet({
        'ring-js-shortcuts': true,
        'ring-input_disabled': this.props.disabled
      });

      var filterValue = '';
      if (this.props.allowAny && this.state.selected) {
        filterValue = this._getItemLabel(this.state.selected);
      }

      return (
        <div onClick={this._clickHandler} className={buttonCS}>
          <Input ref="filter" disabled={this.props.disabled} value={filterValue} className={inputCS} style={style}
            onInput={this._filterChangeHandler}
            onFocus={this._focusHandler}
            onBlur={this._blurHandler}
            shortcuts={this._inputShortcutsEnabled()}
            placeholder={this._getInputPlaceholder()} />
          {iconsNode}
        </div>);
    } else if (this.isButtonMode()) {
      return (
        <Button type="button" onClick={this._clickHandler} className={buttonCS} style={style} disabled={this.props.disabled}>
          <span className="ring-select__label">{this._getButtonLabel()}</span>
          {iconsNode}
        </Button>);
    } else {
      return (<span></span>);
    }
  }
});

module.exports = Select;
