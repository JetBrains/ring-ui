/**
 * @fileoverview Ring Footer.
 * @jsx React.DOM
 */

require('./footer.scss');
var React = require('react');
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
      <div className="{['ring-footer__column', 'ring-footer__column_' + this.props.position].join(' ')}">
        <ul className="ring-footer__column__i">
          {this.props.children}
        </ul>
      </div>
      );
    /* jshint ignore:end */
  }
});

/**
 * @constructor
 * @extends {ReactComponent}
 */
var FooterItem = React.createClass({
  propTypes: {
    item: React.PropTypes.object
  },

  render: function () {
    /* jshint ignore:start */
    var element;
    var item = this.props.item;
    element = (item.copyright ? '&cprt' : '') + item.label;
    if(item.url) {
      element = <a href={item.url}>{element}</a>
    }
    return (
      <li className="ring-footer__line">
        <ul className="ring-footer__column__i">
          {this.props.children}
        </ul>
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
    left: React.PropTypes.object,
    center: React.PropTypes.object,
    right: React.PropTypes.object
  },

  render: function () {
    /* jshint ignore:start */
    return (
      //TODO: pass classname property
      <div className="ring-footer"></div>
      );
    /* jshint ignore:end */
  }

});

module.exports = Footer;
