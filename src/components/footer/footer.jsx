/**
 * @fileoverview Ring Footer.
 * @jsx React.DOM
 */

require('./footer.scss');
var React = require('react');

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
var FooteColumn = React.createClass({
  propTypes: {
    position: React.PropTypes.string
  },

  render: function () {
    /* jshint ignore:start */
    return (
      <div className="ring-footer__column ring-footer__column_{this.props.position}">
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
