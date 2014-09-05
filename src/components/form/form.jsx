/**
 * @fileoverview Form component.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @jsx React.DOM
 */

'use strict';

require('./form.scss');
var _ = require('underscore');
var FormGroup = require('./form__group');
var React = require('react/addons');


/** @typedef { function(HTMLInputElement, HTMLInputElement):undefined } DependencyFn */


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
var _bindDependencyFunction = function(formElement, dependentName, superiorName, dependencyFn) {
  var dependentField = formElement.querySelector('[name=' + dependentName + ']');
  var superiorField = formElement.querySelector('[name=' + superiorName + ']');

  if (dependentField === null || superiorField === null) {
    throw new Error('Dependent or superior field was not found in form.');
  }

  return dependencyFn.bind(null, dependentField, superiorField);
};

/** @typedef {function(Object.<string, DependencyFunction>):string} DependencyFilter */

// NB! ```propTypes``` does work only in development environment, so these
// checks are redundant in production mode.
if ('production' !== process.env.NODE_ENV) {
  /** @type {Array.<DependencyFilter>} */
  var dependencyFilters = [
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
}


/**
 * @const
 * @type {string}
 */
var FORM_CHILD_PREFIX = 'child-';


/**
 * @constructor
 * @extends {ReactComponent}
 * @example
 * <example>
 *   <div class="form-example"></div>
 *   <script>
 *     @jsx React.DOM
 *
 *     var formDependencies = {
 *       'checkbox': { 'email': Form.DependencyFunction.DISABLED },
 *       'firstField': { 'secondField': Form.DependencyFunction.CLONE }
 *     };
 *
 *     React.renderComponent(<Form deps={formDependencies}>
 *       <FormGroup type="checkbox" name="disableEmail" label="Disable email />
 *       <FormGroup type="email" name="email" label="Email field" />
 *       <FormGroup name="firstField" />
 *       <FormGroup name="secondField" />
 *       <Panel>
 *         <Button name="submitField" type="submit" modifier={Button.Modifiers.BLUE}>Submit</Button>
 *         <Button name="resetField" type="reset" modified={Button.Modifiers.DEFAULT}>Reset</Button>
 *       </Panel>
 *     </Form>, document.querySelector('.form-example'));
 *   </script>
 * </example>
 */
var Form = React.createClass({
  statics: {
    DependecyFunction: DependencyFunction
  },

  /** @override */
  propTypes: ('production' !== process.env.NODE_ENV) ? {
    /**
     * @param {Object} props
     * @param {string} propName
     * @param {string} componentName
     * @return {Error|undefined}
     */
    'deps': function(props, propName, componentName) {
      var deps = props[propName];
      var invalidField;

      dependencyFilters.some(function(filter) {
        invalidField = filter(deps);
        return typeof invalidField !== 'undefined';
      });

      if (typeof invalidField !== 'undefined') {
        return new Error(componentName + ' has a dependency problem. ' +
            'Field "' + invalidField + '" has circular, chained ' +
            'or conflicting dependency.');
      }
    }
  } : {},

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
       * @type {Array.<FormGroup>}
       */
      'fields': null,

      /**
       * Link to first element, which value is not valid.
       * @type {FormGroup}
       */
      'firstInvalid': null,

      /**
       * Whether all required fields are filled.
       * @type {boolean}
       */
      'formIsCompleted': false
    };
  },

  /** @override */
  componentDidMount: function() {
    this.getValidationDependentFields();
    this.getDependencies();

    this.checkDependency();
  },

  /** @override */
  render: function() {
    var children = [];
    React.Children.forEach(this.props.children, function(child, i) {
      children.push(child);
    });

    var childrenToRender = this._setDynamicRefs(children, FORM_CHILD_PREFIX);

    return (<form className="ring-form" onChange={this._handleChange} onBlur={this._handleBlur}>
      {childrenToRender}
    </form>);
  },

  /**
   * Takes an {@link Array} of {@link ReactComponent}s and gives them dynamic
   * ref and a key to make their API accessible from the parent component.
   * @param {Array.<ReactComponent>} elements
   * @param {string} refName
   * @return {Array.<ReactComponent>}
   * @private
   */
  _setDynamicRefs: function(elements, refName) {
    // todo(igor.alexeenko): Create a mixin.
    return elements.map(function(element, i) {
      return React.addons.cloneWithProps(element, {
        'ref': refName + i,
        'key': i
      });
    });
  },

  /**
   * Executes all {@link DependencyFn}s one by one or only one function
   * for field with given name.
   * @param {string=} fieldName
   * @protected
   */
  checkDependency: function(fieldName) {
    if (fieldName) {
      this._checkFieldDependency(fieldName);
    } else {
      var fields = Object.keys(this.state['deps']);
      fields.forEach(function(field) {
        this._checkFieldDependency(field);
      }, this);
    }
  },

  /**
   * Executes all {@link DependencyFn}s, bound to field with given name.
   * @param {string} fieldName
   * @private
   */
  _checkFieldDependency: function(fieldName) {
    var fieldDependencies = this.state.deps[fieldName];

    if (!_.isUndefined(fieldDependencies)) {
      fieldDependencies.forEach(function(dependencyFn) { dependencyFn(); }, this);
    }
  },

  /** @protected */
  checkCompletion: function() {
    var firstInvalid = null;
    var formIsCompleted = this.state['fields'].every(function(field) {
      var fieldIsValid = field.checkValidity();
      if (!fieldIsValid) { firstInvalid = field }
      return fieldIsValid;
    }, this);

    this.setState({
      'formIsCompleted': formIsCompleted,
      'firstInvalid': firstInvalid
    }, function() {
      this.state['fieldToDisable'].disabled = !this.state['formIsCompleted'];
    }.bind(this));
  },

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  _handleChange: function(evt) {
    var changedField = /** @type {HTMLInputElement} */ (evt.target);

    this.checkDependency(changedField.name);
    this.checkCompletion();
  },

  _handleBlur: function(evt) {
    if (this.state['firstInvalid']) {
      this.state['firstInvalid'].setErrorShown(true);
    }
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

          dependencyFunctions.push(_bindDependencyFunction(formElement,
              dependentFieldName, fieldName, dependencyFunction));
        }, this);

        deps[fieldName] = dependencyFunctions;
      }, this);
    }

    this.setState({ 'deps': deps });
  },

  /**
   * @protected
   */
  getValidationDependentFields: function() {
    var fieldsToValidate = [];
    // todo(igor.alexeenko): Find a way not to use submit's HTML node.
    var submitButton = this.getDOMNode().querySelector('[type=submit]');

    _.forEach(this.refs, function(ref, refName) {
      if (!_.isUndefined(ref.checkValidity)) { fieldsToValidate.push(ref); }
    });

    this.setState({
      'fields': fieldsToValidate,
      'fieldToDisable': submitButton
    }, function() {
      this.state['fieldToDisable'].disabled = !this.state['formIsCompleted'];
    }.bind(this));
  }
});


module.exports = Form;
module.exports.DependencyFunction = DependencyFunction;

if ('production' !== process.env.NODE_ENV) {
  module.exports.dependencyFilters = dependencyFilters;
}
