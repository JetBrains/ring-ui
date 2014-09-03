/**
 * @jsx React.DOM
 * @fileOverview svg icon component
 */

'use strict';

require('./icon.scss');

var React = require('react');

/**
 * @type {number[]}
 */
var Sizes = [16, 32, 64, 128];

/**
 * @constructor
 */
var Icon = React.createClass({
  propTypes: {
    /**
     * Modifier for the size
     * @number 16, 32, 64, 128
     */
    modifier: React.PropTypes.number,

    /**
     * Custom class
     */
    className: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      size: Sizes[2]
    };
  },

  render: function () {
    /* jshint ignore:start */
    var className = [
      'ring-icon',
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

module.exports = Icon;
module.exports.Sizes = Sizes;