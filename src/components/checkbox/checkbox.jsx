/** @jsx React.DOM */

'use strict';

require('./checkbox.scss');
var React = require('react');
var Global = require('global/global');
/* jshint ignore:start */
var Icon = require('icon/icon');
/* jshint ignore:end */
var NgModelMixin = require('ngmodel/ngmodel');
var ReactPropTypes = React.PropTypes;

/**
 * @const
 * @type {string}
 */
var ID_PREFIX = '\\x0';

var generateUniqueId = Global.getUIDGenerator(ID_PREFIX);

/**
 * @name Checkbox
 * @constructor
 * @extends {ReactComponent}

   <example name="Checkbox">
   <file name="index.html">
   <div>
   <span id='checkbox'></span>
   <span id='checkbox-selected'></span>
   </div>
   </file>

   <file name="index.js" webpack="true">
   var React = require('react');
   var Checkbox = require('./checkbox.jsx');

   React.renderComponent(Checkbox(), document.getElementById('checkbox'));

   React.renderComponent(Checkbox({
             checked: true
           }), document.getElementById('checkbox-selected'));
   </file>
   </example>
 */

var ngModelStateField = 'checked';
var Checkbox = React.createClass({
  mixins: [NgModelMixin],
  ngModelStateField: ngModelStateField,
  statics: {
    ngModelStateField: ngModelStateField
  },
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
      id: generateUniqueId(),
      checked: this.props.checked ? true : false
    };
  },

  componentWillReceiveProps: function(props) {
    if (props.checked !== undefined) {
      this.state.checked = !!props.checked;
    }
  },

  /**
   * Return native input node
   * @return {HTMLElement}
   */
  getInputDOMNode: function () {
    return this.refs.input.getDOMNode();
  },

  inputChange: function() {
    this.setState({
      checked: this.getInputDOMNode().checked
    });
  },

  render: function () {
    /* jshint ignore:start */
    var id = this.props.id || this.state.id;
    var checkStyle = {
      display: this.state.checked ? 'block' : 'none'
    };

    return (
      <label className="ring-form__label" htmlFor={id}>
        {this.transferPropsTo(<input ref="input" onChange={this.inputChange} type="checkbox" className="ring-checkbox" id={id} />)}
        <span className="ring-checkbox__icon">
          <Icon glyph="check" color="black"  className="ring-checkbox__icon__image" style={checkStyle} />
        </span>
        <span className="ring-checkbox__label">{this.props.label}</span>
      </label>
    );
    /* jshint ignore:end */
  }
});

module.exports = Checkbox;
