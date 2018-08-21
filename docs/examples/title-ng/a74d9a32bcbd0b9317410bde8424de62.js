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
/******/ 	return __webpack_require__(__webpack_require__.s = 1201);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(53);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__jetbrains_ring_ui_components_title_ng_title_ng__ = __webpack_require__(992);\n\n\n\n\n\n__WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('test', [__WEBPACK_IMPORTED_MODULE_1__jetbrains_ring_ui_components_title_ng_title_ng__[\"a\" /* default */]]).run(['pageTitle', function (pageTitle) {\n  pageTitle.addElement('Some page');\n}]);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTIwMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2NvbXBvbmVudHMvdGl0bGUtbmcvdGl0bGUtbmcuanM/N2RjNiJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBhbmd1bGFyIGZyb20gJ2FuZ3VsYXInO1xuaW1wb3J0IFRpdGxlTmcgZnJvbSAnQGpldGJyYWlucy9yaW5nLXVpL2NvbXBvbmVudHMvdGl0bGUtbmcvdGl0bGUtbmcnO1xuXG5hbmd1bGFyLm1vZHVsZSgndGVzdCcsIFtUaXRsZU5nXSkucnVuKFsncGFnZVRpdGxlJywgZnVuY3Rpb24gKHBhZ2VUaXRsZSkge1xuICBwYWdlVGl0bGUuYWRkRWxlbWVudCgnU29tZSBwYWdlJyk7XG59XSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLWxvYWRlci9saWI/Y2FjaGVEaXJlY3RvcnkhLi9+L2RvY3BhY2stZXhhbXBsZXMtY29tcGlsZXIvbGliL2xvYWRlci5qcz97XCJwYXRoXCI6XCI1MTYuY29udGVudFwiLFwiaGFzaFwiOlwiYTc0ZDlhMzJiY2JkMGI5MzE3NDEwYmRlODQyNGRlNjJcIn0hLi9jb21wb25lbnRzL3RpdGxlLW5nL3RpdGxlLW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAxMjAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMjI4Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///1201\n");

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = vendor_lib;

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(402);

/***/ }),

