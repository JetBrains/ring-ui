/** @jsx React.DOM */

'use strict';

require('./checkbox.scss');
var React = require('react');
var ReactPropTypes = React.PropTypes;

/**
 * @const
 * @type {string}
 */
var ID_PREFIX = '\\x0';

/**
 * @param {string} prefix
 * @param {number} idCounter
 * @return {string}
 */
var generateUniqueId = (function (prefix, idCounter) {
  return function () {
    var id = String(idCounter++);
    return prefix + id;
  };
}(ID_PREFIX, 0));


/**
 * @constructor
 * @extends {ReactComponent}
 */
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
   * @return {HTMLElement}
   */
  getInputDOMNode: function () {
    return this.refs.input.getDOMNode();
  },

  /**
   * Return native label node which is responsible for the look of checkbox
   * @return {HTMLElement}
   */
  getLabelDOMNode: function () {
    return this.refs.label.getDOMNode();
  },

  render: function () {
    /* jshint ignore:start */
    var id = this.props.id || this.state.id;

    return (
      <label className="ring-form__label">
        {this.transferPropsTo(<input ref="input" className="ring-checkbox" type="checkbox" id={id} />)}
        <label ref="label" className="ring-checkbox__label" htmlFor={id} />
      </label>
      );
    /* jshint ignore:end */
  }
});

module.exports = Checkbox;
