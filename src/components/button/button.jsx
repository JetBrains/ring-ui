/**
 * @jsx React.DOM
 */

'use strict';

require('./button.scss');

var React = require('react');
var ReactPropTypes = React.PropTypes;

/**
 * @constructor
 */
var Button = React.createClass({
  propTypes: {

    /**
     * Theme of the button
     * @see ***REMOVED***
     */
    theme: ReactPropTypes.string,


    /**
     * Custom classes
     */
    className: ReactPropTypes.string
  },

  getDefaultProps: function () {
    return {
      theme: 'default'
    };
  },

  render: function () {
    var className = [
      'ring-btn',
      'ring-btn_' + this.props.theme,
      this.props.className
    ].join(' ');

    return this.transferPropsTo(
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
});

module.exports = Button;
