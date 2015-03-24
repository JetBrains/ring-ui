/**
 * @fileoverview Input or group of inputs. Encapsulates markup. Shows error
 * message on blur.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @jsx React.DOM
 */
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
    'type': React.PropTypes.string,
    'short': React.PropTypes.bool
  },

  /** @override */
  getDefaultProps: function() {
    return {
      'type': FormType.INPUT,
      'short': false
    };
  },

  /** @override */
  getInitialState: function() {
    return {
      'errorMessage': '',
      'hasFocus': false,
      'inputElement': null,
      'showError': false
    };
  },

  /** @override */
  componentDidMount: function() {
    // TODO Refactor or remove component
    /* eslint-disable react/no-did-mount-set-state */
    this.setState({
      'inputElement': this.getDOMNode().querySelector('input')
    });
    /* eslint-enable react/no-did-mount-set-state */
  },

  /** @override */
  render: function() {
    return typeof this.props.children !== 'undefined' ?
        (<div className="ring-form__group">{this.props.children}</div>) :
        this._getInputElement();
  },

  /**
   * @return {boolean}
   */
  checkValidity: function() {
    this.setState({
      'errorMessage': this.state['inputElement'].validationMessage
    });

    return this.state['inputElement'].validity.valid;
  },

  /**
   * @private
   */
  _handleBlur: function() {
    this.checkValidity();
    this.setState({ 'hasFocus': false });
  },

  /**
   * @private
   */
  _handleFocus: function() {
    this.setState({ 'hasFocus': true });
  },

  /**
   * @return {XML}
   * @private
   */
  _getInputElement: function() {
    var className = React.addons.classSet({
      'ring-form__group': true,
      'ring-form__group_error': this.state['errorMessage'],
      'ring-form__group_error-shown': this.state['errorMessage'] && this.state['showError'] && this.state['hasFocus'],
      'ring-form__group_short': [FormType.CHECKBOX, FormType.RADIO].indexOf(this.props['type']) > -1 && this.props['short']
    });

    switch (this.props.type) {
      case FormType.CHECKBOX:
        if (this.props['short']) {
          return (<div className={className}>
            {this.transferPropsTo(<Checkbox />)}
            <div className="ring-form__control">
              <label className="ring-form__label" htmlFor={this.props['id']}>{this.props['label']}</label>
            </div>
          </div>);
        } else {
          return (<div className={className}>
            <div className="ring-form__control">
              {this.transferPropsTo(<Checkbox />)}
              <label className="ring-form__label ring-form__label_checkbox" htmlFor={this.props['id']}>{this.props['label']}</label>
            </div>
          </div>);
        }
        break;

      default:
        var inputClassName = React.addons.classSet({
          'ring-input': true,
          'ring-input_error': this.state['errorMessage']
        });

        return (<div className={className}>
          <label className="ring-form__label" htmlFor={this.props.id}>{this.props.label}</label>
          <div className="ring-form__control">
            {this.transferPropsTo(<Input className={inputClassName} onBlur={this._handleBlur} onFocus={this._handleFocus} />)}
            <div className="ring-input__error-bubble">{this.state['errorMessage']}</div>
          </div>
        </div>);
    }
  },

  /**
   * @param {boolean} shown
   */
  setErrorShown: function(shown) {
    this.setState({
      'showError': shown
    });
  }
});

module.exports = FormGroup;
