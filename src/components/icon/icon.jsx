/**
 * @fileoverview svg icon component
 * @author alexander.anisimov@jetbrains.com (Aleksandr Anisimov)
 * @jsx React.DOM
 */

'use strict';

require('./icon.scss');
var React = require('react');

/**
 * @enum {number}
 */
var Size = {
  16: 16,
  32: 32,
  64: 64,
  128: 128
};

/**
 * @constructor
 * @extends {ReactComponent}
 */
var Icon = React.createClass({
  statics: {
    Size: Size
  },

  propTypes: {
    className: React.PropTypes.string,

    /**
     * Custom class
     */
    modifier: React.PropTypes.string,

    /**
     * Modifier for the size
     * @type {number}
     */
    size: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      size: Size['64'],
      modifier: ''
    };
  },

  render: function () {
    /* jshint ignore:start */
    var className = [
      'ring-icon',
      'ring-icon_' + this.props.size,
      'ring-icon_' + this.props.modifier,
      this.props.className
    ].join(' ');

    return this.transferPropsTo(
      <span className={className}>
        {this.props.children}
      </span>
    );
    /* jshint ignore:end */
  }
});

/** @type {Icon} */
module.exports = Icon;
