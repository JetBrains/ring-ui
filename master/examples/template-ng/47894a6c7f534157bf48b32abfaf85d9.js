!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=1197)}({0:function(e,t){e.exports=vendor_lib},1:function(e,t,n){e.exports=n(0)(452)},1197:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(47),o=n.n(r);n(441),o.a.module("Example.template-ng",["Ring.template"])},18:function(e,t,n){e.exports=n(0)(359)},3:function(e,t,n){e.exports=n(0)(476)},416:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),e}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.d(t,"a",function(){return i});var i=function(){function e(){for(var t=this,n=arguments.length,o=new Array(n),c=0;c<n;c++)o[c]=arguments[c];r(this,e),u(this,"$inject",{}),this.constructor.$inject.forEach(function(e,n){t.$inject[e]=o[n]})}return c(e,null,[{key:"controller",get:function(){return this}}]),e}();u(i,"$inject",[])},441:function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t,n){return t&&c(e.prototype,t),n&&c(e,n),e}function i(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?l(e):t}function a(e){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function f(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t)}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var y=n(18),b=(n.n(y),n(3)),m=(n.n(b),n(1)),d=(n.n(m),n(47)),h=n.n(d),v=n(416),$=h.a.module("Ring.template",[]),j=function(e){function t(){var e,n;o(this,t);for(var r=arguments.length,c=new Array(r),u=0;u<r;u++)c[u]=arguments[u];n=i(this,(e=a(t)).call.apply(e,[this].concat(c))),s(l(n),"currentScope",null),s(l(n),"render",function(e){var t=n.$inject,r=t.$scope,o=t.$element,c=t.$compile;n.cleanup(),n.currentScope=r.$new(),n.currentScope.$evalAsync(function(){o.html(e),n.addInnerClass(),c(o.contents())(n.currentScope)})}),s(l(n),"addInnerClass",function(){var e=n.$inject.$attrs.rgTemplateClass;e&&n.$inject.$element.contents().addClass(e)});var f=n.$inject,p=f.$scope,y=f.$attrs;return p.$watch(y.rgTemplate||y.template,n.render),n}return f(t,e),u(t,[{key:"cleanup",value:function(){this.currentScope&&(this.currentScope.$destroy(),this.currentScope=null)}}]),t}(v.a);s(j,"$inject",["$scope","$element","$attrs","$compile"]),$.directive("rgTemplate",function(){return{controller:j}}),t.a=$.name},47:function(e,t,n){e.exports=n(0)(258)}});