require('../sidebar/sidebar.scss');
var Storage = require('storage/storage');
var storage = new Storage();

/**
 * A sidebar directive.
 */

/*global angular*/
angular.module('Ring.sidebar', [])
  .directive('rgSidebar', ['sidebarStorage', function (sidebarStorage) {
    return {
      restrict: 'E',
      template: '<div class="sidebar" ng-transclude></div>',
      controller: ['$scope', function ($scope) {
        var ctrl = this;

        ctrl.defaultSidebar = {
          active: true
        };

        sidebarStorage.load().done(function (sidebar) {
          ctrl.sidebar = sidebar || ctrl.defaultSidebar;
        });

      }]
    };
  }])
  .factory('sidebarStorage', function () {
    var SIDEBAR_STORAGE_KEY = 'sidebar';

    return {
      load: function () {
        return storage.get(SIDEBAR_STORAGE_KEY);
      },
      save: function (sidebar) {
        return storage.set(SIDEBAR_STORAGE_KEY, sidebar);
      }
    };
  });
