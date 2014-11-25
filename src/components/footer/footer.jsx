/**
 * @fileoverview Ring Footer.
 * @jsx React.DOM
 */

require('./footer.scss');
require('link/link.scss');

var React = require('react');
// jshint -W098
var $ = require('jquery');

/**
 * @enum {string}
 */
var Position = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
};

/**
 * @constructor
 * @extends {ReactComponent}
 */
var FooterColumn = React.createClass({
  propTypes: {
    position: React.PropTypes.string
  },

  render: function () {
    /* jshint ignore:start */
    return (
      <div className={['ring-footer__column', 'ring-footer__column_' + this.props.position].join(' ')}>
        <ul className="ring-footer__column__i">
          {this.props.children}
        </ul>
      </div>
      );
    /* jshint ignore:end */
  }
});

/**
 * Return copyright string
 * @param year {int}
 * @returns {string}
 */
var copyright = function(year) {
  var currentYear = (new Date()).getUTCFullYear();

  var ret = '© ';

  if (year >= currentYear) {
    ret += year;
  } else {
    ret += year + '—' + currentYear;
  }

  return ret;
};

/**
 * @constructor
 * @extends {ReactComponent}
 */
var FooterLine = React.createClass({
  props: {
    item: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ])
  },
  render: function () {
    /* jshint ignore:start */
    var children = {};
    var renderItem = function(item, idx) {
      // Item is string
      if(!(item.label)) {
        item = {label: item}
      }
      var element = (item.copyright ? copyright(item.copyright) : '') + item.label;
      if (item.url) {
        element = <a className="ring-link" href={item.url} title={item.title}>{element}</a>
      }
      return {
        id: item.label + '-' + idx,
        element: element
      };
    };
    if($.isArray(this.props.item)) {
      this.props.item.map(renderItem).forEach(function(it) {
        children[it.id] = it.element;
      })
    } else {
      var it = renderItem(this.props.item, 0);
      children[it.id] = it.element;
    }
    return (
      <li className="ring-footer__line">
        {children}
      </li>
      );
    /* jshint ignore:end */
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var Footer = React.createClass({
  /** @override */
  propTypes: {
    className: React.PropTypes.string,
    left: React.PropTypes.array,
    center: React.PropTypes.array,
    right: React.PropTypes.array
  },

  render: function () {
    /* jshint ignore:start */

    var content = function(elements, position) {
      return elements ? <FooterColumn key={position} position={position}>{elements.map(function(item, idx) {
        return <FooterLine key={idx} item={item}></FooterLine>;
      })}</FooterColumn> : false
    };

    return (
      //TODO: pass classname property
      <div className={['ring-footer'].concat([this.props.className] || []).join(' ')}>
        {[content(this.props.left, Position.LEFT),
          content(this.props.center, Position.CENTER),
          content(this.props.right, Position.RIGHT)]}
      </div>
      );
    /* jshint ignore:end */
  }
});

module.exports = Footer;
