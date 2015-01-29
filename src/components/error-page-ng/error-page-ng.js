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
        controller: ['$scope', function($scope) {
          this.setApplicationError = function (applicationError) {
            $scope.applicationError = applicationError;
          };
        }],
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
        require: '?^errorPageBackground',
        link: function (scope, iElement, iAttrs, errorPageBackgroundCtrl) {
          scope.errorSource = scope.$eval(iAttrs.errorPage);

          var handleError = function (status, message) {
            scope.error = {
              status: status,
              message: message
            };
            if (errorPageBackgroundCtrl) {
              errorPageBackgroundCtrl.setApplicationError(true);
            }
            scope.resolved = true;
          };

          if (scope.errorSource) {
            var promise = scope.errorSource.$promise || scope.errorSource.promise;
            if (promise) {
              promise['catch'](function(errorResponse) {
                var status = errorResponse.status;
                handleError(status, errorPageConfiguration.responseToMessageConverter(errorResponse));
                $log.debug('Navigation: errorSource ' + iAttrs.errorPage + ' not permitted, status: ' + status);
                return errorResponse;
              });
              promise.then(function(data) {
                scope.resolved = true;
                return data;
              });
            } else if (scope.errorSource.error) {
              var status = scope.errorSource.error.status;
              handleError(status);
              $log.debug('Navigation: errorSource ' + iAttrs.errorPage + ' not permitted, status: ' + status);
            } else {
              scope.resolved = true;
            }
          } else if ($route.current && $route.current.$$route && $route.current.$$route.permission) {
            var pagePermission = $route.current.$$route.permission;
            userPermissions.load().then(function (permissionCache) {
              if (!permissionCache.has(pagePermission)) {
                handleError(403);
                $log.debug('Navigation: no page' + pagePermission + ' permission, status 403');
              } else {
                scope.resolved = true;
              }
            });
          } else {
            // success if no special restrictions on page load
            scope.resolved = true;
          }

          if (errorPageBackgroundCtrl) {
            var destroyEvent = (scope === scope.$root) ? '$routeChangeStart' : '$destroy';
            scope.$on(destroyEvent, function () {
              errorPageBackgroundCtrl.setApplicationError(false);
            });
          }

          scope.links = errorPageConfiguration.links;
          scope.wording = ErrorPageMessages;
        }
      };
    }
  ]);
