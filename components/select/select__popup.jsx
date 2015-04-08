/**
 * @fileoverview Select options popup
 * @jsx React.DOM
 */
var React = require('react');
var Popup = require('popup/popup');
var List = require('list/list');
var Input = require('input/input');

var SelectPopup = React.createClass({
  getDefaultProps: function() {
    return {
      data: [],
      activeIndex: null,
      toolbar: null,
      filter: false, // can be boolean or an object with "value" and "placeholder" properties
      message: null,
      anchorElement: null,
      maxHeight: 250,
      minWidth: 'target',
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

  componentDidMount: function() {
    if (this.refs.filter) {
      if (this.props.filter.value) {
        this.refs.filter.getDOMNode().value = this.props.filter.value;
      }
      this.focusFilter();
    }
  },

  focusFilter: function() {
    if (this.refs.filter) {
      this.refs.filter.getDOMNode().focus();
    }
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

  remove: function () {
    this.refs.popup.remove();
  },

  isVisible: function() {
    return this.refs.popup.isVisible();
  },

  getFilter: function() {
    if (this.props.filter) {
      return (<div className="ring-popup__filter-wrapper">
        <Input ref="filter" className="ring-js-shortcuts ring-input_filter-popup"
               placeholder={this.props.filter.placeholder || ''}
               onInput={this.props.onFilter}
          />
      </div>);
    }
  },

  getMessage: function() {
    if (this.props.message) {
      return <div className="ring-select__message">{this.props.message}</div>;
    }
  },

  getList: function() {
    if (this.props.data.length) {
      return (<List
        maxHeight={this.props.maxHeight}
        data={this.props.data}
        activeIndex={this.props.activeIndex}
        restoreActiveIndex={true}
        activateSingleItem={true}
        onSelect={this.props.onSelect}
        shortcuts={this.state.popupShortcuts}
        />);
    }
  },

  render: function() {
    return (<Popup
      ref="popup"
      hidden={true}
      cutEdge={false}
      dontCloseOnAnchorClick={true}
      anchorElement={this.props.anchorElement}
      autoRemove={false}
      minWidth={this.props.minWidth}
      shortcuts={this.state.popupShortcuts}
      onClose={this.props.onClose}>
      {this.getFilter()}
      {this.getList()}
      {this.getMessage()}
      {this.props.toolbar}
    </Popup>);
  }
});

module.exports = SelectPopup;
