(function () {
  'use strict';

  /**
   *   <div menu="noborder">
   *     <menu-logo side="left" url="/dashboard" image="/images/ring.png"></menu-logo>
   *     <menu-item side="left" url="/users" label="Users"></menu-item>
   *     <menu-item side="left" url="/groups" label="Groups"></menu-item>
   *     <menu-item side="left" url="/spaces" label="Spaces"></menu-item>
   *     <menu-item side="left" url="/services" label="Services"></menu-item>

   *     <menu-item side="right" url="/authmodules" label="Auth modules"></menu-item>
   *     <menu-item side="right" url="/roles" label="Roles"></menu-item>
   *     <menu-item side="right" url="/help" type="help"></menu-item>
   *   </div>
   */
  angular.module('Ring.menu', []).
    directive('menu', [function () {
      return {
        scope: {
          menu: "@menu"
        },
        controller: ['$scope', function ($scope) {
          var ctrl = this;
          $scope.menu = {
            'type': $scope.menu,
            'left': {
              'logo': null,
              'items': []
            },
            'right': {
              'logo': null,
              'items': []
            }
          };
          ctrl.addMenuItem = function(sideName, item) {
            $scope.menu[sideName].items.push(item);
          };
          ctrl.setMenuLogo = function (sideName, logo) {
            $scope.menu[sideName].logo = logo;
          };
        }],
        link: function (scope, iElement) {
          ring('menu', 'init')(scope.menu, iElement, 'after');
        }
      };
    }]).
    directive('menuItem', [function () {
      return {
        require: '^menu',
        restrict: 'E',
        scope: {
          'url': '@url',
          'type': '@type',
          'label': '@label',
          'sideName': '@side'
        },
        link: function (scope, iElement, iAttrs, menuCtrl) {
          menuCtrl.addMenuItem(scope.sideName, {
            'url': scope.url,
            'type': scope.type,
            'label': scope.label
          });
        }
      };
    }]).
    directive('menuLogo', [function () {
      return {
        require: '^menu',
        restrict: 'E',
        scope: {
          'url': '@url',
          'image': '@image',
          'sideName': '@side'
        },
        link: function (scope, iElement, iAttrs, menuCtrl) {
          menuCtrl.setMenuLogo(scope.sideName, {
            'url': scope.url,
            'image': scope.image
          });
        }
      };
    }]);
}());
