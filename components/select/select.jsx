/**
 * @fileoverview Select.
 * @jsx React.DOM
 */

require('./select.scss');

var React = require('react');
var Popup = require('popup/popup');
var List = require('list/list');
var Filter = require('filter/filter');
var Icon = require('icon/icon');
var Button = require('button/button');
var Loader = require('loader/loader');
var NgModelMixin = require('ngmodel/ngmodel');
var ngModelStateField = 'selected';

var Shortcuts = require('shortcuts/shortcuts');

var Global = require('global/global');
var generateUniqueId = Global.getUIDGenerator('ring-list-');


/**
 * @constructor
 * @mixes {Popup.Mixin}
 * @extends {ReactComponent}
 * @example
 <example name="Disabled select">
 <file name="index.html">
   <div id="demo"></div>
 </file>
 <file name="index.js" webpack="true">
   var React = require('react');
   var Select = require('./select.jsx');

   React.renderComponent(Select({disabled: true}), document.getElementById('demo'))
   .setProps({data: []});
 </file>
 </example>

 <example name="Simple select">
 <file name="index.html">
 <div id="demo"></div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Select = require('./select.jsx');

 var data = [];
 for(var i = 0; i < 100; i++) {
  data.push({'label': 'Item long long long long long label ' + i, 'key': i});
 }

 React.renderComponent(Select({
  type: Select.Type.INPUT
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
    {'label': 'Group', 'key': '2', disabled: true},
      {'label': 'Two One', 'key': '2.1', level: 1},
      {'label': 'Two Two', 'key': '2.2', level: 1},
    {'label': 'Three', 'key': '3'}
  ]});
 </file>
 </example>


 <example name="Select with customized filter and Add item button">
 <file name="index.html">
 <div id="demo"></div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Select = require('./select.jsx');

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
  data: [
    {'label': 'One', 'key': '1'},
    {'label': 'Two', 'key': '2'},
    {'label': 'Three', 'key': '3'}
  ], 'onSelect': function(selected) {
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
    callback: function(value) {
      console.log('Add', value);
    }
   },
   multiple: {
    label: 'Change selected items', // override button label if something selected
    removeSelectedItems: false      // remove selected items from the list, useful with "disableLabelSelection" and custom display
   }
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
  INPUT: 1
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
      filter: false,
      multiple: false, // multiple can be an object, see demo to more information
      clear: false,
      loading: false,
      disabled: false,

      type: Types.BUTTON,

      selected: null,

      label: 'Please select option',
      shortcuts: true,

      onOpen: function() {},
      onClose: function() {},
      onFilter: function() {},

      onSelect: function() {},   // single + multi
      onDeselect: function() {}, // multi
      onChange: function() {}    // multi
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
    return {
      map: {
        'up': function() {
          //console.log('UP');
        },
        'down': function() {
          //console.log('DOWN');
        }
      },
      scope: generateUniqueId()
    };
  },

  componentWillMount: function() {
    // set selected element if it is defined on initialization
    if (this.props.selected) {
      this.setState({
        selected: this.props.selected
      });
    }
  },

  componentDidMount: function() {
    this._createPopup();
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.selected) {
      this.setState({
        selected: newProps.selected
      });
    }
  },

  componentDidUpdate: function() {
    this._refreshPopup();
  },

  _popup: null,
  _createPopup: function() {
    if (!this._popup) {
      this._popup = Popup.renderComponent(
        <SelectPopup
          filter={this.isInputMode() ? false : this.props.filter} // disable dpopup filter on input mode
          anchorElement={this.getDOMNode()}
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
    var newData = this.getListItems(this.getFilterValue());

    this._popup.setProps({
      data: newData
    }, function() {
      !this._popup.isVisible() && this.props.onOpen();
      this._popup.show();
    }.bind(this));
  },

  _hidePopup: function() {
    this._popup.isVisible() && this.props.onClose();
    this._popup.hide();
  },

  getListItems: function(filterString) {
    filterString = filterString.trim();

    var filteredData = [];
    var exectMatch = false;

    var check = this.props.filter.fn || function(itemToCheck, checkString) {
      return itemToCheck.label.match(new RegExp(checkString, 'ig'));
    };

    for (var i = 0; i < this.props.data.length; i++) {
      var item = this.props.data[i];
      if (filterString === '' || check(item, filterString)) {
        item.type = List.ListProps.Type.ITEM;

        exectMatch |= (item.label === filterString);

        if (this.props.multiple && !this.props.multiple.removeSelectedItems) {
          item.checkbox = !!this._multipleMap[item.key];
        }

        // Ignore item ONLY if its multiple and item alredy selected
        if (!(this.props.multiple && this.props.multiple.removeSelectedItems && this._multipleMap[item.key])) {
          filteredData.push(item);
        }
      }
    }

    if (this.props.add && this.props.add.callback && filterString && !exectMatch) {
      if (!(this.props.add.regexp && !this.props.add.regexp.test(filterString)) &&
      !(this.props.add.minlength && filterString.length < +this.props.add.minlength)) {

        if (filteredData.length) {
          filteredData.push({
            type: List.ListProps.Type.SEPARATOR
          });
        }

        filteredData.push({
          type: List.ListProps.Type.ADD,
          prefix: this.props.add.prefix,
          label: filterString,
          onClick: function() {
            this.props.add.callback(filterString);
          }.bind(this)
        });
      }
    }

    return filteredData;
  },

  getFilterValue: function() {
    if (!this.isInputMode()) {
      return this._popup.getFilter();
    } else {
      return this.refs.filter.value();
    }
  },

  setFilterValue: function(value) {
    if (!this.isInputMode()) {
      return this._popup.setFilter(value);
    } else {
      return this.refs.filter.value(value);
    }
  },

  isInputMode: function() {
    return (this.props.type === Types.INPUT);
  },

  _buttonClickHandler: function() {
    if (!this.props.disabled) {
      this._showPopup();
    }
  },

  _filterChangeHandler: function() {
    this.props.onFilter(this.getFilterValue());
    this._showPopup();
  },

  _multipleMap: {},
  _listSelectHandler: function(selected) {
    if (selected.type !== List.ListProps.Type.ITEM || selected.disabled) {
      return;
    }

    if (!this.props.multiple) {
      this.setState({
        selected: selected
      }, function() {
        this.clearFilter();
        this.props.onSelect(selected);
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

      this.props.onChange && this.props.onChange(currentSelection);
    }
  },

  _onClose: function() {
    this.isInputMode() && this.clearFilter();
    this._hidePopup();
  },

  clearFilter: function() {
    this.setFilterValue('');
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

  _getClearButton: function() {
    if (this.props.clear && this.state.selected) {
      return (<span className="ring-link" onClick={this.clear}>
        <Icon glyph="close" size={Icon.Size.Size14}/>
      </span>);
    }
  },

  _getButtonLabel: function() {
    if (this.props.multiple) {
      if (this.props.multiple.label) {
        if (!this.state.selected.length) {
          return this.props.label;
        } else {
          return this.props.multiple.label;
        }
      } else {
        var labels = [];
        for (var i = 0; i < this.state.selected.length; i++) {
          labels.push(this.state.selected[i].label);
        }
        return labels.join(', ');
      }
    } else if (this.state.selected) {
      return this.state.selected.selectedLabel || this.state.selected.label;
    } else {
      return this.props.label;
    }
  },

  render: function () {
    var buttonCS = React.addons.classSet({
      'ring-select': true,
      'ring-btn_disabled': this.props.disabled,
      'ring-js-shortcuts': true
    });

    if (this.isInputMode()) {
      return (
        <div onClick={this._buttonClickHandler} className={buttonCS}>
          <Filter ref="filter"
            onFilter={this._filterChangeHandler}
          />
          <span className="ring-select__icons">
              { this.props.loading ? <Loader modifier={Loader.Modifier.INLINE} /> : ''}
              { this._getClearButton() }
            <Icon glyph="caret-down" size={Icon.Size.Size14} />
          </span>
        </div>);
    } else {
      return (
        <Button onClick={this._buttonClickHandler} className={buttonCS}>
          <span className="ring-select__label">{this._getButtonLabel()}</span>
          <span className="ring-select__icons">
          { this.props.loading ? <Loader modifier={Loader.Modifier.INLINE} /> : ''}
          { this._getClearButton() }
            <Icon glyph="caret-down" size={Icon.Size.Size14} />
          </span>
        </Button>);
    }
  }
});

var SelectPopup = React.createClass({
  getDefaultProps: function() {
    return {
      data: [],
      filter: false, // can be bool or object with props: "value" and "placeholder"
      anchorElement: null,
      maxHeight: 150,
      onSelect: function() {},
      onClose: function() {},
      onFilter: function() {}
    };
  },

  getInitialState: function() {
    return {
     popupShortcuts: false
    };
  },

  _filterNode: null,

  componentDidMount: function() {
    if (this.props.filter) {
      this._filterNode = this.refs.filter.getDOMNode();
      if (this.props.filter.value) {
        this.setFilter(this.props.filter.value);
      }
      this.focusFilter();
    }
  },

  componentDidUpdate: function() {
    this.focusFilter();
  },

  setFilter: function(value) {
    if (this.refs.filter) {
      return this.refs.filter.value(value);
    } else {
      return function() {};
    }
  },

  getFilter: function() {
    return this.props.filter ? this._filterNode.value : '';
  },

  focusFilter: function() {
    this.props.filter && this._filterNode.focus();
  },

  show: function() {
    this.refs.popup.show(function() {
      this.focusFilter();
    }.bind(this));

    this.setState({
      popupShortcuts: true
    });
  },

  hide: function() {
    this.refs.popup.hide();

    this.setState({
      popupShortcuts: false
    });
  },

  isVisible: function() {
    return this.refs.popup.isVisible();
  },

  _getFilter: function() {
    if (this.props.filter) {
      return (<Filter ref="filter" popup="true"
        placeholder={this.props.filter.placeholder || ''}
        onFilter={this.props.onFilter} />);
    }
  },

  render: function() {
    var hint;

    if (!this.props.data.length && this.props.filter) {
      if (this.props.filter.notFoundText) {
        hint = this.props.filter.notFoundText;
      } else {
        hint = 'No options found';
      }
    }

    return (<Popup
      ref="popup"
      maxHeight={this.props.maxHeight}
      hidden={true}
      cutEdge={false}
      dontCloseOnAnchorClick={true}
      anchorElement={this.props.anchorElement}
      autoRemove={false}
      shortcuts={this.state.popupShortcuts}
      onClose={this.props.onClose}>
      {this._getFilter()}
      <List
        data={this.props.data}
        restoreActiveIndex={true}
        activateOneItem={true}
        onSelect={this.props.onSelect}
        shortcuts={this.state.popupShortcuts}
        hint={hint}/>
    </Popup>);
  }
});

module.exports = Select;
