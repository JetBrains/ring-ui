/**
 * @name Permissions Ng
 * @category Angular Components
 */
import 'dom4';
import '../auth-ng/auth-ng';
import Permissions from '../permissions/permissions';
import PermissionsCache from '../permissions/permissions__cache';

import './permissions-ng.scss';

function registerPermission(element) {
  const somePermissionsCtrl = element.controller('rgSomePermissions');
  return somePermissionsCtrl && somePermissionsCtrl.registerPermission() || angular.noop;
}

/* global angular: false */
const angularModule = angular.module('Ring.permissions', ['Ring.auth']);

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

/**
 * @typedef {Object} permissionsNgConfig
 * @property {string?} serviceId
 * @property {string?} prefix
 */
angularModule.provider('userPermissions', function () {
  /**
   * @type {permissionsNgConfig}
   */
  let _config = {};

  /**
   * @param {permissionsNgConfig} config
   */
  this.config = config => {
    _config = config;
  };

  this.$get = function (auth, $q) {
    const permissions = new Permissions(auth.auth, _config);

    // Override load to execute in $digest
    permissions.load = function () {
      return $q.when(Permissions.prototype.load.call(this));
    };

    return permissions;
  };
});

/**
 * @ngdoc directive
 * @name permission
 *
 * @description
 * The `permission` directive show or hide a portion of the DOM tree (HTML) depending
 * on the logged in user permissions. If the user has listed permissions then the DOM tree
 * is shown, otherwise it is hidden.
 * @example
 <example name="rgPermission directive">
 <file name="index.html">
 <div rg-permission="project-read" in-project="0-0-0-0-0">
 Is visible if user has permission 'read-project' in project 0-0-0-0-0.
 </div>
 <div rg-permission="{{scopeVariableName}}" in-project="0-0-0-0-0">
 Is visible if user has permission 'read-project' in project 0-0-0-0-0.
 </div>
 <div rg-permission="project-read">
 Is visible if user has permission 'read-project' at least in one project.
 </div>
 <div rg-permission="project-read" in-global>
 Is visible if user has permission 'read-project' at project "global".
 </div>
 </file>
 </example>
 *
 * @restrict A
 * @element ANY
 * @requires userPermissions
 */
angularModule.directive('rgPermission', function rgPermissionDirective(userPermissions, $interpolate) {
  return {
    controller: function controller($scope, $element, $attrs) {
      const element = $element[0];

      //noinspection JSPotentiallyInvalidUsageOfThis
      this.permitted = false;

      element.classList.add('ring-permission-hide');

      const permission = $interpolate($attrs.rgPermission)($scope);

      const projectId = $attrs.hasOwnProperty('inGlobal') ? PermissionsCache.GLOBAL_PROJECT_ID : $scope.$eval($attrs.inProject);

      userPermissions.check(permission, projectId).
        then(permitted => {
          this.permitted = permitted;
          if (permitted) {
            element.classList.remove('ring-permission-hide');
          }
          return permitted;
        }).
        then(registerPermission($element));
    }
  };
});

/**
 * @ngdoc directive
 * @name permissionIf
 *
 * @description
 * The `permission` directive transcludes or not a portion of the DOM tree (HTML) depending
 * on the logged in user permissions. If the user has listed permissions then the DOM tree
 * is transcluded, otherwise it is not.
 * @example
 <example name="rgPermissionIf directive">
 <file name="index.html">
 <div rg-permission-if="project-read" in-project="0-0-0-0-0">
 Is transcluded if user has permission 'read-project' in project 0-0-0-0-0.
 </div>
 <div rg-permission-if="project-read">
 Is transcluded if user has permission 'read-project' at least in one project.
 </div>
 <div rg-permission-if="project-read" in-global>
 Is transcluded if user has permission 'read-project' at project "global".
 </div>
 </file>
 </example>
 *
 * @restrict A
 * @element ANY
 * @requires $animate
 * @requires userPermissions
 */
angularModule.directive('rgPermissionIf', function rgPermissionIfDirective($animate, userPermissions, $interpolate) {
  return {
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    // disable error about multiple transclude like in ngIf
    $$tlb: true, // eslint-disable-line angular/no-private-call
    require: '^?rgSomePermissions',
    link: function link(scope, iElement, iAttrs, somePermittedCtrl, $transclude) {
      let block;
      let childScope;

      const projectId = iAttrs.hasOwnProperty('inGlobal') ? PermissionsCache.GLOBAL_PROJECT_ID : scope.$eval(iAttrs.inProject);

      const permission = $interpolate(iAttrs.rgPermissionIf)(scope);

      userPermissions.check(permission, projectId).
        then(permitted => {
          if (permitted) {
            if (!childScope) {
              childScope = scope.$new();
              $transclude(childScope, clone => {
                block = {
                  startNode: clone[0],
                  endNode: clone[clone.length++] = document.createComment(` end rgPermissionIf: ${iAttrs.rgPermissionIf} `)
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
});

/**
 * @ngdoc directive
 * @name rgSomePermissions
 *
 * @description
 * Binds left-value expression with a boolean value that is true when at least one permission of
 * nested {@link permission} or {@link rgPermissionIf} directive is obtained by the logged in user.
 *
 * @example
 <example name="somePermissions directive">
 <file name="index.html">
 <div rg-some-permissions="atLeastOneNestedDivIsShown" ng-show="atLeastOneNestedDivIsShown">
 <div rg-permission-if="project-read" in-project="0-0-0-0-0">
 Is transcluded if user has permission 'read-project' in project 0-0-0-0-0.
 </div>
 <div rg-permission-if="project-read">
 Is transcluded if user has permission 'read-project' at least in one project.
 </div>
 </div>
 </file>
 </example>
 *
 * @scope
 * @restrict A
 * @element ANY
 */
angularModule.directive('rgSomePermissions', function rgSomePermissionsDirective() {
  return ({
    scope: {
      rgSomePermissions: '='
    },
    controller: function controller($scope) {
      const permissions = [];
      $scope.rgSomePermissions = false;

      function checkPermissions() {
        for (let i = permissions.length - 1; i >= 0; i--) {
          if (permissions[i].permitted) {
            $scope.rgSomePermissions = true;
            return;
          }
        }

        $scope.rgSomePermissions = false;
      }

      //noinspection JSPotentiallyInvalidUsageOfThis
      this.registerPermission = () => {
        const permission = {permitted: false};
        permissions.push(permission);

        return permitted => {
          permission.permitted = permitted;
          checkPermissions();
        };
      };
    }
  });
});

export default angularModule.name;
