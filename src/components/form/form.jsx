/**
 * @fileoverview Form component.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @jsx React.DOM
 */

'use strict';

require('./form.scss');
var _ = require('lodash');
var React = require('react/addons');


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
 * @param {string} dependentName
 * @param {string} superiorName
 * @param {DependencyFn=} dependencyFn
 * @private
 */
var bindDependencyFunction_ = function(formElement, dependentName, superiorName, dependencyFn) {
  var dependentField = formElement.querySelector('[name=' + dependentName + ']');
  var superiorField = formElement.querySelector('[name=' + superiorName + ']');

  if (dependentField === null || superiorField === null) {
    throw new Error('Dependent or superior field was not found in form.');
  }

  return dependencyFn.bind(null, dependentField, superiorField);
};

/** @typedef {function(Object.<string, DependencyFunction>):string} DependencyFilter */

// todo(igor.alexeenko): Do we need a class to work with graphs?
/**
 * @type {Array.<DependencyFilter>}
 */
var dependenciesFilter = [
  /**
   * @param {Object.<string, DependencyFunction>} deps
   * @return {string|undefined}
   */
  function chainDependencies(deps) {
    // todo(igor.alexeenko): Do we need to allow chain dependencies?
    // Checkbox enables another checkbox, which enables text field. What happens
    // when we disable first checkbox and second is checked and field is filled?
    var superiorFields = Object.keys(deps);
    var dependentFields = _.flatten(superiorFields.map(function(field) {
      return Object.keys(deps[field]);
    }));

    var chainedField;
    superiorFields.some(function(field) {
      var chained = dependentFields.indexOf(field) > -1;
      if (chained) {
        chainedField = field;
      }

      return chained;
    });

    return chainedField;
  },

  /**
   * @param {Object.<string, DependencyFunction>} deps
   * @return {string|undefined}
   */
  function conflictingDepenendencies(deps) {
    // todo(igor.alexeenko): Are dependencies of different kinds conflicting?
    // Say field is being enabled by checking checkbox and another field changes
    // its value.

    var superiorFields = Object.keys(deps);
    var dependentFields = _.flatten(superiorFields.map(function(field) {
      return Object.keys(deps[field]);
    }));

    var conflictDependentField;
    dependentFields.some(function(field, i, fields) {
      var conflicted = i !== _.lastIndexOf(fields, field);
      if (conflicted) {
        conflictDependentField = field;
      }

      return conflicted;
    });

    return conflictDependentField;
  }
];



/**
 * @constructor
 * @extends {ReactComponent}
 */
var Form = React.createClass({
  /** @override */
  propTypes: {
    /**
     * @param {Object} props
     * @param {string} propName
     * @param {string} componentName
     * @return {Error|undefined}
     */
    'deps': function(props, propName, componentName) {
      var deps = props[propName];
      var invalidField;

      dependenciesFilter.some(function(filter) {
        invalidField = filter(deps);
        return typeof invalidField !== 'undefined';
      });

      if (typeof invalidField !== 'undefined') {
        return new Error(componentName + ' has a dependency problem. ' +
            'Field "' + invalidField + '" has circular, chained ' +
            'or conflicting dependency.');
      }
    }
  },

  /** @override */
  getDefaultProps: function() {
    return {
      'deps': {}
    };
  },

  /** @override */
  getInitialState: function() {
    return {
      /**
       * Dicionary of dependency functions.
       * @type {Object.<string, function>}
       */
      'deps': null,

      /**
       * Whether all required fields are filled.
       * @type {boolean}
       */
      'formIsCompleted': false,

      /**
       * Link to first element, which value is not valid.
       * @type {HTMLInputElement}
       */
      'firstInvalid': null
    };
  },

  /** @override */
  componentDidMount: function() {
    this.checkDependency();
    this.checkCompletion();
  },

  /** @override */
  render: function() {
    return (<form className="ring-form" onChange={this.handleChange_}>
      {this.props.children}
    </form>);
  },

  /**
   * Executes all {@link DependencyFn}s one by one or only one function
   * for field with given name.
   * @param {string=} fieldName
   * @protected
   */
  checkDependency: function(fieldName) {
    if (this.state['deps'] === null) {
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
    if (!this.state['fields']) {
      var formElement = this.getDOMNode();
      var inputElements = formElement.querySelectorAll('input');

      this.setState({
        'fields': Array.prototype.slice.call(inputElements, 0)
      });
    }

    var firstInvalid = null;
    var formIsCompleted = this.state['fields'].every(function(field) {
      if (!field.validity.valid) { firstInvalid = field }
      return field.validity.valid;
    }, this);

    this.setState({
      'formIsCompleted': formIsCompleted,
      'firstInvalid': firstInvalid
    });
  },

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  handleChange_: function(evt) {
    var changedField = /** @type {HTMLInputElement} */ (evt.target);

    this.checkDependency(changedField.name);
    this.checkCompletion();
  },

  /**
   * @protected
   */
  getDependencies: function() {
    var deps = {};

    if (this.props['deps']) {
      var fieldNames = Object.keys(this.props['deps']);
      var formElement = this.getDOMNode();

      fieldNames.forEach(function(fieldName) {
        var dependencyRecord = this.props['deps'][fieldName];
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

    this.setState({ 'deps': deps });
  }
});


module.exports = Form;
module.exports.DependencyFunction = DependencyFunction;
