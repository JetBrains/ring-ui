/**
 * @fileoverview Form component.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

require('dom4');
var Global = require('global/global');
var every = require('mout/collection/every');
var map = require('mout/collection/map');
var forEach = require('mout/collection/forEach');
var React = require('react/addons');

require('./form.scss');


/**
 * A function which iterates over tree in preorder and calls a given callback
 * on every node. If callback returns false value or node has already been
 * visited, visitor traversal stopped.
 * @param {Object} tree
 * @param {Object} visited
 * @param {Array.<string>} sequence
 * @param {function=} callback
 * @param {*=} ctx
 * @return {boolean}
 */
var dfsVisitor = function(tree, visited, sequence, callback, ctx) {
  return every(tree, function(subtree, vertice) {
    sequence.push(vertice);

    if (visited[vertice]) {
      return false;
    }

    visited[vertice] = true;

    var childVisited = subtree ?
        dfsVisitor(subtree, visited, sequence, callback, ctx) :
        true;

    if (callback && childVisited) {
      return callback.call(ctx, vertice, subtree, sequence, visited);
    }

    return childVisited;
  });
};


/**
 * Callback for {@code dfsVisitor} which allows to find a parent node for
 * a given element.
 * @param {Object} tree
 * @param {string} nodeName
 * @return {?string}
 */
var getParentNode = function(tree, nodeName) {
  var parentNode = null;

  var lookForParent = function(node, subtree) {
    if (parentNode === null && subtree && subtree.hasOwnProperty(nodeName)) {
      parentNode = node;
      return false;
    }

    return true;
  };

  dfsVisitor(tree, {}, [], lookForParent);

  return parentNode;
};


/**
 * Callback, which returns subtree of a given node.
 * @param {Object} tree
 * @param {string} nodeName
 * @return {?Object}
 */
var getSubtree = function(tree, nodeName) {
  var foundSubtree = null;

  var lookForSubtree = function(node, subtree) {
    if (foundSubtree === null && node === nodeName) {
      foundSubtree = subtree;
      return false;
    }

    return true;
  };

  dfsVisitor(tree, {}, [], lookForSubtree);

  return foundSubtree;
};


/**
 * @typedef {function(
 *   HTMLInputElement,
 *   HTMLInputElement,
 *   HTMLFormElement,
 *   boolean=,
 *   Object
 * ):undefined} DependencyFn
 */

/**
 * @enum {DependencyFn}
 */
var DependencyFunction = {
  CHECKED: function(parentElement, childElement, formElement, chain, depsTree) {
    if (childElement) {
      childElement.checked = parentElement.checked;
    }

    var nodeName = parentElement.name;
    var parent = getParentNode(depsTree, nodeName);

    while (parent !== null && !chain) {
      var childrenOfParent = getSubtree(depsTree, parent);
      parentElement = formElement.query('[name=' + parent + ']');

      /* eslint-disable no-loop-func */
      parentElement.checked = every(childrenOfParent, function(childTree, child) {
        var currentChildElement = formElement.query('[name=' + child + ']');
        return currentChildElement.checked;
      });
      /* eslint-enable no-loop-func */

      parent = getParentNode(depsTree, parent);
    }
  },

  DISABLED: function(parentElement, childElement) {
    // NB! Should always contain a link to a child element, because sometimes it's
    // called of leafs of dependency tree, so there're no children at them.
    if (childElement) {
      childElement.disabled = !parentElement.checked;
    }
  }
};


/**
 * @return {DependencyType}
 */
var getDependencyTypeName = Global.getUIDGenerator('d');


/**
 * ID of dependency type.
 * @enum {string}
 */
var DependencyType = {
  CHECKED: getDependencyTypeName(),
  DISABLED: getDependencyTypeName()
};

/**
 * Lookup table of {@link DependencyType} to {@link DependencyFn}.
 * @type {Object.<DependencyType, DependencyFn>}
 */
var DependencyTypeToFn = Global.createObject(
    DependencyType.CHECKED, DependencyFunction.CHECKED,
    DependencyType.DISABLED, DependencyFunction.DISABLED);


/**
 * @param {DependencyFn} fn
 * @return {DependencyType}
 */
var addDependencyFn = function(fn) {
  var type = getDependencyTypeName();
  DependencyTypeToFn[type] = fn;

  return type;
};
/**
 * @const
 * @type {string}
 */
var FORM_CHILD_PREFIX = 'child-';



/**
 * @constructor
 * @extends {ReactComponent}
 */
