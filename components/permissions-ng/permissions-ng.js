require('auth-ng/auth-ng');
var Permissions = require('../permissions/permissions');

/* global angular: false */
var permissionsModule = angular.module('Ring.permissions', ['Ring.auth']);

/**
 * @ngdoc object
 * @name userPermissions
 *
 * @description
 * Configured instance of Permissions object.
 *
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
 *
 * @requires auth
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

  this.$get = ['auth', '$q', function (auth, $q) {
    var permissions = new Permissions(auth.auth, _config);
    // Override load to execute in $digest
    permissions.load = function () {
      return $q.when(Permissions.prototype.load.apply(this));
    };
    return permissions;
  }];
}]);

var registerPermission = function (element) {
  var somePermissionsCtrl = element.controller('somePermissions');
  return somePermissionsCtrl && somePermissionsCtrl.registerPermission() || angular.noop;
};

/**
 * @ngdoc directive
 * @name permission
 *
 * @description
 * The `permission` directive show or hide a portion of the DOM tree (HTML) depending
 * on the logged in user permissions. If the user has listed permissions then the DOM tree
 * is shown, otherwise it is hidden.
 * @example
   <doc:example>
     <doc:source>
       <div permission="space-read" in-space="0-0-0-0-0">
         Is visible if user has permission 'read-space' in space 0-0-0-0-0.
       </div>
       <div permission="space-read">
         Is visible if user has permission 'read-space' at least in one space.
       </div>
     </doc:source>
   </doc:example>
 *
 * @restrict A
 * @element ANY
 * @requires userPermissions
 */
permissionsModule.directive('permission', [
  'userPermissions',
  function (userPermissions) {
    return {
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        //noinspection JSPotentiallyInvalidUsageOfThis
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

/**
 * @ngdoc directive
 * @name permissionIf
 *
 * @description
 * The `permission` directive transcludes or not a portion of the DOM tree (HTML) depending
 * on the logged in user permissions. If the user has listed permissions then the DOM tree
 * is transcluded, otherwise it is not.
 * @example
   <doc:example>
     <doc:source>
       <div permission-if="space-read" in-space="0-0-0-0-0">
         Is transcluded if user has permission 'read-space' in space 0-0-0-0-0.
       </div>
       <div permission-if="space-read">
         Is transcluded if user has permission 'read-space' at least in one space.
       </div>
     </doc:source>
   </doc:example>
 *
 * @restrict A
 * @element ANY
 * @requires $animate
 * @requires userPermissions
 */
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
        var block;
        var childScope;

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

/**
 * @ngdoc directive
 * @name somePermissions
 *
 * @description
 * Binds left-value expression with a boolean value that is true when at least one permission of
 * nested {@link permission} or {@link permissionIf} directive is obtained by the logged in user.
 *
 * @example
   <doc:example>
     <doc:source>
       <div some-permissions="atLeastOneNestedDivIsShown" ng-show="atLeastOneNestedDivIsShown">
         <div permission-if="space-read" in-space="0-0-0-0-0">
           Is transcluded if user has permission 'read-space' in space 0-0-0-0-0.
         </div>
         <div permission-if="space-read">
           Is transcluded if user has permission 'read-space' at least in one space.
         </div>
       </div>
     </doc:source>
   </doc:example>
 *
 * @scope
 * @restrict A
 * @element ANY
 */
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

        //noinspection JSPotentiallyInvalidUsageOfThis
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
