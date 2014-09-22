/**
 * @author maxim.mazin
 * @fileoverview AngularJS directive that proxies React components.
 */

/* global angular: false */

var React = require('react/addons');

var reactModule = angular.module('Ring.react-ng', []);

var Ring = {};
var directiveName = 'react';

var specialDOMAttrs = {
  'for': 'htmlFor',
  'class': 'className'
};

reactModule.directive(directiveName, [
  '$parse',
  function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, iElement, iAttrs) {
        var name = iAttrs[directiveName];

        var ComponentClass = Ring[name];
        if (!ComponentClass) {
          throw Error('Component ' + name + ' is not registered');
        } else if (!React.isValidClass(ComponentClass)) {
          throw Error('Property ' + name + ' is not valid component');
        }

        var props = {};

        function getUpdater(name) {
          return function updatePropsFromWatch(value, oldValue) {
            // Don't pass undefined on init
            if (angular.isUndefined(value) && angular.isUndefined(oldValue)) {
              return;
            }

            var props = {};
            props[name] = value;
            component.setProps(props);
          };
        }

        angular.forEach(iAttrs, function (value, name) {
          if (iAttrs.hasOwnProperty(name) && name !== directiveName && typeof value === 'string') {
            // Use React DOM attributes names
            var specialDOMAttrName = specialDOMAttrs[name];
            var propName = specialDOMAttrName || name;

            // Detect interpolation
            var interpolated = iElement.attr(iAttrs.$attr[name]) !== value;

            // Check if component expects callback
            var expectsCallback = ComponentClass.propTypes &&
              (ComponentClass.propTypes[propName] === React.PropTypes.func ||
              ComponentClass.propTypes[propName] === React.PropTypes.func.isRequired);

            // Parse as expression
            var parsedExpression = !specialDOMAttrName && !interpolated && $parse(value);

            if (interpolated) {
              iAttrs.$observe(name, getUpdater(propName));
            } else if (parsedExpression && expectsCallback) {
              props[propName] = function (param) {
                var locals = typeof param === 'object' ? angular.copy(param) : {};
                locals.arguments = Array.prototype.slice.call(arguments, 0);

                return parsedExpression(scope, locals);
              };
            } else if (parsedExpression) {
              scope.$watch(parsedExpression, getUpdater(propName));

              props[propName] = parsedExpression(scope);
            } else {
              props[propName] = value;
            }
          }
        });

        var component = React.renderComponent(new ComponentClass(props), iElement[0]);

        iElement.on('$destroy', function() {
          React.unmountComponentAtNode(iElement[0]);
        });
      }
    };
  }
]);

module.exports = function (ringComponents) {
  Ring = ringComponents;
};