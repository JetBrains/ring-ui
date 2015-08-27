/** @jsx React.DOM */

require('./checkbox.scss');
var React = require('react');
var Global = require('global/global');
var Icon = require('icon/icon');
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
 * @example
   <example name="Checkbox">
   <file name="index.html">
    <h1>Base Examples</h1>
    <div id="checkbox-base">
      <span id="checkbox"></span>
      <span id="checkbox-selected"></span>
      <span id="checkbox-disabled"></span>
    </div>
    <h1>Examples with outer styles</h1>
    <div id="checkbox-additional">
      <div style="line-height: 60px">
        <span id="checkbox-in-large-line-height-div"></span>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
      <div style="line-height: 6px;">
        <span id="checkbox-in-small-line-height-div"></span>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
      <div style="font-size: 40px">
        <span id="checkbox-in-large-font-div"></span>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
      <div style="line-height: 6px; font-size: 4px">
        <span id="checkbox-in-small-font-div"></span>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
    </div>
   </file>

   <file name="index.js" webpack="true">
   var React = require('react');
   var Checkbox = require('checkbox/checkbox.jsx');

   React.renderComponent(Checkbox(), document.getElementById('checkbox'));

   React.renderComponent(Checkbox({
             checked: true
           }), document.getElementById('checkbox-selected'));
   React.renderComponent(Checkbox({
             checked: true,
             disabled: true,
             label: 'This checkbox is disabled'
           }), document.getElementById('checkbox-disabled'));
    React.renderComponent(Checkbox({
             checked: true,
             label: 'This checkbox is inside div with large line-heigth.'
           }), document.getElementById('checkbox-in-large-line-height-div'));
    React.renderComponent(Checkbox({
             checked: true,
             label: 'This checkbox is inside div with small line-heigth.'
           }), document.getElementById('checkbox-in-small-line-height-div'));
    React.renderComponent(Checkbox({
             checked: true,
             label: 'This checkbox is inside div with large font-size.'
           }), document.getElementById('checkbox-in-large-font-div'));
    React.renderComponent(Checkbox({
             checked: true,
             label: 'This checkbox is inside div with small font-size.'
           }), document.getElementById('checkbox-in-small-font-div'));
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
     * Set component ID. If user does not pass an ID
     * we generate a unique ID for checkbox to work correctly.
     */
    id: ReactPropTypes.string
  },

  getInitialState: function () {
    return {
      id: generateUniqueId(),
      checked: this.props.checked,
      disabled: this.props.disabled
    };
  },

  componentWillReceiveProps: function(props) {
    if (props.checked !== undefined) {
      this.state.checked = !!props.checked;
    }
    if (props.disabled !== undefined) {
      this.state.disabled = !!props.disabled;
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
    var newValue = this.getInputDOMNode().checked;
    this.setState({
      checked: newValue
    }, function() {
      this.props.onChange && this.props.onChange(newValue);
    });
  },

  render: function () {
    var id = this.props.id || this.state.id;
    var checkStyle = {
      display: this.state.checked ? 'block' : 'none'
    };
    var disabledState = this.state.disabled ? 'disabled' : '';

    return (
      <label className="ring-checkbox" htmlFor={id}>
        <span className="ring-checkbox__input-wrapper">
          {this.transferPropsTo(<input ref="input" disabledState onChange={this.inputChange} type="checkbox" className="ring-checkbox__input" id={id} />)}
          <span className="ring-checkbox__icon">
            <Icon glyph="check" color="black" size={Icon.Size.Size16} className="ring-checkbox__icon__image" style={checkStyle} />
          </span>
        </span>
        <span className="ring-checkbox__label">{this.props.label}</span>
      </label>
    );
  }
});

module.exports = Checkbox;
