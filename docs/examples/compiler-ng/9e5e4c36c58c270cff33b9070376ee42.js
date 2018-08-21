/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1028);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1028:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(53);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__jetbrains_ring_ui_components_compiler_ng_compiler_ng__ = __webpack_require__(565);\n\n\n\n\n\n__WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('test', [__WEBPACK_IMPORTED_MODULE_1__jetbrains_ring_ui_components_compiler_ng_compiler_ng__[\"a\" /* default */]]).run(['$rootScope', 'rgCompiler', function controller($rootScope, rgCompiler) {\n  var $scope = $rootScope.$new();\n  $scope.testValue = 'Hello from compiled node';\n\n  rgCompiler({ template: '<div>{{testValue}}</div>' }).then(function (data) {\n    data.link($scope);\n\n    document.getElementById('for-compiled').appendChild(data.element[0]);\n  });\n}]);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTAyOC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2NvbXBvbmVudHMvY29tcGlsZXItbmcvY29tcGlsZXItbmcuanM/MjgyYiJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBhbmd1bGFyIGZyb20gJ2FuZ3VsYXInO1xuaW1wb3J0IENvbXBpbGVyTmcgZnJvbSAnQGpldGJyYWlucy9yaW5nLXVpL2NvbXBvbmVudHMvY29tcGlsZXItbmcvY29tcGlsZXItbmcnO1xuXG5hbmd1bGFyLm1vZHVsZSgndGVzdCcsIFtDb21waWxlck5nXSkucnVuKFsnJHJvb3RTY29wZScsICdyZ0NvbXBpbGVyJywgZnVuY3Rpb24gY29udHJvbGxlcigkcm9vdFNjb3BlLCByZ0NvbXBpbGVyKSB7XG4gIHZhciAkc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgJHNjb3BlLnRlc3RWYWx1ZSA9ICdIZWxsbyBmcm9tIGNvbXBpbGVkIG5vZGUnO1xuXG4gIHJnQ29tcGlsZXIoeyB0ZW1wbGF0ZTogJzxkaXY+e3t0ZXN0VmFsdWV9fTwvZGl2PicgfSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIGRhdGEubGluaygkc2NvcGUpO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvci1jb21waWxlZCcpLmFwcGVuZENoaWxkKGRhdGEuZWxlbWVudFswXSk7XG4gIH0pO1xufV0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9iYWJlbC1sb2FkZXIvbGliP2NhY2hlRGlyZWN0b3J5IS4vfi9kb2NwYWNrLWV4YW1wbGVzLWNvbXBpbGVyL2xpYi9sb2FkZXIuanM/e1wicGF0aFwiOlwiMTMwLmNvbnRlbnRcIixcImhhc2hcIjpcIjllNWU0YzM2YzU4YzI3MGNmZjMzYjkwNzAzNzZlZTQyXCJ9IS4vY29tcG9uZW50cy9jb21waWxlci1uZy9jb21waWxlci1uZy5qc1xuLy8gbW9kdWxlIGlkID0gMTAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDIyOSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///1028\n");

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = vendor_lib;

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(402);

/***/ }),

