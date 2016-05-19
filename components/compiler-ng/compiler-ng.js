/* global angular: false */

const module = angular.module('Ring.compiler', [])
  .factory('rgCompiler', function ($q, $controller, $injector, $compile) {

    // The rgCompiler service is an abstraction of angular's compiler,
    // that allows the developer
    // to easily compile an element with a template, controller, and locals.
    return function (options) {
      const template = options.template;
      const controller = options.controller;
      const controllerAs = options.controllerAs;
      const resolve = angular.extend({}, options.resolve);
      const bindToController = options.bindToController;


      angular.forEach(resolve, function (value, key) {
        if (angular.isString(value)) {
          resolve[key] = $injector.get(value);
        } else {
          resolve[key] = $injector.invoke(value);
        }
      });


      angular.extend(resolve, options.locals);

      return $q.all(resolve).then(function (locals) {
        const element = options.element || angular.element('<div>').html(template.trim()).contents();
        const linkFn = $compile(element);

        return {
          locals: locals,
          element: element,
          link: function (scope) {
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


export default module.name;
