/** @jsx React.DOM */

'use strict';

require('./checkbox.scss');

var React = require('react');

var Checkbox = React.createClass({
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
    return (
      <span className={this.props.className}>
        {this.transferPropsTo(<input
          ref="input"
          className="ring-checkbox"
          type="checkbox"
        />)}

        <a
          href="#"
          ref="label"
          className="ring-checkbox__label"
          onClick={this._onClick}>
        </a>
      </span>
      );
    /* jshint ignore:end */
  },

  _onClick: function (event) {
    event.preventDefault();

    this.refs.input.setState({
      checked: !this.refs.input.props.checked
    });

    if (this.props.onClick) {
      event.target = this.getInputDOMNode();
      this.props.onClick(event);
    }
  }
});

module.exports = Checkbox;
