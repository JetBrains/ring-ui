/**
 * @fileoverview Input or group of inputs. Encapsulates markup. Shows error
 * message on blur.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @jsx React.DOM
 */

'use strict';

var Checkbox = require('../checkbox/checkbox');
var Input = require('../input/input');
var React = require('react');


/**
 * @enum {string}
 */
var FormType = {
  CHECKBOX: 'checkbox',
  INPUT: 'input',
  RADIO: 'radio'
};



/**
 * @constructor
 * @extends {ReactComponent}
 */
var FormGroup = React.createClass({
  /** @override */
  propTypes: {
    type: React.PropTypes.string,
    short: React.PropTypes.bool
  },

  /** @override */
  getDefaultProps: function() {
    return {
      type: FormType.INPUT,
      short: false
    };
  },

  /** @override */
  getInitialState: function() {
    // todo(igor.alexeenko): ```state.hasError``` is redundant and presense of ```errorMessage``` would be enough.
    return {
      'errorMessage': '',
      'hasError': false,
      'inputElement': null,
      'showError': false
    };
  },

  /** @override */
  render: function() {
    return typeof this.props.children !== 'undefined' ?
        (<div className="ring-form__group">{this.props.children}</div>) :
        this.getInputElement_();
  },

  /**
   * @return {boolean}
   */
  checkValidity: function() {
    if (!this.state.inputElement) {
      // todo(igor.alexeenko): this.setState({ 'inputElement': ... });
      this.state['inputElement'] = this.getDOMNode().querySelector('input');
    }

    this.setState({
      'errorMessage': this.state.inputElement.validationMessage,
      'hasError': !this.state.inputElement.validity.valid
    });

    return this.state.inputElement.validity.valid;
  },

  /**
   * @param {SyntheticMouseEvent} evt
   * @private
   */
  handleBlur_: function(evt) {
    this.checkValidity();
  },

  /**
   * @return {XML}
   * @private
   */
  getInputElement_: function() {
    var className = React.addons.classSet({
      'ring-form__group': true,
      'ring-form__group_error': this.state.hasError && this.state.errorMessage,
      'ring-form__group_error-shown': this.state.hasError && this.state.errorMessage && this.state.showError,
      'ring-form__group_short': [FormType.CHECKBOX, FormType.RADIO].indexOf(this.props.type) > -1 && this.props.short
    });

    switch(this.props.type) {
      case FormType.CHECKBOX:
        if (this.props.short) {
          return (<div className={className}>
            {this.transferPropsTo(<Checkbox />)}
            <div className="ring-form__control">
              <label className="ring-form__label" htmlFor={this.props.id}>{this.props.label}</label>
            </div>
          </div>);
        } else {
          return (<div className={className}>
            <div className="ring-form__control">
              {this.transferPropsTo(<Checkbox />)}
              <label className="ring-form__label ring-form__label_checkbox" htmlFor={this.props.id}>{this.props.label}</label>
            </div>
          </div>);
        }
        break;

      default:
        var inputClassName = React.addons.classSet({
          'ring-input': true,
          'ring-input_error': this.state.hasError && this.state.errorMessage
        });

        return (<div className={className}>
          <label className="ring-form__label" htmlFor={this.props.id}>{this.props.label}</label>
          <div className="ring-form__control">
            {this.transferPropsTo(<Input className={inputClassName} onBlur={this.handleBlur_} />)}
          </div>
        </div>);
        break;
    }
  }
});

module.exports = FormGroup;
