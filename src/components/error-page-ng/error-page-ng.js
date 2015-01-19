/* global angular: false */

require('../error-page/error-page.scss');
require('../error-message-ng/error-message-ng');
require('../permissions-ng/permissions-ng');


angular.module('Ring.error-page', ['Ring.error-message', 'Ring.permissions'])

  .provider('errorPageConfiguration', [function () {
    var pageConfiguration = {};
    /**
     * @param {{
     *   responseToMessageConverter: funciton?,
     *   links: array?,
     * }} config
     */
    this.config = function (config) {
      pageConfiguration = config;
    };
    this.$get = [function () {
      /**
       * set empty responseToMessageConverter, if not defined
       */
      if (!pageConfiguration.responseToMessageConverter) {
        pageConfiguration.responseToMessageConverter = function (errorResponse) {
          return errorResponse;
        };
      }

      return pageConfiguration;
    }];
  }])

  .directive('errorPageBackground', [
    function() {
      return {
        restrict: 'A',
        controller: function($scope) {
          this.setApplicationError = function (applicationError) {
            $scope.applicationError = applicationError;
          };
        },
        link: function (scope, iElement) {
          scope.$watch('applicationError', function(newValue, oldValue) {
            if (newValue === oldValue) {
              return;
            }
            if (newValue) {
              iElement.addClass('error-page');
            } else {
              iElement.removeClass('error-page');
            }
          });
        }
      };
    }
  ])

  .directive('errorPage', [
    'errorPageConfiguration',
    '$route',
    'userPermissions',
    '$rootScope',
    '$log',
    function (errorPageConfiguration, $route, userPermissions, $rootScope, $log) {

      return {
        replace: true,
        transclude: true,
        template: require('./error-page-ng.html'),
        require: '^errorPageBackground',
        link: function (scope, iElement, iAttrs, errorPageBackgroundCtrl) {
          var pagePermission = $route.current.$$route.permission;
          scope.item = scope.$eval(iAttrs.errorPage);

          if (scope.item && scope.item.$promise) {
            scope.item.$promise['catch'](function (errorResponse) {
              scope.error = {
                status: errorResponse.status,
                message: errorPageConfiguration.responseToMessageConverter(errorResponse)
              };

              $log.debug('Navigation: item ' + iAttrs.errorPage + ' not permitted, status: ' + errorResponse.status);
              errorPageBackgroundCtrl.setApplicationError(true);
            });
          } else if (pagePermission) {
            scope.item = {};

            userPermissions.load().then(function (permissionCache) {
              scope.item.$resolved = true;

              if (!permissionCache.has(pagePermission)) {
                scope.error = {
                  status: 403
                };

                $log.debug('Navigation: no page' + pagePermission + ' permission, status 403');
                errorPageBackgroundCtrl.setApplicationError(true);
              }
            });
          } else {
            // success if no special restrictions on page load
            scope.item = {
              $resolved: true
            };
          }
          scope.links = errorPageConfiguration.links;
          var destroyEvent = (scope === scope.$root) ? '$routeChangeStart' : '$destroy';
          scope.$on(destroyEvent, function () {
            errorPageBackgroundCtrl.setApplicationError(false);
          });
        }
      };
    }
  ]);

/**
 * Add templates to module 'Ring.error-page' after its declaration
 */
require('!ngtemplate?module=Ring.error-page&relativeTo=/error-page-ng/!html!./error-page-ng__forbidden.html');
require('!ngtemplate?module=Ring.error-page&relativeTo=/error-page-ng/!html!./error-page-ng__not-found.html');
require('!ngtemplate?module=Ring.error-page&relativeTo=/error-page-ng/!html!./error-page-ng__server-error.html');
