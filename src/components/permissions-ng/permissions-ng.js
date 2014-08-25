'use strict';

var Permissions = require('../permissions/permissions');

/* global angular: false */
var permissionsModule = angular.module('Ring.permissions', ['Ring.auth']);

/**
 * Configure:
 * @example
 * <pre>
 * angular.config(['userPermissionsProvider', function (userPermissionsProvider) {
 *   userPermissionsProvider.config({
 *     serviceId: '0-0-0-0-0',
 *     prefix: 'jetbrains.jetpass.'
 *   });
 * }]);
 * </pre>
 */
permissionsModule.provider('userPermissions', [function () {
  /**
   * @type {{
   *   serviceId: string?,
   *   prefix: string?
   * }}
   */
  var _config = {};

  /**
   * @param {{
   *   serviceId: string?,
   *   prefix: string?
   * }} config
   */
  this.config = function (config) {
    _config = config;
  };

  this.$get = ['auth', function (auth) {
    return new Permissions(auth.auth, _config);
  }];
}]);

var registerPermission = function (element) {
  var somePermissionsCtrl = element.controller('somePermissions');
  return somePermissionsCtrl && somePermissionsCtrl.registerPermission() || angular.noop;
};

permissionsModule.directive('permission', [
  'userPermissions',
  function (userPermissions) {
    return {
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        this.permitted = false;

        var self = this;
        userPermissions.check($attrs.permission, $scope.$eval($attrs.inSpace)).
          then(function (permitted) {
            self.permitted = permitted;
            if (permitted) {
              $element.show();
            } else {
              $element.hide();
            }
            return permitted;
          }).
          then(registerPermission($element));
      }]
    };
  }
]);

permissionsModule.directive('permissionIf', [
  '$animate',
  'userPermissions',
  function ($animate, userPermissions) {
    return {
      transclude: 'element',
      priority: 600,
      terminal: true,
      restrict: 'A',
      require: '^?somePermissions',
      link: function (scope, iElement, iAttrs, somePermittedCtrl, $transclude) {
        var block, childScope;

        userPermissions.check(iAttrs.permissionIf, scope.$eval(iAttrs.inSpace)).
          then(function (permitted) {
            if (permitted) {
              if (!childScope) {
                childScope = scope.$new();
                $transclude(childScope, function (clone) {
                  block = {
                    startNode: clone[0],
                    endNode: clone[clone.length++] = document.createComment(' end permissionIf: ' + iAttrs.permissionIf + ' ')
                  };
                  $animate.enter(clone, iElement.parent(), iElement);
                });
              }
            } else {
              if (childScope) {
                childScope.$destroy();
                childScope = null;
              }

              if (block) {
                /* global getBlockElements: false */
                $animate.leave(getBlockElements(block));
                block = null;
              }
            }
          }).
          then(registerPermission(iElement));
      }
    };
  }
]);

permissionsModule.directive('somePermissions', [
  function () {
    return {
      scope: {
        'somePermissions': '='
      },
      controller: ['$scope', function ($scope) {
        var permissions = [];
        $scope.somePermissions = false;

        var checkPermissions = function () {
          for (var i = permissions.length - 1; i >= 0; i--) {
            if (permissions[i].permitted) {
              $scope.somePermissions = true;
              return;
            }
          }

          $scope.somePermissions = false;
        };

        this.registerPermission = function () {
          var permission = {permitted: false};
          permissions.push(permission);

          return function (permitted) {
            permission.permitted = permitted;
            checkPermissions();
          };
        };
      }]
    };
  }
]);

module.exports = permissionsModule;