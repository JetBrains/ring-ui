(function () {
  'use strict';

  /**
   * <div header>
   *   <header-auth-link key="login" url="/login" label="Log in"></header-auth-link>
   *   <header-auth-link key="logout" url="/logout" label="Log out"></header-auth-link>
   * </div>
   */
  angular.module('Ring.header', []).
    directive('header', [function () {
      return {
        scope: true,
        controller: ['$scope', function ($scope) {
          var ctrl = this;
          $scope.header = {
            type: [$scope.header, '4x'],
            authLinks: []
          };
          ctrl.addAuthLink = function (key, link) {
            $scope.header.authLinks[key] = link;
          };
        }],
        link: function (scope, iElement) {
          ring('header', 'init')(scope.header, iElement, 'replace');
        }
      };
    }]).
    directive('headerAuthLink', [function () {
      return {
        require: '^header',
        restrict: 'E',
        scope: {
          'key': '@key',
          'url': '@url',
          'target': '@target',
          'label': '@label'
        },
        link: function (scope, iElement, iAttrs, headerCtrl) {
          headerCtrl.addAuthLink(scope.key, {
            'url': scope.url,
            'target': scope.target,
            'label': scope.label
          });
        }
      };
    }]);
}());