/***/ 565:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(53);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);\n\n\n/**\n * @name Compiler Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @example\n   <example name=\"Compiler Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"test\" ng-strict-di>\n        <div id=\"for-compiled\"></div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import CompilerNg from '@jetbrains/ring-ui/components/compiler-ng/compiler-ng';\n\n      angular.module('test', [CompilerNg]).\n        run(function controller($rootScope, rgCompiler) {\n          const $scope = $rootScope.$new();\n          $scope.testValue = 'Hello from compiled node';\n\n          rgCompiler({template: '<div>{{testValue}}</div>'}).\n            then(data => {\n              data.link($scope);\n\n              document.getElementById('for-compiled').appendChild(data.element[0]);\n            });\n        });\n    </file>\n   </example>\n */\n\n\nvar angularModule = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('Ring.compiler', []).factory('rgCompiler', ['$q', '$controller', '$injector', '$compile', function rgCompilerFactory($q, $controller, $injector, $compile) {\n  return function (options) {\n    var template = options.template;\n    var controller = options.controller;\n    var controllerAs = options.controllerAs;\n    var resolve = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.extend({}, options.resolve);\n    var bindToController = options.bindToController;\n\n    __WEBPACK_IMPORTED_MODULE_0_angular___default.a.forEach(resolve, function (value, key) {\n      if (__WEBPACK_IMPORTED_MODULE_0_angular___default.a.isString(value)) {\n        resolve[key] = $injector.get(value);\n      } else {\n        // Use comma expression to disable babel-plugin-angular-annotate\n        // Otherwise is fails with \"Maximum call stack size exceeded\" error\n        resolve[key] = $injector.invoke((0, value));\n      }\n    });\n\n    __WEBPACK_IMPORTED_MODULE_0_angular___default.a.extend(resolve, options.locals);\n\n    return $q.all(resolve).then(function (locals) {\n      var element = options.element || __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element('<div>').html(template.trim()).contents();\n      var linkFn = $compile(element, locals.$transclude);\n      locals.$element = element;\n\n      return {\n        locals: locals,\n        element: element,\n        link: function link(scope) {\n          locals.$scope = scope;\n\n          if (controller) {\n            var invokeCtrl = $controller(controller, locals, true);\n\n            if (bindToController) {\n              __WEBPACK_IMPORTED_MODULE_0_angular___default.a.extend(invokeCtrl.instance, locals);\n            }\n\n            var ctrl = invokeCtrl();\n\n            element.data('$ngControllerController', ctrl);\n\n            if (controllerAs) {\n              scope[controllerAs] = ctrl;\n            }\n          }\n\n          return linkFn(scope);\n        }\n      };\n    });\n  };\n}]);\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (angularModule.name);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNTY1LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9jb21waWxlci1uZy9jb21waWxlci1uZy5qcz9lZTA1Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmFtZSBDb21waWxlciBOZ1xuICogQGNhdGVnb3J5IExlZ2FjeSBBbmd1bGFyXG4gKiBAdGFncyBSaW5nIFVJIExhbmd1YWdlXG4gKiBAZXhhbXBsZVxuICAgPGV4YW1wbGUgbmFtZT1cIkNvbXBpbGVyIE5nXCI+XG4gICAgPGZpbGUgbmFtZT1cImluZGV4Lmh0bWxcIj5cbiAgICAgIDxkaXYgbmctYXBwPVwidGVzdFwiIG5nLXN0cmljdC1kaT5cbiAgICAgICAgPGRpdiBpZD1cImZvci1jb21waWxlZFwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9maWxlPlxuICAgIDxmaWxlIG5hbWU9XCJpbmRleC5qc1wiPlxuICAgICAgaW1wb3J0IGFuZ3VsYXIgZnJvbSAnYW5ndWxhcic7XG4gICAgICBpbXBvcnQgQ29tcGlsZXJOZyBmcm9tICdAamV0YnJhaW5zL3JpbmctdWkvY29tcG9uZW50cy9jb21waWxlci1uZy9jb21waWxlci1uZyc7XG5cbiAgICAgIGFuZ3VsYXIubW9kdWxlKCd0ZXN0JywgW0NvbXBpbGVyTmddKS5cbiAgICAgICAgcnVuKGZ1bmN0aW9uIGNvbnRyb2xsZXIoJHJvb3RTY29wZSwgcmdDb21waWxlcikge1xuICAgICAgICAgIGNvbnN0ICRzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xuICAgICAgICAgICRzY29wZS50ZXN0VmFsdWUgPSAnSGVsbG8gZnJvbSBjb21waWxlZCBub2RlJztcblxuICAgICAgICAgIHJnQ29tcGlsZXIoe3RlbXBsYXRlOiAnPGRpdj57e3Rlc3RWYWx1ZX19PC9kaXY+J30pLlxuICAgICAgICAgICAgdGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgZGF0YS5saW5rKCRzY29wZSk7XG5cbiAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvci1jb21waWxlZCcpLmFwcGVuZENoaWxkKGRhdGEuZWxlbWVudFswXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgPC9maWxlPlxuICAgPC9leGFtcGxlPlxuICovXG5pbXBvcnQgYW5ndWxhciBmcm9tICdhbmd1bGFyJztcblxudmFyIGFuZ3VsYXJNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnUmluZy5jb21waWxlcicsIFtdKS5mYWN0b3J5KCdyZ0NvbXBpbGVyJywgWyckcScsICckY29udHJvbGxlcicsICckaW5qZWN0b3InLCAnJGNvbXBpbGUnLCBmdW5jdGlvbiByZ0NvbXBpbGVyRmFjdG9yeSgkcSwgJGNvbnRyb2xsZXIsICRpbmplY3RvciwgJGNvbXBpbGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZTtcbiAgICB2YXIgY29udHJvbGxlciA9IG9wdGlvbnMuY29udHJvbGxlcjtcbiAgICB2YXIgY29udHJvbGxlckFzID0gb3B0aW9ucy5jb250cm9sbGVyQXM7XG4gICAgdmFyIHJlc29sdmUgPSBhbmd1bGFyLmV4dGVuZCh7fSwgb3B0aW9ucy5yZXNvbHZlKTtcbiAgICB2YXIgYmluZFRvQ29udHJvbGxlciA9IG9wdGlvbnMuYmluZFRvQ29udHJvbGxlcjtcblxuICAgIGFuZ3VsYXIuZm9yRWFjaChyZXNvbHZlLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJlc29sdmVba2V5XSA9ICRpbmplY3Rvci5nZXQodmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVXNlIGNvbW1hIGV4cHJlc3Npb24gdG8gZGlzYWJsZSBiYWJlbC1wbHVnaW4tYW5ndWxhci1hbm5vdGF0ZVxuICAgICAgICAvLyBPdGhlcndpc2UgaXMgZmFpbHMgd2l0aCBcIk1heGltdW0gY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIgZXJyb3JcbiAgICAgICAgcmVzb2x2ZVtrZXldID0gJGluamVjdG9yLmludm9rZSgoMCwgdmFsdWUpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc29sdmUsIG9wdGlvbnMubG9jYWxzKTtcblxuICAgIHJldHVybiAkcS5hbGwocmVzb2x2ZSkudGhlbihmdW5jdGlvbiAobG9jYWxzKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IG9wdGlvbnMuZWxlbWVudCB8fCBhbmd1bGFyLmVsZW1lbnQoJzxkaXY+JykuaHRtbCh0ZW1wbGF0ZS50cmltKCkpLmNvbnRlbnRzKCk7XG4gICAgICB2YXIgbGlua0ZuID0gJGNvbXBpbGUoZWxlbWVudCwgbG9jYWxzLiR0cmFuc2NsdWRlKTtcbiAgICAgIGxvY2Fscy4kZWxlbWVudCA9IGVsZW1lbnQ7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxvY2FsczogbG9jYWxzLFxuICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiBsaW5rKHNjb3BlKSB7XG4gICAgICAgICAgbG9jYWxzLiRzY29wZSA9IHNjb3BlO1xuXG4gICAgICAgICAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgIHZhciBpbnZva2VDdHJsID0gJGNvbnRyb2xsZXIoY29udHJvbGxlciwgbG9jYWxzLCB0cnVlKTtcblxuICAgICAgICAgICAgaWYgKGJpbmRUb0NvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgICAgYW5ndWxhci5leHRlbmQoaW52b2tlQ3RybC5pbnN0YW5jZSwgbG9jYWxzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGN0cmwgPSBpbnZva2VDdHJsKCk7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnJG5nQ29udHJvbGxlckNvbnRyb2xsZXInLCBjdHJsKTtcblxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJBcykge1xuICAgICAgICAgICAgICBzY29wZVtjb250cm9sbGVyQXNdID0gY3RybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gbGlua0ZuKHNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcbn1dKTtcblxuZXhwb3J0IGRlZmF1bHQgYW5ndWxhck1vZHVsZS5uYW1lO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9jb21waWxlci1uZy9jb21waWxlci1uZy5qc1xuLy8gbW9kdWxlIGlkID0gNTY1XG4vLyBtb2R1bGUgY2h1bmtzID0gNSAxMSAxNCAxMDIgMTQwIDIyOSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///565\n");

/***/ })

/******/ });