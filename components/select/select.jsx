/**
 * @fileoverview Select.
 * @jsx React.DOM
 */

require('./select.scss');

var React = require('react');
var Popup = require('popup/popup');
var List = require('list/list');
var Input = require('input/input');
var Icon = require('icon/icon');
var Button = require('button/button');
var Loader = require('loader/loader');
var NgModelMixin = require('ngmodel/ngmodel');

var Shortcuts = require('shortcuts/shortcuts');

var Global = require('global/global');
var generateUniqueId = Global.getUIDGenerator('ring-list-');


/**
 * @constructor
 * @mixes {Popup.Mixin}
 * @extends {ReactComponent}
 * @example
 <example name="Select">
 <file name="index.html">
 <div>
 <p>Disabled select.</p>
 <div id="disabled"></div>

 <p>Out-of-the-box mode. Single selection without filter and any othe options.</p>
 <div id="singleWithoutFilter"></div>

 <p>Out-of-the-box mode. Single selection without filter and <b>preselected value</b>.</p>
 <div id="singleWithoutFilterAndSelectedValue"></div>

 <p>Single selection with filter, "filter" prop defined as object with "placeholder" and preseted "value" (prefilter). Open console to see callbacks.</p>
 <div id="singleWithFilter"></div>

 <p>Multiple selection with filter, "multiple" prop defined as an object with "disableLabelSelection" to hide selected items from the button. Open console to see callbacks.</p>
 <div>Selected items: <span id="multipleCustomView"><span></div>
 <div id="multiple"></div>
 </div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Select = require('./select.jsx');

 React.renderComponent(Select({disabled: true}), document.getElementById('disabled'))
 .setProps({data: []});

 React.renderComponent(Select(), document.getElementById('singleWithoutFilter'))
 .setProps({data: [
    {'label': 'One', 'key': '1'},
    {'label': 'Two', 'key': '2'},
    {'label': 'Three', 'key': '3'}
  ]});

 React.renderComponent(Select(), document.getElementById('singleWithoutFilterAndSelectedValue'))
 .setProps({
  data: [
    {'label': 'One', 'key': '1'},
    {'label': 'Two', 'key': '2'},
    {'label': 'Three', 'key': '3'}
  ],
  'selected': {'label': 'One', 'key': '1'}
  });


 React.renderComponent(Select({
   filter: {
    placeholder: 'Select me',
    value: 'One'
   }
 }), document.getElementById('singleWithFilter'))
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
 }), document.getElementById('multiple'))
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
var ngModelStateField = 'selected';
var Select = React.createClass({
  mixins: [Shortcuts.Mixin, NgModelMixin],
  ngModelStateField: ngModelStateField,
  statics: {
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

      selected: null,

      label: 'Please select option',
      filterText: 'Filter items',
      notFoundText: 'No options found',
      shortcuts: true,

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

  _popup: null,
  _createPopup: function() {
    if (!this._popup) {
      this._popup = Popup.renderComponent(
        <SelectPopup
          filter={this.props.filter} // object
          notFoundText={this.props.notFoundText}
          anchorElement={this.getDOMNode()}
          shortcuts={true}
          onClose={this._onClose}
          onSelect={this._listSelectHandler}
          onFilter={this._filterChangeHandler}
          SelectPopup/>);
    }
  },

  _showPopup: function() {
    var newData = this.filter(this._popup.getFilter());

    this._popup.setProps({
      data: newData
    }, function() {
      this._popup.show();
    }.bind(this));
  },

  _hidePopup: function() {
    this._popup.hide();
  },

  filter: function(filterString) {
    filterString = filterString.trim();

    var filteredData = [];
    var exectMatch = false;
    var regexp = this.props.filter.regexp || new RegExp(filterString, 'ig');
    for (var i = 0; i < this.props.data.length; i++) {
      var item = this.props.data[i];
      if (item.label.match(regexp) || filterString === '') {
        item.type = List.ListProps.Type.ITEM;

        exectMatch |= (item.label === filterString);

        if (this.props.multiple && !this.props.multiple.removeSelectedItems) {
          item.checkbox = !!this._multipleMap[item.key];
        }

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

  hasFilter: function() {
    return this.props.filter;
  },

  fixKeys: function(data) {
    var uniqueKey = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].key === undefined) {
        data[i].key = uniqueKey;
        uniqueKey++;
      }
    }
    return data;
  },

  _buttonClickHandler: function() {
    if (!this.props.disabled) {
      this._showPopup();
    }
  },

  _filterChangeHandler: function() {
    this._showPopup();
  },

  _multipleMap: {},
  _listSelectHandler: function(selected) {
    if (selected.type !== List.ListProps.Type.ITEM) {
      return;
    }

    if (!this.props.multiple) {
      this.setState({
        selected: selected
      });

      this.clearFilter();
      this.props.onSelect(selected);
      this._hidePopup();
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
            this._showPopup();
          }.bind(this), 0);
        }
      });

      this.props.onChange && this.props.onChange(currentSelection);
    }
  },

  _onClose: function() {
    this._hidePopup();
  },

  clearFilter: function() {
    if (this.props.filter) {
      this._popup.setFilter('');
    }
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
      return this.state.selected.label;
    } else {
      return this.props.label;
    }
  },

  render: function () {
    var cx = React.addons.classSet({
      'ring-select': true,
      'ring-btn_disabled': this.props.disabled,
      'ring-js-shortcuts': true
    });

    return (
      <Button onClick={this._buttonClickHandler} className={cx}>
        {this._getButtonLabel()}
        <span className="ring-select__icons">
          { this.props.loading ? <Loader modifier={Loader.Modifier.INLINE} /> : ''}
          { this._getClearButton() }
          <Icon glyph="caret-down" size={Icon.Size.Size14} />
        </span>
      </Button>);
  }
});

var SelectPopup = React.createClass({
  getDefaultProps: function() {
    return {
      data: [],
      filter: false, // can be bool or object with props: "value" and "placeholder"
      anchorElement: null,
      notFoundText: '',
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
    this.props.filter && (this._filterNode.value = value);
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

  _getFilter: function() {
    if (this.props.filter) {
      return (<Input ref="filter" className="ring-select__filter ring-js-shortcuts"
        placeholder={this.props.filter.placeholder || ''} onInput={this.props.onFilter} />);
    }
  },

  render: function() {
    var hint = !this.props.data.length ? this.props.notFoundText : '';

    return (<Popup
      ref="popup"
      hidden={true}
      cutEdge={false}
      anchorElement={this.props.anchorElement}
      autoRemove={false}
      shortcuts={this.state.popupShortcuts}
      onClose={this.props.onClose}>
      {this._getFilter()}
      <List
        data={this.props.data}
        restoreActiveIndex={true}
        onSelect={this.props.onSelect}
        shortcuts={this.state.popupShortcuts}
        hint={hint}/>
    </Popup>);
  }
});

module.exports = Select;
