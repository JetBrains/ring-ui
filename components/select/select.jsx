/**
 * @fileoverview Select.
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

var Shortcuts = require('shortcuts/shortcuts');

var Global = require('global/global');
var generateUniqueId = Global.getUIDGenerator('ring-select-');


/**
 * @constructor
 * @mixes {Popup.Mixin}
 * @extends {ReactComponent}
 * @example
 <example name="Disabled select">
 <file name="index.html">
   <div id="demo1"></div>
   <div id="demo2"></div>
 </file>
 <file name="index.js" webpack="true">
   var React = require('react');
   var Select = require('./select.jsx');

   React.renderComponent(Select({disabled: true, loading: true}), document.getElementById('demo1'));
   React.renderComponent(Select({disabled: true, loading: true, type: Select.Type.INPUT}), document.getElementById('demo2'));
 </file>
 </example>

 <example name="Simple input select">
 <file name="index.html">
 <div id="demo"></div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Select = require('./select.jsx');

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

 <example name="Simple input select in suggest mode">
 <file name="index.html">
 <div id="demo"></div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Select = require('./select.jsx');

 var data = [];
 for(var i = 0; i < 20; i++) {
  data.push({'label': 'Item ' + i, 'key': i});
 }

 React.renderComponent(Select({
  type: Select.Type.INPUT,
  suggestOnly: true
 }), document.getElementById('demo'))
 .setProps({data: data});
 </file>
 </example>

 <example name="Simple select with default filter mode">
 <file name="index.html">
 <div id="demo"></div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Select = require('./select.jsx');

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

 <example name="Simple select with default filter mode and loading">
 <file name="index.html">
 <div id="demo"></div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Select = require('./select.jsx');

 React.renderComponent(Select({filter: true, loading: true}), document.getElementById('demo'))
 .setProps({data: [
    {'label': 'One', 'key': '1'},
    {'label': 'Group', 'key': '2'},
    {'label': 'Three', 'key': '3'}
  ], selected: {'label': 'Group', 'key': '2'}});
 </file>
 </example>


 <example name="Select with customized filter and Add item button">
 <file name="index.html">
 <div id="demo"></div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Select = require('./select.jsx');

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
    prefix: 'Add name',
    callback: function(value) {
      console.log('Add', value);
    }
  },
  data: data,
  selected: data[49],
  'onSelect': function(selected) {
    console.log('onSelect, selected item:', selected);
  }});
 </file>
 </example>

 <example name="Multiselect with custom view">
 <file name="index.html">
 <div id="multipleCustomView"></div>
 <div id="demo"></div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Select = require('./select.jsx');

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

var Types = {
  BUTTON: 0,
  INPUT: 1,
  CUSTOM: 2
};

var Select = React.createClass({
  mixins: [Shortcuts.Mixin, NgModelMixin],
  ngModelStateField: ngModelStateField,
  statics: {
    Type: Types,
    ngModelStateField: ngModelStateField
  },

  getDefaultProps: function () {
    return {
      data: [],
      filter: false,   // enable filter in BUTTON or CUSTOM mode
      multiple: false, // multiple can be an object, see demo to more information
      clear: false,    // enable clear button that clear "selected" state
      loading: false,  // show loader and loading text in popup
      disabled: false, // disable select

      loadingMessage: 'Loading...',
      notFoundMessage: 'No options found',

      type: Types.BUTTON,
      targetElement: null, // element to bind popup (select BUTTON or INPUT as default)
      hideSelected: false, // INPUT mode: clear input in any case (smth selected)
      suggestOnly: false, // INPUT mode: hide popup if options is empty, dont show any icons, dont touch filter

      maxHeight: 250,      // LIST height!!! without filter and Add button
      minWidth: 'target',  // Popup width!!!

      selected: null,      // current selection (item object or array of items)

      label: 'Please select option',  // BUTTON label or INPUT placeholder (nothing selected)
      selectedLabel: '',              // BUTTON label or INPUT placeholder (something selected)

      shortcuts: true,

      onOpen: function() {},
      onClose: function() {},
      onFilter: function() {},    // search string as first argument

      onSelect: function() {},    // single + multi
      onDeselect: function() {},  // multi
      onChange: function() {},    // multi

      onAdd: function() {}        // search string as first argument
    };
  },

  getInitialState: function() {
    return {
      data: [],
      selected: (this.props.multiple ? [] : null),
      filterString: null,
      popupShortcuts: false,
      hint: null
    };
  },

  getShortcutsProps: function () {
    var self = this;
    return {
      map: {
        'enter': function() {
          self.state.focused && self.inputHandler();
        },
        'up': function() {
          self.state.focused && self.inputHandler();
        },
        'down': function() {
          self.state.focused && self.inputHandler();
        }
      },
      scope: generateUniqueId()
    };
  },

  inputHandler: function() {
    if (this._popup && !this._popup.isVisible()) {
      this._clickHandler();
    }
  },

  componentWillMount: function() {
    // set selected element if it is defined on initialization
    if (this.props.selected) {
      this.setState({
        selected: this.props.selected,
        selectedIndex: this._getSelectedIndex(this.props.selected, this.props.data)
      });
    }
  },

  componentDidMount: function() {
    this._createPopup();
    this._rebuildMultipleMap(this.state.selected);
  },

  componentWillUnmount: function () {
    if (this._popup) {
      this._popup.remove();
    }
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.selected) {
      this._rebuildMultipleMap(newProps.selected);
      this.setState({
        selected: newProps.selected,
        selectedIndex: this._getSelectedIndex(newProps.selected, (newProps.data ? newProps.data : this.props.data))
      });
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
          filter={this.isInputMode() ? false : this.props.filter} // disable dpopup filter on input mode
          anchorElement={this.props.targetElement || this.getDOMNode()}
          shortcuts={true}
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

    if (!data.length && this.props.suggestOnly) {
      if (this._popup.isVisible()) {
        this._hidePopup();
      }
      this.props.onOpen();
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
  },

  addHandler: function() {
    this.props.onAdd(this.filterValue());
  },

  getToolbar: function() {
    if (this._addButton) {
      return <div className="ring-select__button" onClick={this.addHandler}><span className="ring-select__button__plus">+</span>{this.props.add.prefix ? this.props.add.prefix + ' ' : ''}<b>{this.filterValue()}</b></div>;
    }
  },

  _addButton: null,
  getListItems: function(filterString) {
    filterString = filterString.trim();

    if (this.isInputMode() && this.state.selected && filterString === this.state.selected.label) {
      filterString = ''; // ignore multiple if its exectly selected item
    }

    var filteredData = [];
    var exectMatch = false;

    var check = this.props.filter.fn || function(itemToCheck, checkString) {
      // as default skip separators and hints
      if (itemToCheck.type === List.ListProps.Type.SEPARATOR || itemToCheck.type === List.ListProps.Type.HINT) {
        return true;
      } else {
        return itemToCheck.label.match(new RegExp(checkString, 'ig'));
      }
    };

    for (var i = 0; i < this.props.data.length; i++) {
      var item = this.props.data[i];
      if (filterString === '' || check(item, filterString, this.props.data)) {
        if (item.type === undefined) {
          item.type = List.ListProps.Type.ITEM;
        }

        exectMatch = (item.label === filterString);

        if (this.props.multiple && !this.props.multiple.removeSelectedItems) {
          item.checkbox = !!this._multipleMap[item.key];
        }

        // Ignore item ONLY if its multiple and item alredy selected
        if (!(this.props.multiple && this.props.multiple.removeSelectedItems && this._multipleMap[item.key])) {
          filteredData.push(item);
        }
      }
    }

    this._addButton = null;
    if (this.props.add && filterString && !exectMatch) {
      if (!(this.props.add.regexp && !this.props.add.regexp.test(filterString)) &&
      !(this.props.add.minlength && filterString.length < +this.props.add.minlength)) {

        this._addButton = {
          prefix: this.props.add.prefix,
          label: filterString
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
    return (this.props.type === Types.INPUT);
  },

  isButtonMode: function() {
    return (this.props.type === Types.BUTTON);
  },

  _clickHandler: function() {
    if (!this.props.disabled) {
      this._showPopup();
    }
  },

  _filterChangeHandler: function() {
    this.props.onFilter(this.filterValue());
    this._showPopup();
  },

  _multipleMap: {},

  _rebuildMultipleMap: function(selected) {
    if (selected && this.props.multiple) {
      this._multipleMap = {};
      for (var i = 0; i < selected.length; i++) {
        this._multipleMap[selected[i].key] = true;
      }
    }
  },

  _listSelectHandler: function(selected) {
    if (selected.type !== List.ListProps.Type.ITEM || selected.disabled) {
      return;
    }

    if (!this.props.multiple) {
      this.setState({
        selected: selected
      }, function() {
        this.filterValue(this.isInputMode() && !this.props.hideSelected ? this._getItemLabel(selected) : '');
        this.props.onSelect(selected);
        this.props.onChange(selected);
        this._hidePopup();
      }.bind(this));
    } else {
      if (!selected.key) {
        throw new Error('Multiple selection require "key" property on each item of the list');
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
      if (!this.props.suggestOnly) {
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
    if (this.props.multiple) {
      this.setState({
        selected: []
      });
    } else {
      this.setState({
        selected: null
      });
    }
  },

  _inputFocused: false,
  _focusHandler: function() {
    this.setState({
      focused: true
    });
  },

  _blurHandler: function() {
    this.setState({
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
    return this._getSelectedLabel();
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

    icons.push(<Icon glyph="caret-down" size={Icon.Size.Size16} />);

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
        'ring-input_filter': true,
        'ring-input_disabled': this.props.disabled
      });

      return (
        <div onClick={this._clickHandler} className={buttonCS}>
          <Input ref="filter" disabled={this.props.disabled} className={inputCS} style={style}
            onInput={this._filterChangeHandler}
            onFocus={this._focusHandler}
            onBlur={this._blurHandler}
            shortcuts={this._inputShortcutsEnabled()}
            placeholder={this._getInputPlaceholder()} />
          {!this.props.suggestOnly && iconsNode}
        </div>);
    } else if (this.isButtonMode()) {
      return (
        <Button type="button" onClick={this._clickHandler} className={buttonCS} style={style}>
          <span className="ring-select__label">{this._getButtonLabel()}</span>
          {iconsNode}
        </Button>);
    } else {
      return (<span></span>);
    }
  }
});

module.exports = Select;
