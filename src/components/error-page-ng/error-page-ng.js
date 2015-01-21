/* global angular: false */

require('../error-page/error-page.scss');
require('../error-message-ng/error-message-ng');
require('../permissions-ng/permissions-ng');
require('../message-bundle-ng/message-bundle-ng');


angular.module('Ring.error-page', [
  'Ring.error-message',
  'Ring.permissions',
  'Ring.message-bundle'
])

  .provider('errorPageConfiguration', [function () {
    var pageConfiguration = {};
    /**
     * @param {{
     *   responseToMessageConverter: string? factory name,
     *   links: string? factory name,
     * }} config
     */
    this.config = function (config) {
      pageConfiguration = config;
    };
    this.$get = ['$injector', '$log', function ($injector, $log) {
      var loadFactory = function(factoryName) {
        try {
          return $injector.get(factoryName);
        } catch (err) {
          $log.debug('errorPageConfiguration: unable to load ' + factoryName);
        }
      };
      var responseToMessageConverter;
      if (pageConfiguration.responseToMessageConverter) {
        responseToMessageConverter = loadFactory(pageConfiguration.responseToMessageConverter);
      }
      var links;
      if (pageConfiguration.links) {
        links = loadFactory(pageConfiguration.links);
      }
      return {
        responseToMessageConverter: responseToMessageConverter || angular.noop,
        links: links || []
      };
    }];
  }])

  .factory('ErrorPageMessages', ['RingMessageBundle', function(RingMessageBundle) {
    return {
      seriouslyWrong: RingMessageBundle.errorpage_seriouslywrong(),
      offline: RingMessageBundle.errorpage_offline(),
      disconnected: RingMessageBundle.errorpage_disconnected(),
      disconnectedMsg: RingMessageBundle.errorpage_disconnectedmsg(),
      error403: RingMessageBundle.errorpage_403(),
      error403Msg: RingMessageBundle.errorpage_403msg(),
      error404: RingMessageBundle.errorpage_404(),
      error404Msg: RingMessageBundle.errorpage_404msg(),
      error500: RingMessageBundle.errorpage_500(),
      error500Msg: RingMessageBundle.errorpage_500msg()
    };
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
    'ErrorPageMessages',
    function (errorPageConfiguration, $route, userPermissions, $rootScope, $log, ErrorPageMessages) {

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
          var destroyEvent = (scope === scope.$root) ? '$routeChangeStart' : '$destroy';
          scope.$on(destroyEvent, function () {
            errorPageBackgroundCtrl.setApplicationError(false);
          });

          scope.links = errorPageConfiguration.links;
          scope.wording = ErrorPageMessages;
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
