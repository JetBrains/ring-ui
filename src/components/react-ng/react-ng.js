/**
 * @author maxim.mazin
 * @fileoverview AngularJS directive that proxies React components.
 */

/* global angular: false */

var React = require('react/addons');

var reactModule = angular.module('Ring.react-ng', []);

var Ring = {};
var directiveName = 'react';

var domAttrsNames = {};
domAttrsNames['for'] = 'htmlFor';
domAttrsNames['class'] = 'className';

reactModule.directive(directiveName, [
  '$interpolate',
  '$parse',
  function ($interpolate, $parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var name = attrs[directiveName];

        var ComponentClass = Ring[name];
        if (!ComponentClass) {
          throw Error('Component ' + name + ' is not registered');
        }

        // Fake component
        var component = {setState: angular.noop};
        var state = {};

        angular.forEach(attrs, function(value, name) {
          if (attrs.hasOwnProperty(name) && name !== directiveName && typeof value === 'string') {
            // Detect major native DOM attributes
            var domName = domAttrsNames[name];

            // Detect interpolation
            var expression = $interpolate(value, true);

            if (!expression) {
              expression = !domName ? $parse(value) : function() { return value; };
            }

            // Use React DOM attributes names
            var stateName = domName || name;
            state[stateName] = expression(scope);

            scope.$watch(expression, function(result) {
              var state = {};
              state[stateName] = result;
              component.setState(state);
            });
          }
        });

        component = React.renderComponent(new ComponentClass(state), element[0]);
      }
    };
  }
]);

module.exports = function(ring_components) {
  Ring = ring_components;
};