/***/ 992:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(53);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);\n\n\n/**\n * @name Title Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description A component for manipulating page title.\n * @example\n   <example name=\"Title Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"test\">\n        <h4>Open the example in a separate tab to see how tab title changes.</h4>\n\n        <!--It is better to use this directive with <title> tag in your <head> section.-->\n        <div rg-page-title=\"App name\"></rg-page-title>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import TitleNg from '@jetbrains/ring-ui/components/title-ng/title-ng';\n\n      angular.module('test', [TitleNg]).\n        run(function (pageTitle) {\n          pageTitle.addElement('Some page');\n        });\n    </file>\n   </example>\n */\n\n\nvar angularModule = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('Ring.title', []);\n\nangularModule.directive('rgPageTitle', [function rgPageTitleDirective() {\n  return {\n    scope: {\n      rgPageTitle: '@?',\n      noTitle: '@?',\n      delimiter: '@'\n    },\n\n    controller: ['$rootScope', '$scope', '$element', '$attrs', 'pageTitle', '$injector', function controller($rootScope, $scope, $element, $attrs, pageTitle, $injector) {\n      var element = $element[0];\n\n      // Get title prefix from title element\n      var elementText = element.textContent;\n      var offScopeWatch = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.noop;\n\n      // Set page title on route change\n      var offRouteWatch = $rootScope.$on('$routeChangeSuccess', function (event, current) {\n        //Do nothing if we're being redirected\n        if (current.$$route && current.$$route.redirectTo) {\n          // eslint-disable-line angular/no-private-call\n          return;\n        }\n        var routeTitle = current.$$route && current.$$route.title; // eslint-disable-line angular/no-private-call\n\n        pageTitle.setCurrent($scope.rgPageTitle || elementText);\n\n        // Use title: false to prevent title change on route\n        if (routeTitle !== false) {\n          if (__WEBPACK_IMPORTED_MODULE_0_angular___default.a.isArray(routeTitle) || __WEBPACK_IMPORTED_MODULE_0_angular___default.a.isFunction(routeTitle)) {\n            //Invoke injector\n            routeTitle = $injector.invoke(routeTitle);\n          }\n          pageTitle.addElement(routeTitle || $scope.noTitle);\n        }\n      });\n\n      $scope.$on('$destroy', function () {\n        offRouteWatch();\n        offScopeWatch();\n      });\n\n      this.$onInit = function () {\n        pageTitle.setDelimiter($scope.delimiter);\n\n        if ($attrs.rgPageTitle) {\n          offScopeWatch = $scope.$watch('rgPageTitle', function (newBaseTitle) {\n            pageTitle.setRootElement(newBaseTitle);\n          });\n        }\n      };\n    }]\n  };\n}]);\n\nangularModule.service('pageTitle', ['$interpolate', '$document', function service($interpolate, $document) {\n  var _this = this;\n\n  var delimiter = ' | ';\n  var current = $document[0].title;\n\n  function setTitle(text) {\n    current = text && $interpolate(text)();\n    updateDocumentTitle(current);\n  }\n\n  function updateDocumentTitle(text) {\n    $document[0].title = text;\n  }\n\n  function prepend(element) {\n    setTitle(current ? element + delimiter + current : element);\n  }\n\n  function replacePart(element) {\n    var replaceIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n    var titleElements = current.split(delimiter);\n    titleElements[replaceIndex === -1 ? titleElements.length - 1 : replaceIndex] = element;\n\n    setTitle(titleElements.join(delimiter));\n  }\n\n  this.setDelimiter = function (newDelimiter) {\n    delimiter = newDelimiter || delimiter;\n  };\n\n  this.setCurrent = function (newBase) {\n    current = newBase;\n  };\n\n  this.setText = function (text) {\n    return updateDocumentTitle(text);\n  };\n\n  this.addElement = function (element, fieldName) {\n    if (element.$promise) {\n      element.$promise.then(function (Data) {\n        _this.addElement(Data[fieldName || 'name']);\n      });\n    } else {\n      prepend(fieldName ? element[fieldName] : element);\n    }\n  };\n\n  this.updateElement = function (element, fieldName) {\n    if (element.$promise) {\n      element.$promise.then(function (Data) {\n        _this.updateElement(Data[fieldName || 'name']);\n      });\n    } else {\n      replacePart(fieldName ? element[fieldName] : element);\n    }\n  };\n\n  this.setRootElement = function (element) {\n    replacePart(element, -1);\n  };\n}]);\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (angularModule.name);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOTkyLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy90aXRsZS1uZy90aXRsZS1uZy5qcz9kZDQ4Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmFtZSBUaXRsZSBOZ1xuICogQGNhdGVnb3J5IExlZ2FjeSBBbmd1bGFyXG4gKiBAdGFncyBSaW5nIFVJIExhbmd1YWdlXG4gKiBAZGVzY3JpcHRpb24gQSBjb21wb25lbnQgZm9yIG1hbmlwdWxhdGluZyBwYWdlIHRpdGxlLlxuICogQGV4YW1wbGVcbiAgIDxleGFtcGxlIG5hbWU9XCJUaXRsZSBOZ1wiPlxuICAgIDxmaWxlIG5hbWU9XCJpbmRleC5odG1sXCI+XG4gICAgICA8ZGl2IG5nLWFwcD1cInRlc3RcIj5cbiAgICAgICAgPGg0Pk9wZW4gdGhlIGV4YW1wbGUgaW4gYSBzZXBhcmF0ZSB0YWIgdG8gc2VlIGhvdyB0YWIgdGl0bGUgY2hhbmdlcy48L2g0PlxuXG4gICAgICAgIDwhLS1JdCBpcyBiZXR0ZXIgdG8gdXNlIHRoaXMgZGlyZWN0aXZlIHdpdGggPHRpdGxlPiB0YWcgaW4geW91ciA8aGVhZD4gc2VjdGlvbi4tLT5cbiAgICAgICAgPGRpdiByZy1wYWdlLXRpdGxlPVwiQXBwIG5hbWVcIj48L3JnLXBhZ2UtdGl0bGU+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpbGU+XG4gICAgPGZpbGUgbmFtZT1cImluZGV4LmpzXCI+XG4gICAgICBpbXBvcnQgYW5ndWxhciBmcm9tICdhbmd1bGFyJztcbiAgICAgIGltcG9ydCBUaXRsZU5nIGZyb20gJ0BqZXRicmFpbnMvcmluZy11aS9jb21wb25lbnRzL3RpdGxlLW5nL3RpdGxlLW5nJztcblxuICAgICAgYW5ndWxhci5tb2R1bGUoJ3Rlc3QnLCBbVGl0bGVOZ10pLlxuICAgICAgICBydW4oZnVuY3Rpb24gKHBhZ2VUaXRsZSkge1xuICAgICAgICAgIHBhZ2VUaXRsZS5hZGRFbGVtZW50KCdTb21lIHBhZ2UnKTtcbiAgICAgICAgfSk7XG4gICAgPC9maWxlPlxuICAgPC9leGFtcGxlPlxuICovXG5pbXBvcnQgYW5ndWxhciBmcm9tICdhbmd1bGFyJztcblxudmFyIGFuZ3VsYXJNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnUmluZy50aXRsZScsIFtdKTtcblxuYW5ndWxhck1vZHVsZS5kaXJlY3RpdmUoJ3JnUGFnZVRpdGxlJywgW2Z1bmN0aW9uIHJnUGFnZVRpdGxlRGlyZWN0aXZlKCkge1xuICByZXR1cm4ge1xuICAgIHNjb3BlOiB7XG4gICAgICByZ1BhZ2VUaXRsZTogJ0A/JyxcbiAgICAgIG5vVGl0bGU6ICdAPycsXG4gICAgICBkZWxpbWl0ZXI6ICdAJ1xuICAgIH0sXG5cbiAgICBjb250cm9sbGVyOiBbJyRyb290U2NvcGUnLCAnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsICdwYWdlVGl0bGUnLCAnJGluamVjdG9yJywgZnVuY3Rpb24gY29udHJvbGxlcigkcm9vdFNjb3BlLCAkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsIHBhZ2VUaXRsZSwgJGluamVjdG9yKSB7XG4gICAgICB2YXIgZWxlbWVudCA9ICRlbGVtZW50WzBdO1xuXG4gICAgICAvLyBHZXQgdGl0bGUgcHJlZml4IGZyb20gdGl0bGUgZWxlbWVudFxuICAgICAgdmFyIGVsZW1lbnRUZXh0ID0gZWxlbWVudC50ZXh0Q29udGVudDtcbiAgICAgIHZhciBvZmZTY29wZVdhdGNoID0gYW5ndWxhci5ub29wO1xuXG4gICAgICAvLyBTZXQgcGFnZSB0aXRsZSBvbiByb3V0ZSBjaGFuZ2VcbiAgICAgIHZhciBvZmZSb3V0ZVdhdGNoID0gJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZXZlbnQsIGN1cnJlbnQpIHtcbiAgICAgICAgLy9EbyBub3RoaW5nIGlmIHdlJ3JlIGJlaW5nIHJlZGlyZWN0ZWRcbiAgICAgICAgaWYgKGN1cnJlbnQuJCRyb3V0ZSAmJiBjdXJyZW50LiQkcm91dGUucmVkaXJlY3RUbykge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYW5ndWxhci9uby1wcml2YXRlLWNhbGxcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJvdXRlVGl0bGUgPSBjdXJyZW50LiQkcm91dGUgJiYgY3VycmVudC4kJHJvdXRlLnRpdGxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGFuZ3VsYXIvbm8tcHJpdmF0ZS1jYWxsXG5cbiAgICAgICAgcGFnZVRpdGxlLnNldEN1cnJlbnQoJHNjb3BlLnJnUGFnZVRpdGxlIHx8IGVsZW1lbnRUZXh0KTtcblxuICAgICAgICAvLyBVc2UgdGl0bGU6IGZhbHNlIHRvIHByZXZlbnQgdGl0bGUgY2hhbmdlIG9uIHJvdXRlXG4gICAgICAgIGlmIChyb3V0ZVRpdGxlICE9PSBmYWxzZSkge1xuICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkocm91dGVUaXRsZSkgfHwgYW5ndWxhci5pc0Z1bmN0aW9uKHJvdXRlVGl0bGUpKSB7XG4gICAgICAgICAgICAvL0ludm9rZSBpbmplY3RvclxuICAgICAgICAgICAgcm91dGVUaXRsZSA9ICRpbmplY3Rvci5pbnZva2Uocm91dGVUaXRsZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhZ2VUaXRsZS5hZGRFbGVtZW50KHJvdXRlVGl0bGUgfHwgJHNjb3BlLm5vVGl0bGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9mZlJvdXRlV2F0Y2goKTtcbiAgICAgICAgb2ZmU2NvcGVXYXRjaCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuJG9uSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcGFnZVRpdGxlLnNldERlbGltaXRlcigkc2NvcGUuZGVsaW1pdGVyKTtcblxuICAgICAgICBpZiAoJGF0dHJzLnJnUGFnZVRpdGxlKSB7XG4gICAgICAgICAgb2ZmU2NvcGVXYXRjaCA9ICRzY29wZS4kd2F0Y2goJ3JnUGFnZVRpdGxlJywgZnVuY3Rpb24gKG5ld0Jhc2VUaXRsZSkge1xuICAgICAgICAgICAgcGFnZVRpdGxlLnNldFJvb3RFbGVtZW50KG5ld0Jhc2VUaXRsZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfV1cbiAgfTtcbn1dKTtcblxuYW5ndWxhck1vZHVsZS5zZXJ2aWNlKCdwYWdlVGl0bGUnLCBbJyRpbnRlcnBvbGF0ZScsICckZG9jdW1lbnQnLCBmdW5jdGlvbiBzZXJ2aWNlKCRpbnRlcnBvbGF0ZSwgJGRvY3VtZW50KSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgdmFyIGRlbGltaXRlciA9ICcgfCAnO1xuICB2YXIgY3VycmVudCA9ICRkb2N1bWVudFswXS50aXRsZTtcblxuICBmdW5jdGlvbiBzZXRUaXRsZSh0ZXh0KSB7XG4gICAgY3VycmVudCA9IHRleHQgJiYgJGludGVycG9sYXRlKHRleHQpKCk7XG4gICAgdXBkYXRlRG9jdW1lbnRUaXRsZShjdXJyZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZURvY3VtZW50VGl0bGUodGV4dCkge1xuICAgICRkb2N1bWVudFswXS50aXRsZSA9IHRleHQ7XG4gIH1cblxuICBmdW5jdGlvbiBwcmVwZW5kKGVsZW1lbnQpIHtcbiAgICBzZXRUaXRsZShjdXJyZW50ID8gZWxlbWVudCArIGRlbGltaXRlciArIGN1cnJlbnQgOiBlbGVtZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcGxhY2VQYXJ0KGVsZW1lbnQpIHtcbiAgICB2YXIgcmVwbGFjZUluZGV4ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuXG4gICAgdmFyIHRpdGxlRWxlbWVudHMgPSBjdXJyZW50LnNwbGl0KGRlbGltaXRlcik7XG4gICAgdGl0bGVFbGVtZW50c1tyZXBsYWNlSW5kZXggPT09IC0xID8gdGl0bGVFbGVtZW50cy5sZW5ndGggLSAxIDogcmVwbGFjZUluZGV4XSA9IGVsZW1lbnQ7XG5cbiAgICBzZXRUaXRsZSh0aXRsZUVsZW1lbnRzLmpvaW4oZGVsaW1pdGVyKSk7XG4gIH1cblxuICB0aGlzLnNldERlbGltaXRlciA9IGZ1bmN0aW9uIChuZXdEZWxpbWl0ZXIpIHtcbiAgICBkZWxpbWl0ZXIgPSBuZXdEZWxpbWl0ZXIgfHwgZGVsaW1pdGVyO1xuICB9O1xuXG4gIHRoaXMuc2V0Q3VycmVudCA9IGZ1bmN0aW9uIChuZXdCYXNlKSB7XG4gICAgY3VycmVudCA9IG5ld0Jhc2U7XG4gIH07XG5cbiAgdGhpcy5zZXRUZXh0ID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICByZXR1cm4gdXBkYXRlRG9jdW1lbnRUaXRsZSh0ZXh0KTtcbiAgfTtcblxuICB0aGlzLmFkZEVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgZmllbGROYW1lKSB7XG4gICAgaWYgKGVsZW1lbnQuJHByb21pc2UpIHtcbiAgICAgIGVsZW1lbnQuJHByb21pc2UudGhlbihmdW5jdGlvbiAoRGF0YSkge1xuICAgICAgICBfdGhpcy5hZGRFbGVtZW50KERhdGFbZmllbGROYW1lIHx8ICduYW1lJ10pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXBlbmQoZmllbGROYW1lID8gZWxlbWVudFtmaWVsZE5hbWVdIDogZWxlbWVudCk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBmaWVsZE5hbWUpIHtcbiAgICBpZiAoZWxlbWVudC4kcHJvbWlzZSkge1xuICAgICAgZWxlbWVudC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChEYXRhKSB7XG4gICAgICAgIF90aGlzLnVwZGF0ZUVsZW1lbnQoRGF0YVtmaWVsZE5hbWUgfHwgJ25hbWUnXSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbGFjZVBhcnQoZmllbGROYW1lID8gZWxlbWVudFtmaWVsZE5hbWVdIDogZWxlbWVudCk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuc2V0Um9vdEVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHJlcGxhY2VQYXJ0KGVsZW1lbnQsIC0xKTtcbiAgfTtcbn1dKTtcblxuZXhwb3J0IGRlZmF1bHQgYW5ndWxhck1vZHVsZS5uYW1lO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy90aXRsZS1uZy90aXRsZS1uZy5qc1xuLy8gbW9kdWxlIGlkID0gOTkyXG4vLyBtb2R1bGUgY2h1bmtzID0gMjI4Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///992\n");

/***/ })

/******/ });