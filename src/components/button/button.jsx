/**
 * @jsx React.DOM
 */

'use strict';

require('./button.scss');

var React = require('react');
var ReactPropTypes = React.PropTypes;

/**
 * @enum {string}
 * @see ***REMOVED***
 */
var Modifiers = {
  DEFAULT: 'default',
  BLUE: 'blue',
  BLACK: 'black',
  PRIMARY: 'primary',
  PLUS: 'plus',
  DELAYED_ACTION: 'delayed-action',
  DANGER: 'danger'
};

/**
 * @constructor
 */
var Button = React.createClass({
  statics: {
   Modifiers: Modifiers,
   Group: require('./button__group')
  },

  propTypes: {

    /**
     * Modifier for button
     * @see Modifiers
     */
    modifier: ReactPropTypes.string,


    /**
     * Custom classes
     */
    className: ReactPropTypes.string
  },

  getDefaultProps: function () {
    return {
      modifier: Modifiers.DEFAULT
    };
  },

  render: function () {
    /* jshint ignore:start */
    var className = [
      'ring-btn',
      'ring-btn_' + this.props.modifier
    ].join(' ');

    return this.transferPropsTo(
      <button className={className}>
        {this.props.children}
      </button>
    );
    /* jshint ignore:end */
  }
});

module.exports = Button;
