/**
 * @fileoverview Popup Menu.
 * @jsx React.DOM
 */

var PopupMixin = require('./popup-mixin.jsx');
var React = require('react');

/**
 * @enum {number}
 */
var Type = {
  SEPARATOR: 0,
  MENU_LINK: 1,
  MENU_ITEM: 2
};

/**
 * @constructor
 * @extends {ReactComponent}
 */
var MenuSeparator = React.createClass({
  render: function () {
    /* jshint ignore:start */
    return this.transferPropsTo(
      <span className="ring-popup__separator"></span>
    );
    /* jshint ignore:end */
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var MenuItem = React.createClass({
  render: function () {
    /* jshint ignore:start */
    return this.transferPropsTo(
      <span className="ring-popup__item ring-popup__item_action">{this.props.label}</span>
    );
    /* jshint ignore:end */
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var MenuLink = React.createClass({
  render: function () {
    var el = this.props.href ? React.DOM.a : React.DOM.span;
    return this.
      transferPropsTo(el({className: 'ring-link ring-popup__item'}, this.props.label));
  }
});

var MenuList = React.createClass({
  render: function () {
    return React.DOM.div(
      {
        className: 'ring-popup__i'
      },
      this.props.data.map(function (item) {
        var element;
        switch (item.type) {
          case Type.SEPARATOR:
            element = MenuSeparator;
            break;
          case Type.MENU_LINK:
            element = MenuLink;
            break;
          default:
            element = MenuItem;
        }
        return element(item, null);
      })
    );
  }
});

/**
 * @constructor
 * @mixes {PopupMixin}
 * @extends {ReactComponent}
 */
var PopupMenu = React.createClass({
  mixins: [PopupMixin],

  statics: {
    Type: Type
  },

  /** @override */
  propTypes: {
    position: React.PropTypes.number,
    anchorElement: React.PropTypes.object,
    className: React.PropTypes.string
  },

  getInitialState: function () {
    return {data: []};
  },

  /** @override */
  getDefaultProps: function () {
    return {
      anchorElement: document.body
    };
  },

  /** @override */
  getInternalContent: function () {
    return MenuList({data: this.state.data}, null);
  }
});

module.exports = PopupMenu;
