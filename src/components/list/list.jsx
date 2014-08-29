/**
 * @fileoverview Item List.
 * @jsx React.DOM
 */


var $ = require('jquery');
var React = require('react');

var shortcuts = require('shortcuts/shortcuts').getInstance();
var Global = require('global/global');

var generateUniqueId = Global.getUIDGenerator('ring-list-');

require('./list.scss');
// We have to use webpack's requires instead of scss' import
// for now to avoid double imports
require('../link/link.scss');

/**
 * @enum {number}
 */
var Type = {
  SEPARATOR: 0,
  LINK: 1,
  ITEM: 2
};

/**
 * @constructor
 * @extends {ReactComponent}
 */
var ListSeparator = React.createClass({
  /** @override */
  render: function () {
    /* jshint ignore:start */
    return (
      <span className="ring-list__separator"></span>
      );
    /* jshint ignore:end */
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var ListItem = React.createClass({
  /** @override */
  getDefaultProps: function() {
    return {active: false};
  },

  /** @override */
  render: function () {
    /* jshint ignore:start */
    var classes = React.addons.classSet({
      'ring-list__item': true,
      'ring-list__item_action': true,
      'active': this.props.active
    });

    return this.transferPropsTo(
      <span className={classes}>{this.props.label}</span>
    );
    /* jshint ignore:end */
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var ListLink = React.createClass({
  /** @override */
  render: function () {
    var el = this.props.href ? React.DOM.a : React.DOM.span;
    return this.
      transferPropsTo(el({className: 'ring-list__item ring-link'}, this.props.label));
  }
});

var List = React.createClass({
  statics: {
    Type: Type
  },

  getDefaultProps: function () {
    return {
      data: [],
      onSelect: $.noop,
      shortcuts: false
    };
  },


  getInitialState: function() {
    return {
      activeIndex: null
    };
  },

  hoverHandler: function(index) {
    this.setState({
      activeIndex: index
    });
  },

  navigateUp: function(e) {
    var index = this.state.activeIndex;
    var newIndex;

    if (!index) {
      newIndex = this.props.data.length - 1;
    } else {
      newIndex = index - 1;
    }

    this.setState({
      activeIndex: newIndex
    });

    e.preventDefault();
  },

  navigateDown: function(e) {
    var index = this.state.activeIndex;
    var newIndex;

    if (index == null || index + 1 === this.props.data.length) {
      newIndex = 0;
    } else {
      newIndex = index + 1;
    }

    this.setState({
      activeIndex: newIndex
    });

    e.preventDefault();
  },

  select: function() {
    return this.props.onSelect(this.props.data[this.state.activeIndex]);
  },

  // TODO Create ShortcutsMixin for this
  /** @override */
  componentDidMount: function() {
    if (this.props.shortcuts) {
      this._shortcutsScope = generateUniqueId();

      shortcuts.bindMap({
        up: this.navigateUp,
        down: this.navigateDown,
        enter: this.select
      }, {
        scope: this._shortcutsScope
      });
      shortcuts.pushScope(this._shortcutsScope);
    }
  },

  /** @override */
  componentWillUnmount: function() {
    if (this.props.shortcuts) {
      shortcuts.unbindScope(this._shortcutsScope);
      shortcuts.spliceScope(this._shortcutsScope);
    }
  },

  /** @override */
  render: function () {
    return React.DOM.div(
      {
        className: 'ring-list'
      },
      this.props.data.map(function (item, index) {
        var props = $.extend({'type': Type.ITEM}, item);
        if (item.url) {
          props.href = item.url;
        }
        if (props.href) {
          props.type = Type.LINK;
        }

        // Probably unqiue enough key
        props.key = Type.LINK + item.label + item.url;

        props.active = (index === this.state.activeIndex);
        props.onMouseOver = this.hoverHandler.bind(this, index);

        var element;
        switch (props.type) {
          case Type.SEPARATOR:
            element = ListSeparator;
            break;
          case Type.LINK:
            element = ListLink;
            break;
          case Type.ITEM:
            element = ListItem;
            break;
          default:
            throw new Error('Unknown menu element type: ' + item.type);
        }
        return element(props, null);
      }.bind(this))
    );
  }
});

module.exports = List;