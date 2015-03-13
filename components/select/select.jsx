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
 <div id="demo"></div>
 <br><br><br><br>
 <div id="demo2"></div>
 </div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Select = require('./select.jsx');

 var select =  React.renderComponent(Select(), document.getElementById('demo'));
 select.setProps({data: [
      {'label': 'One', 'key': '1'},
      {'label': 'Two', 'key': '2'},
      {'label': 'Three', 'key': '3'}
    ]});



 var select2 =  React.renderComponent(Select({filter: false}), document.getElementById('demo2'));
 select2.setProps({data: [
      {'label': '2One', 'key': '1'},
      {'label': '2Two', 'key': '2'},
      {'label': '2Three', 'key': '3'}
    ], 'loading': true, 'clear': true});
 </file>
 </example>
 */
var Select = React.createClass({
  mixins: [Shortcuts.Mixin],

  getDefaultProps: function () {
    return {
      data: [],
      filter: true,
      multiple: false,
      clear: false,
      loading: false,

      label: 'Please select option',
      filterText: 'Filter items',
      notFoundText: 'No options found',
      shortcuts: true
    };
  },

  getInitialState: function() {
    return {
      data: [],
      anchorElement: null,
      selected: null,
      filterString: null,
      popupShortcuts: false,
      hint: null
    };
  },

  getShortcutsProps: function () {
    return {
      map: {
        enter: this.enterHandler
      },
      scope: generateUniqueId()
    };
  },

  enterHandler: function() {
    console.error('ENTERERERERE');
  },

  filter: function(filterString) {
    var filteredData = [];
    for (var i = 0; i < this.props.data.length; i++) {
      if(this.props.data[i].label.match(new RegExp(filterString, 'ig')) || filterString === '') {
        this.props.data[i].type = List.ListProps.Type.ITEM;
        filteredData.push(this.props.data[i]);
      }
    }

    if(this.state.filterString !== filterString) {
      this.setState({filterString: filterString, data: filteredData});
    } else {
      this.setState({filterString: filterString}); // only for focus() input
    }
  },

  _buttonClickHandler: function() {
    if(this.props.filter) {
      this._filterChangeHandler();
    } else {
      this.setState({
        data: this.props.data
      });
    }

    this.refs.popup.show();
    this.setState({
      popupShortcuts: true
    });
  },

  _filterChangeHandler: function() {
    this.filter(this.refs.filter.getDOMNode().value);
  },

  _listSelectHandler: function(selected) {
    this.setState({
      selected: selected
    });

    if(!this.props.multiple) {
      this.refs.popup.close();
      this.clearFilter();
    }
  },

  _onClose: function() {
    this.setState({
      popupShortcuts: false
    });
  },

  componentDidMount: function() {
    // set anchor for popup after all childs mount
    this.setState({
      anchorElement: this.refs.button.getDOMNode()
    })
  },

  componentDidUpdate: function() {
    if(this.refs.popup.isVisible() && this.isMounted() && this.props.filter) {
      this.refs.filter.getDOMNode().focus();
    }
  },

  clearFilter: function() {
    if (this.props.filter) {
      this.refs.filter.getDOMNode().value = '';
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
        <Icon glyph="close" size="14"/>
      </span>);
    }
  },

  _getFilter: function() {
    if(this.props.filter) {
      return (<Input ref="filter" className="ring-select__filter" onClick={this._buttonClickHandler}
        placeholder={this.props.filterText || ''} onInput={this._filterChangeHandler}/>);
    }
  },

  render: function () {
    var hint = null;
    if (!this.state.data.length) {
      hint = this.props.notFoundText;
    }

    return (<div className="ring-js-shortcuts">
      <Button ref="button" onClick={this._buttonClickHandler} className="ring-select">
        {this.state.selected ? this.state.selected.label : this.props.label}
        <span className="ring-select__icons">
          { this.props.loading ? <Loader modifier={Loader.Modifier.INLINE} /> : ''}
          { this._getClearButton() }
          <Icon glyph="caret-down" size="14" />
        </span>
      </Button>
      <Popup
        ref="popup"
        hidden={true}
        cutEdge={false}
        anchorElement={this.state.anchorElement}
        autoRemove={false} // @todo: there is an error with autoRemove=true and no _wrapper in popup
        shortcuts={this.state.popupShortcuts}
        onClose={this._onClose}>
          {this._getFilter()}
          <List
            ref="list"
            data={this.state.data}
            onSelect={this._listSelectHandler}
            shortcuts={this.state.popupShortcuts}
            hint={hint}/>
      </Popup>
    </div>);
  }
});

module.exports = Select;