var Form = React.createClass({
  statics: {
    addDependencyFunction: addDependencyFn,
    DependencyType: DependencyType
  },

  getDefaultProps: function() {
    return { 'deps': {} };
  },

  getInitialState: function() {
    return {
      'deps': null,
      'fields': null,
      'firstInvalid': null,
      'formIsCompleted': false
    };
  },

  componentDidMount: function() {
    this.getValidationDependentFields();
    this.getDependencies();
  },

  render: function() {
    var children = [];
    React.Children.forEach(this.props.children, function(child) {
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

  /** @protected */
  checkDependencies: function() {
    if (!this.state['fieldsOrder']) {
      var inputElements = this.getDOMNode().queryAll('input');
      var fieldsOrder = map(inputElements, function(inputElement) {
        if (this.state['deps'][inputElement.name]) {
          return inputElement.name;
        }
      }, this).filter(function(inputName) {
        return typeof inputName !== 'undefined';
      });

      this.setState({'fieldsOrder': fieldsOrder}, function() {
        this.checkDependencies();
      }.bind(this));

      return;
    }

    this.state['fieldsOrder'].forEach(function(fieldName) {
      this.checkDependency(fieldName);
    }, this);
  },

  /**
   * Executes all dependency functions one by one or only one function
   * for field with given name.
   * @param {string=} field
   * @param {boolean=} chain
   * @protected
   */
  checkDependency: function(field, chain) {
    chain = typeof chain === 'undefined' ? false : chain;

    if (this.state['deps'][field]) {
      this.state['deps'][field].forEach(function(dep) {
        dep(chain);
      }, this);
    }
  },

  /**
   * Checks, whether all form fields are valid. If not, shows an error on
   * first invalid field.
   * @protected
   */
  checkCompletion: function() {
    var firstInvalid = null;
    var formIsCompleted = this.state['fields'].every(function(field) {
      var fieldIsValid = field.checkValidity();
      if (!fieldIsValid) {
        firstInvalid = field;
      }
      return fieldIsValid;
    }, this);

    this.setState({
      'formIsCompleted': formIsCompleted,
      'firstInvalid': firstInvalid
    }, this._setValidationDependentFieldsDisabled);
  },

  /**
   * Handles change of every form element.
   * @param {SyntheticEvent} evt
   * @private
   */
  _handleChange: function(evt) {
    var changedField = /** @type {HTMLInputElement} */ (evt.target);
    this.checkCompletion(changedField);
    this.checkDependency(changedField.name);
  },

  /**
   * Handles blur of every component.
   * @private
   */
  _handleBlur: function() {
    if (this.state['firstInvalid']) {
      this.state['firstInvalid'].setErrorShown(true);
    }
  },

  /**
   * Analyzes passed dependencies and creates a map of field names to functions
   * which should be executed when the value of this field changes. If dependencies
   * has cycle or a conflict, throws an error.
   * @protected
   * @throws {Error}
   */
  getDependencies: function() {
    var deps = this.state['deps'] || {};
    var formElement = this.getDOMNode();

    forEach(this.props['deps'], function(depsTree, dependencyType) {
      var sequence = [];
      var dependencyFunction = DependencyTypeToFn[dependencyType];

      var analyzedDeps = dfsVisitor(depsTree, {}, sequence, function(vertice, tree) {
        var verticeElement = formElement.query('[name=' + vertice + ']');
        var dependencies = [];

        if (tree) {
          forEach(tree, function(subtree, child) {
            var childElement = formElement.query('[name=' + child + ']');
            dependencies.push(function(chain) {
              dependencyFunction.call(this, verticeElement, childElement, formElement, chain, depsTree);
              if (subtree) {
                this.checkDependency(child, true);
              }
            });
          }, this);
        } else {
          dependencies = [function(chain) {
            dependencyFunction.call(this, verticeElement, undefined, formElement, chain, depsTree);
          }];
        }

        deps[vertice] = (deps[vertice] || []).concat(dependencies);
        return true;
      }, this);

      if (!analyzedDeps) {
        throw new Error('A problem with dependencies occured. Field "' +
            sequence.slice(-1)[0] + '" has cyclic or conflicting dependency.');
      }
    }, this);

    this.setState({ 'deps': deps }, function() {
      this.checkDependencies();
    }.bind(this));
  },

  /**
   * Remembers all fields that should be disabled while form isn't valid.
   * @protected
   */
  getValidationDependentFields: function() {
    var fieldsToValidate = [];
    var submitButton = this.getDOMNode().query('[type=submit]');

    forEach(this.refs, function(ref) {
      if (typeof ref.checkValidity !== 'undefined') {
        fieldsToValidate.push(ref);
      }
    });

    this.setState({
      'fields': fieldsToValidate,
      'fieldToDisable': submitButton
    }, this._setValidationDependentFieldsDisabled);
  },

  /**
   * Toggles disabled state of fields that should be disabled while the form
   * isn't valid.
   * @private
   */
  _setValidationDependentFieldsDisabled: function() {
    if (this.state['fieldToDisable']) {
      this.state['fieldToDisable'].disabled = !this.state['formIsCompleted'];
    }
  }
});


module.exports = Form;

/* global process */
if (process.env.NODE_ENV !== 'production') {
  module.exports.dfsVisitor = dfsVisitor;
  module.exports.getParentNode = getParentNode;
  module.exports.getSubtree = getSubtree;
}
