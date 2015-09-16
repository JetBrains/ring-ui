/* global angular: false */

require('../error-page/error-page.scss');
require('../error-message-ng/error-message-ng');
require('../permissions-ng/permissions-ng');
require('../message-bundle-ng/message-bundle-ng');

/**
 * @name Error Page Ng
 * @description Directive for showing error pages (e.g. 404 Not Found)
 * @example
 * <example name="Error Page Ng">
   <file name="index.html">
    <div ng-app="Ring.error-page">
        <div class="app" rg-error-page-background>
            <div rg-error-page="{error: {status: 403}}"></div>
        </div>
    </div>
   </file>
   <file name="index.js" webpack="true">
      require('angular/angular.min.js');
      require('angular-route/angular-route.min.js');
      require('error-page-ng/error-page-ng');

      angular.module('Ring.auth', [])
        .provider('auth', function() {
          this.$get = function($q) {
            var defer = $q.defer();
            defer.resolve([]);

            return {
              auth: {
                requestToken: function() {
                  return defer.promise;
                },
                getSecure: function() {
                  return defer.promise;
                }
              },
              promise: defer.promise
            };
          };
        });
   </file>
 </example>
 */

angular.module('Ring.error-page', [
  'ngRoute',
  'Ring.error-message',
  'Ring.permissions',
  'Ring.message-bundle'
])

  .provider('errorPageConfiguration', function () {
    var pageConfiguration = {};
    /**
     * @param {Object} config
     * @param {?String} config.responseToMessageConverter - name of converter from response to error message factory
     * @param {?Array.<String>} config.links - name of factory which should return array of links to show on error page
     */
    this.config = function (config) {
      pageConfiguration = config;
    };
    /*@ngInject*/
    this.$get = function ($injector, $log) {
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
    };
  })

  .factory('getErrorPagePresentation', function(RingMessageBundle) {
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
  })

  .directive('rgErrorPageBackground', [
    function() {
      return {
        restrict: 'A',
        controller: function($scope) {
          this.setApplicationError = function (applicationError) {
            $scope.applicationError = applicationError;
          };
        },
        link: function (scope, iElement) {
          let element = iElement[0];
          element.classList.add('error-page');

          scope.$watch('applicationError', function(newValue) {
            if (newValue) {
              element.classList.add('error-page_enabled');
            } else {
              element.classList.remove('error-page_enabled');
            }
          });
        }
      };
    }
  ])

  .directive('rgErrorPage', [
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
        require: '?^rgErrorPageBackground',
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
            var errorSource = scope.$eval(iAttrs.rgErrorPage);
            if (errorSource && errorSource.error) {
              handleError(errorSource.error);
              $log.debug('Navigation: errorSource ' + iAttrs.rgErrorPage + ' not permitted, status: ' + status);
            } else {
              getArgumentPromise(errorSource, iAttrs.rgErrorPage)
                .then(handleSuccess, handleError);
            }
          }, handleError);
        }
      };
    }
  ]);
