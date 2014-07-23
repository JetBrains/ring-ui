/**
 * @author maxim.mazin
 * @fileoverview AngularJS directive that proxies React components.
 */

/* global angular: false */

var React = require('react/addons');

var reactModule = angular.module('Ring.react-ng', []);

var Ring = {};

reactModule.directive('react', [
  function () {
    return {
      scope: {
        react: '@',
        reactState: '&'
      },
      link: function (scope, element) {
        var ComponentClass = Ring[scope.react];
        if (!ComponentClass) {
          throw Error('Component ' + scope.react + ' is not registered');
        }
        React.renderComponent(new ComponentClass(scope.reactState()), element[0]);
      }
    };
  }
]);

module.exports = function(ring_components) {
  Ring = ring_components;
};