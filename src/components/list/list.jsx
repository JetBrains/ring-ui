/**
 * @fileoverview Item List.
 * @jsx React.DOM
 */


var $ = require('jquery');
var React = require('react');

var Shortcuts = require('shortcuts/shortcuts');
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
    var classes = React.addons.classSet({
      'ring-list__separator': true,
      'ring-list__separator_empty': !this.props.description
    });

    return (
      <span className={classes}>{this.props.description}</span>
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
  getDefaultProps: function () {
    return {active: false};
  },

  /** @override */
  render: function () {
    /* jshint ignore:start */
    var classes = React.addons.classSet({
      'ring-list__item': true,
      'ring-list__item_action': true,
      'ring-list__item_active': this.props.active
    });

    return this.transferPropsTo(
      <span className={classes}>
        {this.props.label}
        {this.props.description &&
            <span className="ring-list__description">{this.props.description}</span>}
      </span>
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
  mixins: [Shortcuts.Mixin],

  statics: {
    Type: Type
  },

  propTypes: {
    className: React.PropTypes.string,
    data: React.PropTypes.arrayOf(React.PropTypes.object),
    shortcuts: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    visible: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      data: [],
      onSelect: $.noop,
      shortcuts: false
    };
  },

  getInitialState: function () {
    return {
      activeIndex: null
    };
  },

  hoverHandler: function (index) {
    this.setState({
      activeIndex: index
    });
  },

  upHandler: function (e) {
    var index = this.state.activeIndex;
    var newIndex;

    if (!index) {
      newIndex = this.props.data.length - 1;
    } else {
      newIndex = index - 1;
    }

    this.moveHandler(newIndex, this.upHandler, e);
  },

  downHandler: function (e) {
    var index = this.state.activeIndex;
    var newIndex;

    if (index == null || index + 1 === this.props.data.length) {
      newIndex = 0;
    } else {
      newIndex = index + 1;
    }

    this.moveHandler(newIndex, this.downHandler, e);
  },

  moveHandler: function (index, retryCallback, e) {
    this.setState({activeIndex: index}, function() {
      if (this.props.data[index].type !== Type.ITEM) {
        retryCallback(e);
        return;
      }

      e.preventDefault();
    });
  },

  selectHandler: function () {
    return this.state.activeIndex == null || this.props.onSelect(this.props.data[this.state.activeIndex]);
  },

  getSelected: function () {
    return this.props.data[this.state.activeIndex];
  },

  componentWillReceiveProps: function (props) {
    if (props.data) {
      this.setState({
        activeIndex: null
      });
    }
  },

  getShortcutsProps: function () {
    return {
      map: {
        up: this.upHandler,
        down: this.downHandler,
        enter: this.selectHandler
      },
      scope: generateUniqueId()
    };
  },

  /** @override */
  render: function () {
    return React.DOM.div(
      {
        className: 'ring-list'
      },
      this.props.data.map(function (item, index) {
        var props = $.extend({'type': Type.ITEM}, item);
        if (props.url) {
          props.href = props.url;
        }
        if (props.href) {
          props.type = Type.LINK;
        }

        // Probably unqiue enough key
        props.key = props.key || props.type + props.label;

        props.active = (index === this.state.activeIndex);
        props.onMouseOver = this.hoverHandler.bind(this, index);

        props.onClick = function() {
          if (typeof item.onClick === 'function') {
            item.onClick.apply(item, arguments);
          }

          return this.selectHandler.apply(this, arguments);
        }.bind(this);

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
            throw new Error('Unknown menu element type: ' + props.type);
        }
        return element(props, null);
      }.bind(this))
    );
  }
});

module.exports = List;