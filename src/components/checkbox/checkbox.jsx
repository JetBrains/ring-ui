/** @jsx React.DOM */

'use strict';

require('./checkbox.scss');

var React = require('react');
var ReactPropTypes = React.PropTypes;

var idPrefix = '\\x0';
var generateUniqueId = (function (prefix, idCounter) {
  return function () {
    var id = String(idCounter++);
    return prefix + id;
  };
}(idPrefix, 0));

var Checkbox = React.createClass({
  propTypes: {
    name: ReactPropTypes.string,

    /**
     * Add custom class for checkbox
     */
    className: ReactPropTypes.string,

    /**
     * Add id for component. If user does not pass id
     * we generate unique id for correct work checkbox
     */
    id: ReactPropTypes.string
  },

  getInitialState: function () {
    return {
      id: generateUniqueId()
    };
  },

  /**
   * Return native input node
   * @returns {DOMElement}
   */
  getInputDOMNode: function () {
    return this.refs.input.getDOMNode();
  },

  /**
   * Return native label node
   * which is responsible for the look of checkbox
   * @returns {DOMElement}
   */
  getLabelDOMNode: function () {
    return this.refs.label.getDOMNode();
  },

  render: function () {
    /* jshint ignore:start */
    var id = this.props.id || this.state.id;

    return (
      <span className={this.props.className || ''}>
        {this.transferPropsTo(<input
        ref="input"
        className="ring-checkbox"
        type="checkbox"
        id={id}
        />)}

        <label
        ref="label"
        className="ring-checkbox__label"
        htmlFor={id}>
        </label>
      </span>
      );
    /* jshint ignore:end */
  }
});

module.exports = Checkbox;
