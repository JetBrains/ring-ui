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

  .factory('getErrorPagePresentation', ['RingMessageBundle', function(RingMessageBundle) {
    var presentationModels = {
      '404': {
        status: 404,
        title: RingMessageBundle.errorpage_404(),
        description: RingMessageBundle.errorpage_404msg(),
        icon: 'frown'
      },
      '403': {
        status: 403,
        title: RingMessageBundle.errorpage_403(),
        description: RingMessageBundle.errorpage_403msg(),
        icon: 'permission'
      },
      '500': {
        status: 500,
        title: RingMessageBundle.errorpage_500(),
        description: RingMessageBundle.errorpage_500msg(),
        icon: 'frown'
      },
      '0': {
        status: RingMessageBundle.errorpage_disconnected(),
        title: RingMessageBundle.errorpage_disconnectedmsg(),
        description: RingMessageBundle.errorpage_offline(),
        icon: 'frown'
      },
      'default': {
        title: RingMessageBundle.errorpage_seriouslywrong(),
        icon: 'frown'
      }
    };

    return function(error) {
      if (error.status in presentationModels) {
        return presentationModels[error.status];
      }
      return angular.extend({
        status: error.status,
        description: error.message
      }, presentationModels['default']);
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
    'getErrorPagePresentation',
    '$q',
    '$compile',
    function (errorPageConfiguration, $route, userPermissions, $rootScope, $log, getErrorPagePresentation, $q, $compile) {

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
              scope.error = getErrorPagePresentation(error);
              scope.links = errorPageConfiguration.links;

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

          getRoutingPermissionPromise().then(function() {
            var errorSource = scope.$eval(iAttrs.errorPage);
            if (errorSource && errorSource.error) {
              handleError(errorSource.error);
              $log.debug('Navigation: errorSource ' + iAttrs.errorPage + ' not permitted, status: ' + status);
            } else {
              getArgumentPromise(errorSource, iAttrs.errorPage)
                .then(handleSuccess, handleError);
            }
          }, handleError);
        }
      };
    }
  ]);
