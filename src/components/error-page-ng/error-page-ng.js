/* global angular: false */

require('../error-page/error-page.scss');
require('../error-message-ng/error-message-ng');
require('../permissions-ng/permissions-ng');
require('../message-bundle-ng/message-bundle-ng');


angular.module('Ring.error-page', [
  'ngRoute',
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
    '$q',
    '$compile',
    function (errorPageConfiguration, $route, userPermissions, $rootScope, $log, ErrorPageMessages, $q, $compile) {

      function getArgumentPromise(errorSource, errorPageParameterPresentation) {
        var df = $q.defer();
        var promise = errorSource && (errorSource.$promise || errorSource.promise);
        if (promise) {
          promise['catch'](function(errorResponse) {
            $log.debug('Navigation: errorSource ' + errorPageParameterPresentation + ' not permitted, status: ' + status);
            df.reject({
              status: errorResponse && errorResponse.status,
              message: errorPageConfiguration.responseToMessageConverter(errorResponse)
            });
            return errorResponse;
          });
          promise.then(function(data) {
            df.resolve();
            return data;
          });
        } else {
          df.resolve();
        }
        return df.promise;
      }

      function getRoutingPermissionPromise() {
        var df = $q.defer();
        if ($route.current && $route.current.$$route && $route.current.$$route.permission) {
          var pagePermission = $route.current.$$route.permission;
          userPermissions.load().then(function (permissionCache) {
            if (!permissionCache.has(pagePermission)) {
              $log.debug('Navigation: no page' + pagePermission + ' permission, status 403');
              df.reject({status: 403});
            } else {
              df.resolve();
            }
          });
        } else {
          df.resolve();
        }
        return df.promise;
      }


      return {
        replace: true,
        transclude: true,
        template: '<div></div>',
        require: '?^errorPageBackground',
        link: function (scope, iElement, iAttrs, errorPageBackgroundCtrl, transclude) {

          function handleError(error) {
            transclude(scope, function() {

              scope.error = error;
              scope.links = errorPageConfiguration.links;
              scope.wording = ErrorPageMessages;

              var template = require('./error-page-ng.html');
              var el = $compile(angular.element(template))(scope);
              iElement.append(el);
              if (errorPageBackgroundCtrl) {
                errorPageBackgroundCtrl.setApplicationError(true);
              }

              if (errorPageBackgroundCtrl) {
                var destroyEvent = (scope === scope.$root) ? '$routeChangeStart' : '$destroy';
                scope.$on(destroyEvent, function () {
                  errorPageBackgroundCtrl.setApplicationError(false);
                });
              }
            });
          }

          function handleSuccess() {
            transclude(scope, function(clone) {
              iElement.append(clone);
            });
          }

          var errorSource = scope.$eval(iAttrs.errorPage);
          if (errorSource && errorSource.error) {
            handleError(errorSource.error);
            $log.debug('Navigation: errorSource ' + iAttrs.errorPage + ' not permitted, status: ' + status);
          } else {
            var promise = $q.all([
              getRoutingPermissionPromise(),
              getArgumentPromise(errorSource, iAttrs.errorPage)
            ]);
            promise.then(handleSuccess, handleError);
          }

        }
      };
    }
  ]);
