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
  INPUT: 'input'
};



/**
 * @constructor
 * @extends {ReactComponent}
 */
var FormGroup = React.createClass({
  /** @override */
  propTypes: {
    type: React.PropTypes.string
  },

  /** @override */
  getDefaultProps: function() {
    return {
      type: FormType.INPUT
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
    var classList = React.addons.classSet({
      'ring-form__group': true,
      'ring-form__group_error': this.state.hasError && this.state.errorMessage,
      'ring-form__group_error-shown': this.state.hasError && this.state.errorMessage && this.state.showError
    });

    return (<div className={classList}>
      {typeof this.props.children !== 'undefined' ? this.props.children : this.getInputElement_()}
    </div>);
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
    switch(this.props.type) {
      case FormType.CHECKBOX:
        return (<div className="ring-form__control">
          {this.transferPropsTo(<Checkbox />)}
          <label htmlFor={this.props.id}>{this.props.label}</label>
        </div>);
        break;

      default:
        var inputClassName = React.addons.classSet({
          'ring-input': true,
          'ring-input_error': this.state.hasError && this.state.errorMessage
        });

        return (<div>
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
