window.source = {
  "title": "Compiler Ng",
  "url": "compiler-ng.html",
  "type": "js",
  "content": "/**\n * @name Compiler Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @example\n   <example name=\"Compiler Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"test\" ng-strict-di>\n        <div id=\"for-compiled\"></div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import CompilerNg from '@jetbrains/ring-ui/components/compiler-ng/compiler-ng';\n\n      angular.module('test', [CompilerNg]).\n        run(function controller($rootScope, rgCompiler) {\n          const $scope = $rootScope.$new();\n          $scope.testValue = 'Hello from compiled node';\n\n          rgCompiler({template: '<div>{{testValue}}</div>'}).\n            then(data => {\n              data.link($scope);\n\n              document.getElementById('for-compiled').appendChild(data.element[0]);\n            });\n        });\n    </file>\n   </example>\n */\nimport angular from 'angular';\n\nconst angularModule = angular.module('Ring.compiler', []).\n  factory('rgCompiler', function rgCompilerFactory($q, $controller, $injector, $compile) {\n    return options => {\n      const template = options.template;\n      const controller = options.controller;\n      const controllerAs = options.controllerAs;\n      const resolve = angular.extend({}, options.resolve);\n      const bindToController = options.bindToController;\n\n      angular.forEach(resolve, (value, key) => {\n        if (angular.isString(value)) {\n          resolve[key] = $injector.get(value);\n        } else {\n          // Use comma expression to disable babel-plugin-angular-annotate\n          // Otherwise is fails with \"Maximum call stack size exceeded\" error\n          resolve[key] = $injector.invoke((0, value));\n        }\n      });\n\n      angular.extend(resolve, options.locals);\n\n      return $q.all(resolve).then(locals => {\n        const element = options.element || angular.element('<div>').\n          html(template.trim()).\n          contents();\n        const linkFn = $compile(element, locals.$transclude);\n        locals.$element = element;\n\n        return {\n          locals,\n          element,\n          link: function link(scope) {\n            locals.$scope = scope;\n\n            if (controller) {\n              const invokeCtrl = $controller(controller, locals, true);\n\n              if (bindToController) {\n                angular.extend(invokeCtrl.instance, locals);\n              }\n\n              const ctrl = invokeCtrl();\n\n              element.data('$ngControllerController', ctrl);\n\n              if (controllerAs) {\n                scope[controllerAs] = ctrl;\n              }\n            }\n\n            return linkFn(scope);\n          }\n        };\n      });\n    };\n  });\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Compiler Ng",
      "url": "examples/compiler-ng/compiler-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di>\n  <div id=\"for-compiled\"></div>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport CompilerNg from '@jetbrains/ring-ui/components/compiler-ng/compiler-ng';\n\nangular.module('test', [CompilerNg]).\n  run(function controller($rootScope, rgCompiler) {\n    const $scope = $rootScope.$new();\n    $scope.testValue = 'Hello from compiled node';\n\n    rgCompiler({template: '<div>{{testValue}}</div>'}).\n      then(data => {\n        data.link($scope);\n\n        document.getElementById('for-compiled').appendChild(data.element[0]);\n      });\n  });\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "attrs": {
    "name": "Compiler Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "example": "   <example name=\"Compiler Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"test\" ng-strict-di>\n        <div id=\"for-compiled\"></div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import CompilerNg from '@jetbrains/ring-ui/components/compiler-ng/compiler-ng';\n\n      angular.module('test', [CompilerNg]).\n        run(function controller($rootScope, rgCompiler) {\n          const $scope = $rootScope.$new();\n          $scope.testValue = 'Hello from compiled node';\n\n          rgCompiler({template: '<div>{{testValue}}</div>'}).\n            then(data => {\n              data.link($scope);\n\n              document.getElementById('for-compiled').appendChild(data.element[0]);\n            });\n        });\n    </file>\n   </example>"
  }
};