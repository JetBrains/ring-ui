import angular from 'angular';
import 'dom4';

import {FrownIcon, PermissionIcon} from '../icon';

import '../error-page/error-page.scss';
import ErrorMessage from '../error-message-ng/error-message-ng';
import Permissions from '../permissions-ng/permissions-ng';
import MessageBundle from '../message-bundle-ng/message-bundle-ng';

/**
 * @name Error Page Ng
 */

const angularModule = angular.module('Ring.error-page', [
  'ngRoute',
  ErrorMessage,
  Permissions,
  MessageBundle
]);

angularModule.provider('errorPageConfiguration', function errorPageConfigurationProvider() {
  let pageConfiguration = {};

  /**
   * @param {Object} config
   * @param {?String} config.responseToMessageConverter - name of converter from response to error message factory
   * @param {?Array.<String>} config.links - name of factory which should return array of links to show on error page
   */
  this.config = config => {
    pageConfiguration = config;
  };

  this.$get = function get($injector, $log) {
    function loadFactory(factoryName) {
      try {
        return $injector.get(factoryName);
      } catch (err) {
        $log.debug(`errorPageConfiguration: unable to load ${factoryName}`);
        return undefined;
      }
    }

    let responseToMessageConverter;
    if (pageConfiguration.responseToMessageConverter) {
      responseToMessageConverter = loadFactory(pageConfiguration.responseToMessageConverter);
    }

    let links;
    if (pageConfiguration.links) {
      links = loadFactory(pageConfiguration.links);
    }

    return {
      responseToMessageConverter: responseToMessageConverter || angular.noop,
      links: links || []
    };
  };
});

angularModule.factory('getErrorPagePresentation', RingMessageBundle => error => {
  const presentationModels = {
    401: {
      status: 401,
      title: RingMessageBundle.errorpage_401(),
      description: RingMessageBundle.errorpage_401msg(),
      icon: PermissionIcon
    },
    404: {
      status: 404,
      title: RingMessageBundle.errorpage_404(),
      description: RingMessageBundle.errorpage_404msg(),
      icon: FrownIcon
    },
    403: {
      status: 403,
      title: RingMessageBundle.errorpage_403(),
      description: RingMessageBundle.errorpage_403msg(),
      icon: PermissionIcon
    },
    500: {
      status: 500,
      title: RingMessageBundle.errorpage_500(),
      description: RingMessageBundle.errorpage_500msg(),
      icon: FrownIcon
    },
    0: {
      status: RingMessageBundle.errorpage_disconnected(),
      title: RingMessageBundle.errorpage_disconnectedmsg(),
      description: RingMessageBundle.errorpage_offline(),
      icon: FrownIcon
    },
    default: {
      title: RingMessageBundle.errorpage_seriouslywrong(),
      icon: FrownIcon
    }
  };

  if (error.status in presentationModels) {
    return presentationModels[error.status];
  }
  return angular.extend({
    status: error.status,
    description: error.message
  }, presentationModels.default);
});

angularModule.directive('rgErrorPageBackground', function rgErrorPageBackgroundDirective() {
  return {
    restrict: 'A',

    controller: function controller($scope) {
      this.setApplicationError = applicationError => {
        $scope.applicationError = applicationError;
      };
    },

    link: function link(scope, iElement) {
      const element = iElement[0];
      element.classList.add('error-page');

      scope.$watch('applicationError', newValue => {
        if (newValue) {
          element.classList.add('error-page_enabled');
        } else {
          element.classList.remove('error-page_enabled');
        }
      });
    }
  };
});

angularModule.directive('rgErrorPage', [
  'errorPageConfiguration',
  '$route',
  'userPermissions',
  '$log',
  'getErrorPagePresentation',
  '$q',
  '$compile',
  (
    errorPageConfiguration,
    $route,
    userPermissions,
    $log,
    getErrorPagePresentation,
    $q,
    $compile
  ) => {
    function getArgumentPromise(errorSource, errorPageParameterPresentation) {
      const promise = errorSource && (errorSource.$promise || errorSource.promise);

      if (promise) {
        return $q((resolve, reject) => {
          promise.
            then(data => {
              resolve();
              return data;
            }).
            catch(errorResponse => {
              $log.debug(`Navigation: errorSource ${errorPageParameterPresentation} not permitted, status: ${status}`);

              reject({
                status: errorResponse && errorResponse.status,
                message: errorPageConfiguration.responseToMessageConverter(errorResponse)
              });

              return errorResponse;
            });
        });
      } else {
        return $q.resolve();
      }
    }

    function getRoutingPermissionPromise() {
      /* eslint-disable angular/no-private-call */
      if ($route.current && $route.current.$$route && $route.current.$$route.permission) {
        const pagePermission = $route.current.$$route.permission;
        /* eslint-enable angular/no-private-call */

        let resolve;
        let reject;

        userPermissions.load().then(permissionCache => {
          if (!permissionCache.has(pagePermission)) {
            $log.debug(`Navigation: no page${pagePermission} permission, status 403`);
            reject({status: 403});
          } else {
            resolve();
          }
        });

        return $q((...args) => {
          [resolve, reject] = args;
        });
      } else {
        return $q.resolve();
      }
    }

    return {
      replace: true,
      transclude: true,
      template: '<div></div>',
      require: '?^rgErrorPageBackground',
      link: function link(scope, iElement, iAttrs, errorPageBackgroundCtrl, transclude) {
        function handleError(error) {
          transclude(scope, clone => {
            const cloneWrapper = document.createElement('div');
            cloneWrapper.className = 'ng-hide';
            angular.element(cloneWrapper).append(clone);
            iElement.append(cloneWrapper);

            scope.error = getErrorPagePresentation(error);
            scope.links = errorPageConfiguration.links;

            const template = require('./error-page-ng.html');
            const el = $compile(angular.element(template))(scope);
            iElement.append(el);
            if (errorPageBackgroundCtrl) {
              errorPageBackgroundCtrl.setApplicationError(true);
            }

            if (errorPageBackgroundCtrl) {
              const destroyEvent = (scope === scope.$root) ? '$routeChangeStart' : '$destroy';
              scope.$on(destroyEvent, () => {
                errorPageBackgroundCtrl.setApplicationError(false);
              });
            }
          });
        }

        function handleSuccess() {
          transclude(scope, clone => {
            iElement.append(clone);
          });
        }

        getRoutingPermissionPromise().then(() => {
          const errorSource = scope.$eval(iAttrs.rgErrorPage);
          if (errorSource && errorSource.error) {
            handleError(errorSource.error);
            $log.debug(`Navigation: errorSource ${iAttrs.rgErrorPage} not permitted, status: ${status}`);
          } else {
            getArgumentPromise(errorSource, iAttrs.rgErrorPage).
              then(handleSuccess).
              catch(handleError);
          }
        }, handleError);
      }
    };
  }
]);

export default angularModule.name;
