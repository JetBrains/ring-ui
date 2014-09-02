/**
 * @fileoverview Form component.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @jsx React.DOM
 */

'use strict';

var React = require('react');


/**
 * @typedef {
 *   function(HTMLInputElement, HTMLInputElement):undefined
 * } DependencyFn
 */


/**
 * List of predefined dependency functions.
 * @enum {DependencyFn}
 */
var DependencyFunction = {
  /**
   * @param {HTMLInputElement} dependentField
   * @param {HTMLInputElement} superiorField
   * @constructor
   */
  CLONE: function(dependentField, superiorField) {
    dependentField.value = superiorField.value;
  },

  /**
   * @param {HTMLInputElement} dependentField
   * @param {HTMLInputElement} superiorField
   * @constructor
   */
  DISABLED: function(dependentField, superiorField) {
    dependentField.disabled = !superiorField.checked;
  }
};


/**
 * Binds {@link DependencyFn} to a fields with given names.
 * @static
 * @param {HTMLFormElement} formElement
 * @param {string} dependentFieldName
 * @param {string} superiorFieldName
 * @param {DependencyFn=} dependencyFunction
 * @private
 */
var bindDependencyFunction_ = function(formElement, dependentFieldName,
    superiorFieldName, dependencyFunction) {
  var dependentField = formElement.querySelector('[name=' + dependentFieldName + ']');
  var superiorField = formElement.querySelector('[name=' + superiorFieldName + ']');

  if (dependentField === null || superiorField === null) {
    throw new Error('Dependent or superior field was not found in form.');
  }

  return dependencyFunction.bind(null, dependentField, superiorField);
};



/**
 * @constructor
 * @extends {ReactComponent}
 */
var Form = React.createClass({
  propTypes: {
    // todo(igor.alexeenko): Circular dependencies.
    // todo(igor.alexeenko): Conflicting dependencies.
    deps: React.PropTypes.objectOf(React.PropTypes.objectOf(React.PropTypes.func))
  },

  /** @override */
  getDefaultProps: function() {
    return {
      deps: {}
    };
  },

  /** @override */
  getInitialState: function() {
    return {
      /**
       * Dicionary of dependency functions.
       * @type {Object.<string, function>}
       */
      deps: null,

      /**
       * Whether all required fields are filled.
       * @type {boolean}
       */
      formIsCompleted: false,

      /**
       * Link to first element, which value is not valid.
       * @type {HTMLInputElement}
       */
      firstInvalid: null
    };
  },

  /** @override */
  componentDidMount: function() {
    this.checkDependency();
    this.checkCompletion();
  },

  /** @override */
  render: function() {
    return this.transferPropsTo(
      <form className="ring-form" onChange={this.handleChange_}>
        {this.props.children}
      </form>
    );
  },

  /**
   * Executes all {@link DependencyFn}s one by one or only one function
   * for field with given name.
   * @param {string=} fieldName
   * @protected
   */
  checkDependency: function(fieldName) {
    if (this.state.deps === null) {
      this.getDependencies();
    }

    if (fieldName) {
      this.checkFieldDependency_(fieldName);
    } else {
      var fields = Object.keys(this.state.deps);
      fields.forEach(function(field) {
        this.checkFieldDependency_(field);
      }, this);
    }
  },

  /**
   * Executes all {@link DependencyFn}s, bound to field with given name.
   * @param {string} fieldName
   * @private
   */
  checkFieldDependency_: function(fieldName) {
    var fieldDependencies = this.state.deps[fieldName];

    if (typeof fieldDependencies === 'undefined') {
      return;
    }

    fieldDependencies.forEach(function(dependencyFn) { dependencyFn(); }, this);
  },

  /** @protected */
  checkCompletion: function() {
    // todo(igor.alexeenko): Check completion only of changed fields.

    if (!this.state.fields) {
      var formElement = this.getDOMNode();
      var inputElements = formElement.querySelectorAll('input');

      this.setState({
        fields: Array.prototype.slice.call(inputElements, 0)
      });
    }

    var firstInvalid = null;
    var formIsCompleted = this.state.fields.every(function(field) {
      if (!field.validity.valid) { firstInvalid = field }
      return field.validity.valid;
    }, this);

    this.setState({
      formIsCompleted: formIsCompleted,
      firstInvalid: firstInvalid
    });
  },

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  handleChange_: function(evt) {
    var changedField = /** @type {HTMLInputElement} */(evt.target);

    this.checkDependency(changedField.name);
    this.checkCompletion();
  },

  /**
   * Initializes dependencies.
   * @protected
   */
  getDependencies: function() {
    var deps = {};

    if (this.props.deps) {
      var fieldNames = Object.keys(this.props.deps);
      var formElement = this.getDOMNode();

      fieldNames.forEach(function(fieldName) {
        var dependencyRecord = this.props.deps[fieldName];
        var dependentFields = Object.keys(dependencyRecord);
        var dependencyFunctions = [];

        dependentFields.forEach(function(dependentFieldName) {
          var dependencyFunction = dependencyRecord[dependentFieldName];

          dependencyFunctions.push(bindDependencyFunction_(formElement,
              dependentFieldName, fieldName, dependencyFunction));
        }, this);

        deps[fieldName] = dependencyFunctions;
      }, this);
    }

    this.setState({ deps: deps });
  }
});


module.exports = Form;
module.exports.DependencyFunction = DependencyFunction;
