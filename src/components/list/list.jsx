/**
 * @fileoverview Item List.
 * @jsx React.DOM
 */


var $ = require('jquery');
var React = require('react');

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
  getInitialState: function() {
    return {active: false};
  },
  handleHover: function() {
    this.setState({
      active: true
    });
  },
  handleLeave: function() {
    this.setState({
      active: false
    });
  },
  render: function () {
    /* jshint ignore:start */
    var classes = React.addons.classSet({
      'ring-list__item': true,
      'ring-list__item_action': true,
      'active': this.state.active
    });

    return this.transferPropsTo(
      <span className={classes} onMouseOver={this.handleHover} onMouseLeave={this.handleLeave}>{this.props.label}</span>
    );
    /* jshint ignore:end */
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var ListLink = React.createClass({
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
    return {data: []};
  },
  render: function () {
    return React.DOM.div(
      {
        className: 'ring-list'
      },
      this.props.data.map(function (item) {
        var props = $.extend({'type': Type.ITEM}, item);
        if (item.url) {
          props.href = item.url;
        }
        if (props.href) {
          props.type = Type.LINK;
        }

        // Probably enough unqiue key
        props.key = Type.LINK + item.label + item.url;

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
      })
    );
  }
});

module.exports = List;