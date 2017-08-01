/**
 * @name Compiler Ng
 * @category Angular Components
 * @example
   <example name="Compiler Ng">
    <file name="index.html">
      <div ng-app="test" ng-strict-di>
        <div id="for-compiled"></div>
      </div>
    </file>
    <file name="index.js">
      import angular from 'angular';
      import CompilerNg from '@jetbrains/ring-ui/components/compiler-ng/compiler-ng';

      angular.module('test', [CompilerNg]).
        run(function controller($rootScope, rgCompiler) {
          const $scope = $rootScope.$new();
          $scope.testValue = 'Hello from compiled node';

          rgCompiler({template: '<div>{{testValue}}</div>'}).
            then(data => {
              data.link($scope);

              document.getElementById('for-compiled').appendChild(data.element[0]);
            });
        });
    </file>
   </example>
 */
/* global angular: false */

const angularModule = angular.module('Ring.compiler', []).
  factory('rgCompiler', function rgCompilerFactory($q, $controller, $injector, $compile) {
    return options => {
      const template = options.template;
      const controller = options.controller;
      const controllerAs = options.controllerAs;
      const resolve = angular.extend({}, options.resolve);
      const bindToController = options.bindToController;

      angular.forEach(resolve, (value, key) => {
        if (angular.isString(value)) {
          resolve[key] = $injector.get(value);
        } else {
          // Use comma expression to disable babel-plugin-angular-annotate
          // Otherwise is fails with "Maximum call stack size exceeded" error
          resolve[key] = $injector.invoke((0, value));
        }
      });

      angular.extend(resolve, options.locals);

      return $q.all(resolve).then(locals => {
        const element = options.element || angular.element('<div>').
          html(template.trim()).
          contents();
        const linkFn = $compile(element);

        return {
          locals,
          element,
          link: function link(scope) {
            locals.$scope = scope;

            if (controller) {
              const invokeCtrl = $controller(controller, locals, true);

              if (bindToController) {
                angular.extend(invokeCtrl.instance, locals);
              }

              const ctrl = invokeCtrl();

              element.data('$ngControllerController', ctrl);

              if (controllerAs) {
                scope[controllerAs] = ctrl;
              }
            }

            return linkFn(scope);
          }
        };
      });
    };
  });

export default angularModule.name;
